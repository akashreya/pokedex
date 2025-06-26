import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals';

export interface PerformanceMetrics {
  CLS: number;
  FID: number;
  FCP: number;
  LCP: number;
  TTFB: number;
}

export interface UserTiming {
  name: string;
  value: number;
  label?: string;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Partial<PerformanceMetrics> = {};
  private userTimings: UserTiming[] = [];

  private constructor() {
    this.initializeWebVitals();
    this.setupErrorLogging();
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private initializeWebVitals(): void {
    // Core Web Vitals
    onCLS(this.reportWebVital.bind(this, 'CLS'));
    onFID(this.reportWebVital.bind(this, 'FID'));
    onFCP(this.reportWebVital.bind(this, 'FCP'));
    onLCP(this.reportWebVital.bind(this, 'LCP'));
    onTTFB(this.reportWebVital.bind(this, 'TTFB'));
  }

  private reportWebVital(metricName: keyof PerformanceMetrics, metric: any): void {
    this.metrics[metricName] = metric.value;
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`${metricName}:`, metric.value);
    }

    // Send to analytics service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalytics(metricName, metric);
    }
  }

  private sendToAnalytics(metricName: string, metric: any): void {
    // TODO: Replace with actual analytics service (Google Analytics, Sentry, etc.)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', metricName, {
        value: Math.round(metric.value),
        metric_id: metric.id,
        metric_value: metric.value,
        metric_delta: metric.delta
      });
    }
  }

  private setupErrorLogging(): void {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.logError('Global Error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error?.stack
      });
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.logError('Unhandled Promise Rejection', {
        reason: event.reason,
        promise: event.promise
      });
    });
  }

  logError(type: string, details: any): void {
    const errorData = {
      type,
      details,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error logged:', errorData);
    }

    // Send to error logging service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToErrorService(errorData);
    }
  }

  private sendToErrorService(errorData: any): void {
    // TODO: Replace with actual error logging service (Sentry, LogRocket, etc.)
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(new Error(errorData.type), {
        extra: errorData
      });
    }
  }

  markUserTiming(name: string, label?: string): void {
    const timing: UserTiming = {
      name,
      value: performance.now(),
      label
    };

    this.userTimings.push(timing);
    performance.mark(name);

    if (process.env.NODE_ENV === 'development') {
      console.log(`User timing marked: ${name}`, timing);
    }
  }

  measureUserTiming(name: string, startMark: string, endMark: string): void {
    try {
      performance.measure(name, startMark, endMark);
      const measure = performance.getEntriesByName(name)[0];
      
      if (measure) {
        this.userTimings.push({
          name,
          value: measure.duration,
          label: 'measured'
        });

        if (process.env.NODE_ENV === 'development') {
          console.log(`User timing measured: ${name}`, measure.duration);
        }
      }
    } catch (error) {
      console.warn(`Failed to measure timing: ${name}`, error);
    }
  }

  getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  getUserTimings(): UserTiming[] {
    return [...this.userTimings];
  }

  // Performance budget checking
  checkPerformanceBudget(): { passed: boolean; issues: string[] } {
    const issues: string[] = [];
    const budget = {
      CLS: 0.1,
      FID: 100,
      FCP: 1800,
      LCP: 2500,
      TTFB: 600
    };

    Object.entries(this.metrics).forEach(([metric, value]) => {
      const budgetValue = budget[metric as keyof PerformanceMetrics];
      if (budgetValue && value > budgetValue) {
        issues.push(`${metric} exceeded budget: ${value} > ${budgetValue}`);
      }
    });

    return {
      passed: issues.length === 0,
      issues
    };
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();

// Export convenience functions
export const markTiming = (name: string, label?: string) => 
  performanceMonitor.markUserTiming(name, label);

export const measureTiming = (name: string, startMark: string, endMark: string) => 
  performanceMonitor.measureUserTiming(name, startMark, endMark);

export const logError = (type: string, details: any) => 
  performanceMonitor.logError(type, details); 