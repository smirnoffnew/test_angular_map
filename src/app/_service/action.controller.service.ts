import {Injectable} from "@angular/core";
import {MakerModel} from "../models/makers.models";
import {ServiceProvider} from "./service.provider";
import {NameService} from "../const/consts";
import {TypeHistoryAction} from "../models/history.models";
import {StoreHistoryService} from "./store.history.service";

@Injectable()
export class ActionControllerService {
    constructor(
        private storeHistoryService: StoreHistoryService,
    ){ }

    successAction(str: string): void {
        this.actionCreate(str, TypeHistoryAction.success);
    }

    errorAction(str: string): void {
        this.actionCreate(str, TypeHistoryAction.error);
    }

    private actionCreate (str: string, type: TypeHistoryAction): void {
        this.storeHistoryService.createItem({
            action: str,
            type: type
        });
    }
}
