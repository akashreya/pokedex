type ThrottleTask = () => Promise<any>;

let queue: ThrottleTask[] = [];
let isProcessing = false;
let delay = 100;

export function setThrottleDelay(ms: number) {
  delay = ms;
}

export function throttleRequest<T>(task: () => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    queue.push(async () => {
      try {
        const result = await task();
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
    processQueue();
  });
}

async function processQueue() {
  if (isProcessing) return;
  isProcessing = true;
  while (queue.length > 0) {
    const task = queue.shift();
    if (task) {
      try {
        await task();
      } catch {}
      await wait(delay);
    }
  }
  isProcessing = false;
}

function wait(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

// Exponential backoff utility for rate limit errors
export async function withExponentialBackoff<T>(fn: () => Promise<T>, maxRetries = 5, baseDelay = 500): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (err: any) {
      if (err.status === 429 && attempt < maxRetries) {
        const waitTime = baseDelay * Math.pow(2, attempt);
        await wait(waitTime);
        attempt++;
      } else {
        throw err;
      }
    }
  }
} 