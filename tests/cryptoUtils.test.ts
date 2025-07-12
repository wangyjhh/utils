import { log } from 'node:console'
import { describe, expect, it } from 'vitest'
import { aesDecrypt, aesEncrypt, generateApiSignature, hmacSha256, md5, sha256, verifyApiSignature } from '../src'

describe('cryptoUtils', () => {
    it('crypto test', () => {
        expect(hmacSha256('123456', '123456')).toMatchInlineSnapshot(`"B8AD08A3A547E35829B821B75370301DD8C4B06BDD7771F9B541A75914068718"`)
    })

    it('md5', () => {
        expect(md5('123456')).toBe('E10ADC3949BA59ABBE56E057F20F883E')
    })

    it('sha256', () => {
        expect(sha256('123456')).toBe('8D969EEF6ECAD3C29A3A629280E686CF0C3F5D5A86AFF3CA12020C923ADC6C92')
    })

    it('hmacSha256', () => {
        expect(hmacSha256('123456', '123456')).toBe('B8AD08A3A547E35829B821B75370301DD8C4B06BDD7771F9B541A75914068718')
    })

    it('signature', () => {
        const params = {
            username: 'admin',
            password: 'Admin1234',
        }
        const secret = '123456'
        const timestamp = Date.now()
        const signature = generateApiSignature(params, secret, timestamp, 'random')

        const request1 = {
            ...params,
            timestamp,
            nonce: 'random',
            signature,
        }

        const request2 = {
            ...params,
            timestamp: timestamp - 300000,
            nonce: 'random',
            signature,
        }

        expect(verifyApiSignature(request1, secret)).toBe(true)
        expect(verifyApiSignature(request2, secret)).toBe(false)
    })

    it('aes', () => {
        const key = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' // 32字节
        const iv = 'bbbbbbbbbbbbbbbb' // 16字节

        // 加密
        const encrypted = aesEncrypt('敏感数据', key, iv)
        log('Encrypted:', encrypted)

        // 解密
        const decrypted = aesDecrypt(encrypted, key, iv)
        expect(decrypted).toBe('敏感数据')
    })
})
