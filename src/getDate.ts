/**
 * @function 返回当前或当前偏移量的格式化日期时间
 * @param {number} offsetSec 偏移秒数
 * @returns {string} 格式化日期时间
 */
export const getFormatDate = (offsetSec: number = 0) => {
    // 获取当前时间戳
    let timestamp = Date.now()
    // 加上或减去偏移量
    timestamp += offsetSec * 1000 // 注意：offsetSec 是秒，所以乘以 1000 转换为毫秒

    // 创建新的 Date 对象
    const newDate = new Date(timestamp)

    // 格式化日期
    const YYYY = newDate.getFullYear()
    const MM = (newDate.getMonth() + 1).toString().padStart(2, '0')
    const DD = newDate.getDate().toString().padStart(2, '0')
    const h = newDate.getHours().toString().padStart(2, '0')
    const m = newDate.getMinutes().toString().padStart(2, '0')
    const s = newDate.getSeconds().toString().padStart(2, '0')

    // 返回格式化的日期时间字符串
    return `${YYYY}-${MM}-${DD} ${h}:${m}:${s}`
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
