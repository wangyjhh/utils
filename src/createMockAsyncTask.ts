export const createMockAsyncTask = () => {
    let attemptCount = 0

    return async (successOnAttempt: number = 3) => {
        const currentAttempt = ++attemptCount

        if (currentAttempt < successOnAttempt) {
            throw new Error(`调用失败`)
        }
        return '调用成功!'
    }
}
