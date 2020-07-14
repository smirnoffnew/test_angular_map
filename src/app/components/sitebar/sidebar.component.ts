import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {StoreHistoryService} from "../../_service/store.history.service";
import {BehaviorSubject} from "rxjs";
import {HistoryModel, TypeHistoryAction} from "../../models/history.models";
import {StoreService} from "../../_service/store.service";
import {MakerModel} from "../../models/makers.models";
import {Helper} from "../../helpers/helper";
import {FormControl} from "@angular/forms";
import {arrayTypes} from "../../const/consts";
import {ActionControllerService} from "../../_service/action.controller.service";

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent extends Helper<any> {
    historyList$: BehaviorSubject<HistoryModel[]> = this.storeHistoryService.getItems();

    get makersList(): MakerModel[] {
        return this.storeService.makersList;
    }

    typesAsColor: object = {
        [TypeHistoryAction.success]: 'primary',
        [TypeHistoryAction.error]: 'warn',
        [TypeHistoryAction.info]: 'accent'
    };

    arrayTypes: string[] = arrayTypes;
    searchSrt: FormControl = new FormControl('');
    searchByCategory: FormControl = new FormControl([]);

    get listsHistory(): HistoryModel[] {
        return this.historyList$.getValue().reverse();
    }

    constructor(
        private router: Router,
        private storeService: StoreService,
        private storeHistoryService: StoreHistoryService,
        private actionControllerService: ActionControllerService,

    ) {
        super()
    }

    async createMaker() {
        this.actionControllerService.successAction(`Router create maker`);
        await this.router.navigateByUrl('/create-maker');
    }

    async home() {
        this.actionControllerService.successAction(`Router Home`);
        await this.router.navigateByUrl('/');
    }

    setSelectMaker(value: MakerModel): void {
        this.actionControllerService.successAction(`Select Maker`);
        this.storeService.selectMaker = value;
    }

    isColor({type}: HistoryModel): string {
        return this.typesAsColor[type] || '';
    }

    changeValue(data: unknown, type: string): void {
        if (!!type)
            this.storeService.objectSearch = {
                ...this.storeService.objectSearch,
                [type]: data
            };
        this.actionControllerService.successAction(`Filtering`);
    }
}
