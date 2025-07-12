import { Buffer } from 'node:buffer'
import crypto, { createHmac } from 'node:crypto'

/**
 * 加密工具集
 */
export const CryptoUtils = {

}

/**
 * 生成 MD5 签名
 * @param data - 待加密数据
 * @param uppercase - 是否大写（默认大写）
 */
export function md5(data: string, uppercase: boolean = true): string {
    const hash = crypto.createHash('md5').update(data).digest('hex')
    return uppercase ? hash.toUpperCase() : hash
}

/**
 * 生成 SHA256 签名
 * @param data - 待加密数据
 * @param uppercase - 是否大写
 */
export function sha256(data: string, uppercase: boolean = true): string {
    const hash = crypto.createHash('sha256').update(data).digest('hex')
    return uppercase ? hash.toUpperCase() : hash
}

/**
 * 生成 HMAC-SHA256 签名
 * @param secret - 密钥
 * @param data - 待加密数据
 * @param uppercase - 是否大写
 */
export function hmacSha256(secret: string, data: string, uppercase: boolean = true): string {
    const hmac = createHmac('sha256', secret)
    hmac.update(data)
    return uppercase ? hmac.digest('hex').toUpperCase() : hmac.digest('hex')
}

export const getSign = (timestamp: string, secret: string) => {
    const stringify = `${timestamp}\n${secret}`
    const sign = crypto.createHmac('SHA256', stringify)
    return sign.digest('base64')
}

/**
 * 生成带时间戳的签名（常见于API验证）
 * @param params - 请求参数对象
 * @param secret - 密钥
 * @param timestamp - 时间戳（可选）
 * @param nonce - 随机字符串（可选）
 */
export function generateApiSignature(
    params: Record<string, any>,
    secret: string,
    timestamp: number = Date.now(),
    nonce: string = Math.random().toString(36).substring(2, 15),
): string {
    // 1. 添加时间戳和随机数
    const signParams = { ...params, timestamp, nonce } as any

    // 2. 参数排序
    const sortedKeys = Object.keys(signParams).sort()
    const sortedParams: Record<string, any> = {}
    sortedKeys.forEach((key) => {
        sortedParams[key] = signParams[key]
    })

    // 3. 拼接参数
    const queryString = Object.entries(sortedParams)
        .map(([key, value]) => `${key}=${value}`)
        .join('&')

    // 4. 生成签名
    return hmacSha256(secret, queryString)
}

/**
 * 验证API签名
 * @param params - 请求参数（需包含signature字段）
 * @param secret - 密钥
 * @param timeout - 签名有效期（毫秒），默认5分钟
 */
export function verifyApiSignature(
    params: Record<string, any>,
    secret: string,
    timeout: number = 300000,
): boolean {
    // 复制参数对象，避免修改原始数据
    const verifyParams = { ...params }
    const signature = verifyParams.signature
    delete verifyParams.signature

    // 1. 检查时间戳有效性
    if (!verifyParams.timestamp
        || Math.abs(Date.now() - Number.parseInt(verifyParams.timestamp)) > timeout) {
        return false
    }

    // 2. 重新生成签名
    const generatedSignature = generateApiSignature(
        verifyParams,
        secret,
        Number.parseInt(verifyParams.timestamp),
        verifyParams.nonce,
    )

    // 3. 对比签名
    return generatedSignature === signature
}

/**
 * AES加密
 * @param data - 待加密数据
 * @param key - 密钥（32字节）
 * @param iv - 初始化向量（16字节）
 */
export function aesEncrypt(data: string, key: string, iv: string): string {
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), Buffer.from(iv))
    let encrypted = cipher.update(data, 'utf8', 'base64')
    encrypted += cipher.final('base64')
    return encrypted
}

/**
 * AES解密
 * @param encrypted - 加密数据
 * @param key - 密钥（32字节）
 * @param iv - 初始化向量（16字节）
 */
export function aesDecrypt(encrypted: string, key: string, iv: string): string {
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), Buffer.from(iv))
    let decrypted = decipher.update(encrypted, 'base64', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
}
