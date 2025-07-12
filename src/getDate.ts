/**
 * @function 返回当前或当前偏移量的格式化日期时间
 * @param {string} format 格式
 * @param {number} offsetSec 偏移秒数
 * @returns {string} 格式化日期时间
 */
export const getFormatDate = (
    format: string = 'YYYY-MM-DD hh:mm:ss',
    offsetSec: number = 0,
) => {
    // 计算目标时间戳
    const timestamp = Date.now() + offsetSec * 1000
    const date = new Date(timestamp)

    // 提取日期各部分并补零
    const parts = {
        YYYY: String(date.getFullYear()),
        MM: String(date.getMonth() + 1).padStart(2, '0'),
        DD: String(date.getDate()).padStart(2, '0'),
        hh: String(date.getHours()).padStart(2, '0'),
        mm: String(date.getMinutes()).padStart(2, '0'),
        ss: String(date.getSeconds()).padStart(2, '0'),
    }

    // 使用正则表达式全局替换占位符
    return format.replace(
        /YYYY|MM|DD|hh|mm|ss/g,
        match => parts[match as keyof typeof parts],
    )
}

/**
 * @function 返回指定年份的月份天数，若无月份、年份参数，则返回当年当月天数
 * @param {number} month 月份
 * @param {number} year  年份
 * @returns {number}  天数
 */
export const getMonthDate = (month?: number, year?: number) => {
    // 如果没有提供年份，使用当前年份
    year = year || new Date().getFullYear()
    // 如果没有提供月份，使用当前月份
    month = month || new Date().getMonth() + 1

    // 定义每个月的天数，注意二月需要根据是否为闰年来确定
    const daysInMonth = [31, (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

    // 返回指定月份的天数
    return daysInMonth[month - 1]
}

export const getTimestamp = () => {
    return `${Number.parseInt(`${new Date().getTime() / 1000}`)}`
}
