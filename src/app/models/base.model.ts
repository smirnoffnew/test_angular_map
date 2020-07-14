import { createId } from "../../utils";

export abstract class BaseModel<T> {
    public constructor(init?: Partial<T> ) {
        Object.assign(this, init);
    }

    id?: string = createId();
    createAt?: Date = new Date();
}
