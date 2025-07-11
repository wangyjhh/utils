import { log } from 'node:console'
import { describe, expect, it } from 'vitest'
// debounce.test.ts
import { getFormatDate, getMonthDate } from '../src'

describe('debounce', () => {
    it('should return the Format Date', () => {
        expect(getFormatDate()).toMatchInlineSnapshot(`"2025-07-11 10:04:07"`)
        expect(getFormatDate('YYYY-MM-DD')).toMatchInlineSnapshot(`"2025-07-11"`)
        expect(getFormatDate('hh:mm:ss')).toMatchInlineSnapshot(`"10:04:07"`)
    })

    it('should return the Month Date', () => {
        expect(getMonthDate()).toMatchInlineSnapshot(`31`)
        expect(getMonthDate(2)).toMatchInlineSnapshot(`28`)
        expect(getMonthDate(2, 2028)).toMatchInlineSnapshot(`29`)
    })
})
