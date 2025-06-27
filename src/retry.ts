import { log } from 'node:console'

interface RetryOptions {
    taskName?: string
    maxRetries?: number
    retryDelay?: number
}

export async function retry<T>(
    asyncFn: () => Promise<T>,
    options: RetryOptions = {
        taskName: '异步函数',
        maxRetries: 10,
        retryDelay: 2000,
    },
): Promise<T> {
    let lastError: unknown = null

    for (let attempt = 1; attempt <= options.maxRetries!; attempt++) {
        try {
            // 尝试执行异步函数
            return await asyncFn()
        }
        catch (error) {
            lastError = error
            log(`[ ${options.taskName} ] 第 ${attempt} 次调用失败, 准备再次尝试`)

            if (attempt < options.maxRetries!) {
                const delay = options.retryDelay // 延迟2秒后再次尝试
                await new Promise(resolve => setTimeout(resolve, delay))
            }
        }
    }

    // 所有尝试都失败后抛出错误
    throw new Error(`失败${options.maxRetries}次. 最后一次错误: ${lastError instanceof Error ? lastError.message : String(lastError)}`)
}
