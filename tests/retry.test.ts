import { log } from 'node:console'
import { expect, it } from 'vitest'
import { createMockAsyncTask, retry } from '../src'

it('retry', async () => {
    // 为每个任务创建独立的 mock 函数
    const taskMap = [1, 2, 3, 4, 5, 6].map((i) => {
        const mockTask = createMockAsyncTask()
        return retry(() => mockTask(i), {
            taskName: '获取客流',
            maxRetries: 5,
            retryDelay: 500,
        })
    })

    const results = await Promise.allSettled(taskMap)
    log(results)
})
