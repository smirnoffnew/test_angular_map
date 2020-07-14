import {Injectable} from "@angular/core";
import {ServiceProvider} from "./service.provider";
import {HistoryModel} from "../models/history.models";
import {NameService} from "../const/consts";

@Injectable()
export class StoreHistoryService extends ServiceProvider<HistoryModel>{
    model(data: HistoryModel): HistoryModel {
        return new HistoryModel(data);
    }

    localStr () {
        return NameService.StoreHistoryService;
    }

    handleWorkWithData() : void{
        console.log('change data');
    };
}
