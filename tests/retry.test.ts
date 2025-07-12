import { log } from 'node:console'
import { describe, expect, it } from 'vitest'
import { createMockAsyncTask, retry } from '../src'

describe('retry', () => {
    it('retry error', async () => {
        // 为每个任务创建独立的 mock 函数
        const taskMap = [1, 2, 3, 4, 5, 6].map((i) => {
            const mockTask = createMockAsyncTask({
                mode: 'error',
                errorReturn: {
                    status: 1,
                    message: 'error',
                },
                successReturn: {
                    status: 0,
                    message: 'success',
                },
            })
            return retry(() => mockTask(i), {
                taskName: '获取客流',
                maxRetries: 5,
                retryDelay: 500,
            })
        })

        const results = await Promise.allSettled(taskMap)
        log(results)
    })
    it('retry success but return error status', async () => {
        const mockTask = createMockAsyncTask(
            {
                mode: 'success',
                errorReturn: {
                    status: 1,
                    message: 'error',
                },
                successReturn: {
                    status: 0,
                    message: 'success',
                },
            },
        )
        const task = await retry(() => mockTask(), {
            validateResult: res => res.status === 0,
        })
        log(task)
    })
})
