import { log } from 'node:console'

interface RetryOptions<T = any> {
    taskName?: string
    maxRetries?: number
    retryDelay?: number
    validateResult?: (result: T) => boolean
}

export async function retry<T>(
    asyncFn: () => Promise<T>,
    options: RetryOptions<T> = {
        taskName: '异步函数',
        maxRetries: 10,
        retryDelay: 2000,
    },
): Promise<T> {
    // 合并默认选项（关键修复）
    const finalOptions = {
        taskName: '异步函数',
        maxRetries: 10,
        retryDelay: 2000,
        ...options,
    }

    let lastError: unknown = null
    let lastInvalidResult: T | null = null

    for (let attempt = 1; attempt <= finalOptions.maxRetries; attempt++) {
        try {
            const result = await asyncFn()

            // 验证结果
            if (finalOptions.validateResult && !finalOptions.validateResult(result)) {
                lastInvalidResult = result
                // 仅在不是最后一次尝试时记录重试消息
                if (attempt < finalOptions.maxRetries) {
                    log(`[ ${finalOptions.taskName} ] 第 ${attempt} 次调用返回无效结果, 准备重试`)
                }

                // 如果是最后一次尝试，抛出错误
                if (attempt === finalOptions.maxRetries) {
                    throw new Error(`返回结果验证失败`)
                }

                // 等待延迟后继续重试
                await new Promise(resolve => setTimeout(resolve, finalOptions.retryDelay))
                continue
            }

            return result
        }
        catch (error) {
            lastError = error
            // 仅在不是最后一次尝试时记录重试消息
            if (attempt < finalOptions.maxRetries) {
                log(`[ ${finalOptions.taskName} ] 第 ${attempt} 次调用失败, 准备重试`)
            }

            if (attempt < finalOptions.maxRetries) {
                await new Promise(resolve => setTimeout(resolve, finalOptions.retryDelay))
            }
        }
    }

    // 构建最终错误信息（修复了未定义值的问题）
    let errorMessage = `[${finalOptions.taskName}] 失败${finalOptions.maxRetries}次。`
    if (lastError) {
        errorMessage += ` 最后一次错误: ${lastError instanceof Error ? lastError.message : String(lastError)}`
    }
    if (lastInvalidResult !== null) {
        errorMessage += ` 最后一次无效结果: ${JSON.stringify(lastInvalidResult, null, 2)}`
    }

    throw new Error(errorMessage)
}
