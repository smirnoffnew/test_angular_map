import {
    BaseModel
} from './base.model';

export enum TypeHistoryAction {
    success = 'success',
    error = 'error',
    info = 'info'
}

export class HistoryModel extends BaseModel<HistoryModel> {
    constructor(init?: Partial<HistoryModel>) {
        super(init);
    }

    action: string;
    type: TypeHistoryAction
}
