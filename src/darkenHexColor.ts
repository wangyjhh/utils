/**
 * 加深十六进制颜色
 * @param hex - 原始十六进制颜色值 (格式: '#RRGGBB')
 * @param amount - 加深程度 (0-1, 0.2 表示降低20%亮度)
 * @returns 加深后的十六进制颜色值
 */
export function darkenHexColor(hex: string, amount: number): string {
    // 移除 # 号并解析RGB值
    const r = Number.parseInt(hex.substring(1, 3), 16)
    const g = Number.parseInt(hex.substring(3, 5), 16)
    const b = Number.parseInt(hex.substring(5, 7), 16)

    // 将RGB转换为HSL
    const hsl = rgbToHsl(r, g, b)

    // 降低亮度
    hsl[2] = Math.max(0, hsl[2] * (1 - amount))

    // 将HSL转回RGB
    const rgb = hslToRgb(hsl[0], hsl[1], hsl[2])

    // 将RGB转回十六进制
    return `#${componentToHex(rgb[0])}${componentToHex(rgb[1])}${componentToHex(rgb[2])}`
}

// 辅助函数：RGB转HSL
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
    r /= 255
    g /= 255
    b /= 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s
    const l = (max + min) / 2

    if (max !== min) {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0)
                break
            case g: h = (b - r) / d + 2
                break
            case b: h = (r - g) / d + 4
                break
        }
        h /= 6
    }
    else {
        s = 0 // 灰度
    }
    return [h, s, l]
}

// 辅助函数：HSL转RGB
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
    let r, g, b

    if (s === 0) {
        r = g = b = l // 灰度
    }
    else {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0)
                t += 1
            if (t > 1)
                t -= 1
            if (t < 1 / 6)
                return p + (q - p) * 6 * t
            if (t < 1 / 2)
                return q
            if (t < 2 / 3)
                return p + (q - p) * (2 / 3 - t) * 6
            return p
        }

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s
        const p = 2 * l - q
        r = hue2rgb(p, q, h + 1 / 3)
        g = hue2rgb(p, q, h)
        b = hue2rgb(p, q, h - 1 / 3)
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
}

// 辅助函数：RGB分量转十六进制
function componentToHex(c: number): string {
    const hex = c.toString(16)
    return hex.length === 1 ? `0${hex}` : hex
}
