export const throttle = <T extends any[]>(cb: (...args: T) => void, interval: number) => {
    let lastExecTime = 0
    let timer: ReturnType<typeof setTimeout> | null = null
    let lastArgs: T | null = null
    let lastContext: any = null

    return function (this: any, ...args: T) {
        const now = Date.now()
        lastArgs = args
        // eslint-disable-next-line ts/no-this-alias
        lastContext = this

        // 立即执行模式（首次或超过间隔时间）
        if (now - lastExecTime >= interval) {
            executeCallback()
        }
        // 延迟执行模式（捕获最后一次调用）
        else if (!timer) {
            timer = setTimeout(executeCallback, interval - (now - lastExecTime))
        }
    }

    function executeCallback() {
        lastExecTime = Date.now()
        if (timer) {
            clearTimeout(timer)
            timer = null
        }
        if (lastArgs) {
            cb.apply(lastContext, lastArgs)
            lastArgs = null
            lastContext = null
        }
    }
}
