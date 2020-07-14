import {Injectable} from "@angular/core";
import {MakerModel} from "../models/makers.models";
import {ServiceProvider} from "./service.provider";
import {NameService} from "../const/consts";

@Injectable()
export class StoreService extends ServiceProvider<MakerModel> {
    model(data: MakerModel): MakerModel {
        return new MakerModel(data);
    }

    _objectSearch: any = {};

    set objectSearch(value){
        this._objectSearch = value;
        this.makersList = this.getMakersList();
    }

    get objectSearch():any  {
        return this._objectSearch || {}
    }

    _makersList: MakerModel[];

    set makersList(value: MakerModel[]){
        this._makersList = [...value];
    }
    get makersList(): MakerModel[] {
        return this._makersList || []
    }

    localStr () {
        return NameService.StoreService;
    }

    getMakersList (): MakerModel[] {
        return this.PIPE(
            this.getValues(),
            (item: MakerModel[]): MakerModel[] => {
                if(!this.objectSearch.searchSrt) {
                    return item;
                }
                return this.search(item, this.objectSearch.searchSrt)
            },
            (item: MakerModel[]): MakerModel[] => {
                if(!this.objectSearch.searchByCategory || !this.objectSearch.searchByCategory.length) {
                    return item;
                }
                return this.searchByCategoryArray(item, this.objectSearch.searchByCategory)
            }
        )
    }

    handleWorkWithData(){
        this.makersList = [
            ...this.getMakersList()
        ]
    };
}
