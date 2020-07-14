export const reformatData = (obj: object = {}, objReformat: object = {}): object => {
    return Object.keys(obj).reduce((a, b) => {
        const item = objReformat[b];
        if (item !== undefined) {
            return {
                ...a,
                [b]: item
            };
        }
        return a;
    }, {});
};


export const createId = (): string => new Date().getTime().toString();
