import { log } from 'node:console'
import { expect, it } from 'vitest'
import { darkenHexColor } from '../src'

it('darkenHexColor', async () => {
    expect(darkenHexColor('#F2B58A', 0.3)).toMatchInlineSnapshot(`"#e77423"`)
})
