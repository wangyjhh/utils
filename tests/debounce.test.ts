import { log } from 'node:console'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { debounce } from '../src'

describe('debounce', () => {
    beforeEach(() => {
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('should debounce multiple calls', () => {
        const mockFn = vi.fn()
        const debounced = debounce(mockFn, 200)

        // 快速调用三次
        debounced(1)
        debounced(2)
        debounced(3)

        // 时间尚未推进，不应执行
        expect(mockFn).not.toHaveBeenCalled()

        // 推进 199ms (仍不应执行)
        vi.advanceTimersByTime(199)
        expect(mockFn).not.toHaveBeenCalled()

        // 推进 1ms (总共 200ms)
        vi.advanceTimersByTime(1)
        expect(mockFn).toHaveBeenCalledTimes(1)
        expect(mockFn).toHaveBeenCalledWith(3)
    })

    it('should fire immediately if leading is true', () => {
        const mockFn = vi.fn()
        const debounced = debounce(mockFn, 200, { leading: true })

        // 快速调用三次
        debounced(1)
        debounced(2)
        debounced(3)

        expect(mockFn).toHaveBeenCalledTimes(1)
        expect(mockFn).toHaveBeenCalledWith(1)

        // 推进 199ms (仍不应执行)
        vi.advanceTimersByTime(199)
        expect(mockFn).toHaveBeenCalledTimes(1)
        expect(mockFn).toHaveBeenCalledWith(1)

        // 推进 1ms (总共 200ms)
        vi.advanceTimersByTime(1)
        expect(mockFn).toHaveBeenCalledTimes(2)
    })
})
