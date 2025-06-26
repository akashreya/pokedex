export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  retryable: boolean;
}

export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

const defaultRetryConfig: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2
};

export class ApiErrorHandler {
  private static instance: ApiErrorHandler;
  private retryConfig: RetryConfig;

  private constructor(config: RetryConfig = defaultRetryConfig) {
    this.retryConfig = config;
  }

  static getInstance(config?: RetryConfig): ApiErrorHandler {
    if (!ApiErrorHandler.instance) {
      ApiErrorHandler.instance = new ApiErrorHandler(config);
    }
    return ApiErrorHandler.instance;
  }

  private calculateDelay(attempt: number): number {
    const delay = this.retryConfig.baseDelay * Math.pow(this.retryConfig.backoffMultiplier, attempt);
    return Math.min(delay, this.retryConfig.maxDelay);
  }

  private isRetryableError(error: ApiError): boolean {
    if (!error.retryable) return false;
    
    // Retry on network errors, 5xx server errors, and rate limiting
    return !error.status || 
           (error.status >= 500 && error.status < 600) || 
           error.status === 429;
  }

  async withRetry<T>(
    operation: () => Promise<T>,
    customConfig?: Partial<RetryConfig>
  ): Promise<T> {
    const config = { ...this.retryConfig, ...customConfig };
    let lastError: ApiError;

    for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = this.normalizeError(error);
        
        if (attempt === config.maxRetries || !this.isRetryableError(lastError)) {
          throw lastError;
        }

        const delay = this.calculateDelay(attempt);
        console.warn(`API call failed, retrying in ${delay}ms (attempt ${attempt + 1}/${config.maxRetries + 1})`, lastError);
        
        await this.sleep(delay);
      }
    }

    throw lastError!;
  }

  private normalizeError(error: unknown): ApiError {
    if (error instanceof Error) {
      return {
        message: error.message,
        retryable: true,
        code: 'UNKNOWN_ERROR'
      };
    }

    if (typeof error === 'string') {
      return {
        message: error,
        retryable: true,
        code: 'UNKNOWN_ERROR'
      };
    }

    if (error && typeof error === 'object' && 'message' in error) {
      return {
        message: String(error.message),
        status: 'status' in error ? Number(error.status) : undefined,
        code: 'code' in error ? String(error.code) : undefined,
        retryable: 'retryable' in error ? Boolean(error.retryable) : true
      };
    }

    return {
      message: 'An unknown error occurred',
      retryable: true,
      code: 'UNKNOWN_ERROR'
    };
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  createUserFriendlyMessage(error: ApiError): string {
    switch (error.status) {
      case 400:
        return 'Invalid request. Please check your input and try again.';
      case 401:
        return 'Authentication required. Please log in and try again.';
      case 403:
        return 'Access denied. You don\'t have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
        return 'Server error. Please try again later.';
      case 502:
      case 503:
      case 504:
        return 'Service temporarily unavailable. Please try again later.';
      default:
        return error.message || 'An unexpected error occurred. Please try again.';
    }
  }
}

// Export singleton instance
export const apiErrorHandler = ApiErrorHandler.getInstance(); 