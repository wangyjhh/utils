import { log } from 'node:console'

export async function retry<T>(
    asyncFn: () => Promise<T>,
    maxRetries: number = 10,
): Promise<T> {
    let lastError: unknown = null

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            // 尝试执行异步函数
            return await asyncFn()
        }
        catch (error) {
            lastError = error
            log(`第 ${attempt} 次尝试失败, 准备再次尝试`)

            if (attempt < maxRetries) {
                const delay = 2000 // 延迟2秒后再次尝试
                await new Promise(resolve => setTimeout(resolve, delay))
            }
        }
    }

    // 所有尝试都失败后抛出错误
    throw new Error(`失败${maxRetries}次. 最后一次错误: ${lastError instanceof Error ? lastError.message : String(lastError)}`)
}
