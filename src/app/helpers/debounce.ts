export const DEBOUNCE = (time: number): Promise<number> => {
    return new Promise((resolve): void => {
        const timeout = setTimeout(
            () => {
                resolve(time);
                clearTimeout(timeout)
            }, time
        )
    })
};