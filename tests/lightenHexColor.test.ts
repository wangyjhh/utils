import { log } from 'node:console'
import { expect, it } from 'vitest'
import { lightenHexColor } from '../src'

it('darkenHexColor', async () => {
    expect(lightenHexColor('#D9D1BD', 0.1)).toMatchInlineSnapshot(`"#e8e3d7"`)
})
