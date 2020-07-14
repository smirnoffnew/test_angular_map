import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {GoogleMap, MapInfoWindow} from "@angular/google-maps";

import {StoreService} from "../../_service/store.service";
import {takeUntil} from "rxjs/operators";
import {interval, Subject} from "rxjs";
import {MakerModel} from "../../models/makers.models";
import {Helper} from "../../helpers/helper";
import {StoreHistoryService} from "../../_service/store.history.service";
import {CUSTOM_MAP_NAME, CUSTOM_MAP_STYLE, DEFAULT_KYEV_LOCATION} from "../../const/consts";
import {ActionControllerService} from "../../_service/action.controller.service";


declare let google: any;

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent extends Helper<any> implements AfterViewInit {
    @ViewChild(MapInfoWindow, {static: false}) infoWindow: MapInfoWindow;
    @ViewChild(GoogleMap, {static: false}) map: GoogleMap;

    _center: {} = DEFAULT_KYEV_LOCATION;

    get center(){
        return (this.storeService.selectMaker && this.storeService.selectMaker.position) || this._center;
    }

    set center(value){
        this._center = value;
    }

    customMapType = new google.maps.StyledMapType(CUSTOM_MAP_STYLE, CUSTOM_MAP_NAME);
    customMapTypeId = CUSTOM_MAP_NAME.name;
    options: any = {
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDoubleClickZoom: true,
        zoom: 12,
        mapTypeControlOptions: {
            mapTypeIds: [
                google.maps.MapTypeId.ROADMAP,
                this.customMapTypeId
            ]
        }
    };

    get makersList(): MakerModel[] {
        return this.storeService.makersList;
    }

    data:MakerModel;

    destroyed$:Subject<boolean> = new Subject();

    constructor(
        private storeService: StoreService,
        private storeHistoryService: StoreHistoryService,
        private actionControllerService: ActionControllerService,
    ) {
        super()
    }


    ngAfterViewInit() {
        navigator.geolocation.getCurrentPosition(position => {
            if (this.destroyed$.closed) {
                return;
            }
            this.center = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };
        });
        const numbers = interval(500);
        numbers.pipe(takeUntil(this.destroyed$))
            .subscribe(() => {
                try {
                    const googleMap = this.map._googleMap;
                    googleMap.mapTypes.set(this.customMapTypeId, this.customMapType);
                    googleMap.setMapTypeId(this.customMapTypeId);
                    this.destroyed$.next(true);
                    this.destroyed$.complete();
                } catch (e) {
                    console.error('GoogleTestError!!!!!!!!!!!!!!!!!!!!!!!!', e);
                }
            });
    }


    openInfo(marker, data): void {
        this.infoWindow.open(marker);
        this.data = data;
        this.actionControllerService.successAction(`Open info marker: ${data.id}`)
    }

    closeInfo(): void {
        this.infoWindow.close();
        this.actionControllerService.successAction( `Close info marker`)
    }
}
