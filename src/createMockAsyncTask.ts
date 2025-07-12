export const createMockAsyncTask = (successReturn: any = '调用成功!', errorReturn: any = '调用失败') => {
    let attemptCount = 0

    return async (successOnAttempt: number = 3) => {
        const currentAttempt = ++attemptCount

        if (currentAttempt < successOnAttempt) {
            throw new Error(errorReturn)
        }
        return successReturn
    }
}
