import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { debounce } from '@/utils/debounce'

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should delay function execution by specified time', () => {
    const mockFn = vi.fn()
    const debouncedFn = debounce(mockFn, 1000)

    debouncedFn()
    expect(mockFn).not.toBeCalled()

    vi.advanceTimersByTime(1000)
    expect(mockFn).toBeCalledTimes(1)
  })

  it('should cancel previous timeout when called multiple times', () => {
    const mockFn = vi.fn()
    const debouncedFn = debounce(mockFn, 1000)

    debouncedFn()
    debouncedFn()
    debouncedFn()

    expect(mockFn).not.toBeCalled()

    vi.advanceTimersByTime(1000)
    expect(mockFn).toBeCalledTimes(1)
  })

  it('should pass arguments to the debounced function', () => {
    const mockFn = vi.fn()
    const debouncedFn = debounce(mockFn, 1000)

    debouncedFn('test', 123)
    vi.advanceTimersByTime(1000)

    expect(mockFn).toBeCalledWith('test', 123)
  })

  it('should handle multiple calls with different arguments', () => {
    const mockFn = vi.fn()
    const debouncedFn = debounce(mockFn, 1000)

    debouncedFn('first')
    debouncedFn('second')
    debouncedFn('third')

    vi.advanceTimersByTime(1000)
    expect(mockFn).toBeCalledWith('third')
  })

  it('should handle zero delay', () => {
    const mockFn = vi.fn()
    const debouncedFn = debounce(mockFn, 0)

    debouncedFn()
    expect(mockFn).toBeCalledTimes(1)
  })

  it('should handle negative delay', () => {
    const mockFn = vi.fn()
    const debouncedFn = debounce(mockFn, -1000)

    debouncedFn()
    expect(mockFn).toBeCalledTimes(1)
  })
}) 