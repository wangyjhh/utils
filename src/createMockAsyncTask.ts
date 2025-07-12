interface Options {
    mode: 'success' | 'error'
    errorReturn: any
    successReturn: any
}

export const createMockAsyncTask = (options: Options) => {
    let attemptCount = 0

    return async (successOnAttempt: number = 3) => {
        const currentAttempt = ++attemptCount
        if (options.mode === 'error') {
            if (currentAttempt < successOnAttempt) {
                throw new Error(options.errorReturn)
            }
            return options.successReturn
        }
        else if (options.mode === 'success') {
            if (currentAttempt < successOnAttempt) {
                return options.errorReturn
            }
            return options.successReturn
        }
    }
}
