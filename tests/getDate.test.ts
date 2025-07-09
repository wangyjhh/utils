import { log } from 'node:console'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
// debounce.test.ts
import { getFormatDate, getMonthDate } from '../src'

describe('debounce', () => {
    it('should return the Format Date', () => {
        expect(getFormatDate()).toMatchInlineSnapshot(`"2025-07-09 16:29:07"`)
    })

    it('should return the Month Date', () => {
        expect(getMonthDate()).toMatchInlineSnapshot(`31`)
    })
})
