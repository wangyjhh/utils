import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
// throttle.test.ts
import { throttle } from '../src'

describe('throttle', () => {
    // 使用 fake timers 控制时间
    beforeEach(() => {
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('should execute immediately on first call', () => {
        const mockFn = vi.fn()
        const throttled = throttle(mockFn, 200)

        throttled(1)

        // 第一次调用应该立即执行
        expect(mockFn).toHaveBeenCalledTimes(1)
        expect(mockFn).toHaveBeenCalledWith(1)
    })

    it('should throttle multiple calls within interval', () => {
        const mockFn = vi.fn()
        const throttled = throttle(mockFn, 200)

        // 第一次调用 (立即执行)
        throttled(1)
        expect(mockFn).toHaveBeenCalledWith(1)

        // 100ms 后第二次调用 (被忽略)
        vi.advanceTimersByTime(100)
        throttled(2)
        expect(mockFn).toHaveBeenCalledTimes(1) // 仍然只有一次调用

        // 再推进 100ms (总共 200ms)
        vi.advanceTimersByTime(100)
        // 应该执行最后一次调用 (2)
        expect(mockFn).toHaveBeenCalledTimes(2)
        expect(mockFn).toHaveBeenCalledWith(2)
    })

    it('should capture the last call within interval', () => {
        const mockFn = vi.fn()
        const throttled = throttle(mockFn, 200)

        // 第一次调用 (立即执行)
        throttled(1)

        // 快速连续调用多次
        vi.advanceTimersByTime(50)
        throttled(2)
        vi.advanceTimersByTime(50)
        throttled(3)
        vi.advanceTimersByTime(50)
        throttled(4)

        // 此时只执行了第一次调用
        expect(mockFn).toHaveBeenCalledTimes(1)

        // 推进到 200ms (第一次调用后200ms)
        vi.advanceTimersByTime(50) // 50+50+50+50=200
        expect(mockFn).toHaveBeenCalledTimes(2)
        
        expect(mockFn).toHaveBeenCalledWith(4) // 执行最后一次调用
    })

    it('should preserve function context', () => {
        const context = {
            value: 0,
            increment(amount: number) {
                this.value += amount
            },
        }

        context.increment = throttle(context.increment.bind(context), 200)

        // 第一次调用
        context.increment(5)
        expect(context.value).toBe(5)

        // 第二次调用 (在节流间隔内)
        context.increment(10)
        expect(context.value).toBe(5) // 尚未执行

        // 推进时间
        vi.advanceTimersByTime(200)
        expect(context.value).toBe(15) // 执行最后一次调用
    })

    it('should handle multiple arguments', () => {
        const mockFn = vi.fn()
        const throttled = throttle(mockFn, 200)

        throttled('a', 1)
        expect(mockFn).toHaveBeenCalledWith('a', 1)

        throttled('b', 2)
        vi.advanceTimersByTime(200)
        expect(mockFn).toHaveBeenCalledWith('b', 2)
    })

    it('should reset after interval', () => {
        const mockFn = vi.fn()
        const throttled = throttle(mockFn, 200)

        // 第一次调用
        throttled(1)
        expect(mockFn).toHaveBeenCalledTimes(1)

        // 推进 200ms 后再次调用 (应该立即执行)
        vi.advanceTimersByTime(200)
        throttled(2)
        expect(mockFn).toHaveBeenCalledTimes(2)
        expect(mockFn).toHaveBeenCalledWith(2)

        // 短时间内再次调用 (被忽略)
        throttled(3)
        expect(mockFn).toHaveBeenCalledTimes(2)

        // 推进时间后执行最后一次
        vi.advanceTimersByTime(200)
        expect(mockFn).toHaveBeenCalledTimes(3)
        expect(mockFn).toHaveBeenCalledWith(3)
    })

    it('should handle rapid fire calls correctly', () => {
        const mockFn = vi.fn()
        const throttled = throttle(mockFn, 200)
        const callCount = 10

        // 快速调用10次
        for (let i = 1; i <= callCount; i++) {
            throttled(i)
            vi.advanceTimersByTime(20) // 每次调用间隔20ms
        }

        // 现在应该执行了第二次调用（最后一次）
        expect(mockFn).toHaveBeenCalledTimes(2)
        expect(mockFn).toHaveBeenCalledWith(callCount) // 10
    })
})
