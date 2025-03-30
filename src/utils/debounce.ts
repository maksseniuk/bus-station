export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: number | null = null

  return function (...args: Parameters<T>) {
    if (timeoutId) {
      window.clearTimeout(timeoutId)
    }

    // If delay is 0 or negative, execute immediately
    if (delay <= 0) {
      fn(...args)
      return
    }

    timeoutId = window.setTimeout(() => {
      fn(...args)
    }, delay)
  }
} 