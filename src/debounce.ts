export const debounce = <T extends any[]>(
    cb: (...args: T) => void,
    delay: number,
    options: { leading?: boolean } = {},
) => {
    let timer: ReturnType<typeof setTimeout> | null = null
    let lastArgs: T | null = null
    let lastContext: any = null
    let isLeadingCalled = false

    return function (this: any, ...args: T) {
        lastArgs = args
        // eslint-disable-next-line ts/no-this-alias
        lastContext = this

        // 清除现有计时器
        if (timer) {
            clearTimeout(timer)
            timer = null
        }

        // 前缘执行（首次立即执行）
        if (options.leading && !timer && !isLeadingCalled) {
            executeCallback()
            isLeadingCalled = true
            timer = setTimeout(resertLeading, delay)
            return
        }

        // 标准防抖逻辑
        timer = setTimeout(executeCallback, delay)
    }

    function executeCallback() {
        if (lastArgs) {
            cb.apply(lastContext, lastArgs)
            lastArgs = null
            lastContext = null
        }
        isLeadingCalled = false
    }

    function resertLeading() {
        timer = null
        isLeadingCalled = false
    }
}
