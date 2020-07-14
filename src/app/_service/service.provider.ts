import {BehaviorSubject, Observable, of, Subject} from "rxjs";
import {Helper} from "../helpers/helper";
import {tap} from "rxjs/operators";
import {OnInit} from "@angular/core";

export abstract class ServiceProvider<T> extends Helper<any> implements OnInit{
    private items: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);
    private _selectItem: T | undefined;
    destroyed$:Subject<boolean> = new Subject();

    ngOnInit(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    constructor(){
        super();
        const array = this.strToJson(() => this.getDataFromStore(), []);
        this.items.next(Array.isArray(array) ? array : []);
        this.handleWorkWithData();
    }

    abstract localStr(): string;
    abstract model(type: T): T;

    get selectMaker(): T | undefined {
        return this._selectItem;
    }

    set selectMaker(value: T) {
        this._selectItem = value ? this.model(value) : value;
    }

    getDataFromStore(): T{
        return JSON.parse(localStorage.getItem(this.localStr()));
    }

    getValues(): T[] {
        return this.items.value || [];
    }

    getItems(): BehaviorSubject<T[]> {
        return this.items;
    }

    createItem(data: T): Observable<T> {
        const newItem = this.model(data);
        const array = [
            ...this.getValues(),
            newItem
        ];

        localStorage.setItem(this.localStr(), JSON.stringify(array));
        this.items.next(array);
        return of(newItem)
            .pipe(tap(() => this.handleWorkWithData()));
    }

    abstract handleWorkWithData(): void

    getCount(): number {
        return this.getValues().length;
    }
}
