import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {MakerImageModel, MakerModel, MakerPositionModel} from "../../models/makers.models";
import {Router} from "@angular/router";
import {StoreHistoryService} from "../../_service/store.history.service";
import {StoreService} from "../../_service/store.service";
import {TypeHistoryAction} from "../../models/history.models";
import {arrayTypes} from "../../const/consts";
import {DEBOUNCE} from "../../helpers/debounce";
import {ActionControllerService} from "../../_service/action.controller.service";

declare let google: any;
const DEBOUNCE_TIME_FOR_AUTOCOMPLETE = 3000;
const DEFAULT_GOOLE_SEARCH_RADIUS = 10000;
@Component({
    selector: 'app-create-marker',
    templateUrl: './create.marker.component.html',
    styleUrls: ['./create.marker.component.scss']
})
export class CreateMarkerComponent implements AfterViewInit {
    arrayTypes: string[] = arrayTypes;


    MakerFormGroup = this.formBuilder.group({
        name: ['', Validators.required],
        description: ['', Validators.required],
        category: ['', Validators.required],
        phone: [''],
    });

    locationAutocomplete: any;

    placeDataSpecific: MakerPositionModel;

    placeDataMain: MakerPositionModel;

    specificPosition: any[] = [];

    loadedPhoto: MakerImageModel[] = [];

    @ViewChild('location', {static: true}) location: ElementRef;
    @ViewChild('form', {static: true}) form: ElementRef;

    constructor(
        private storeHistoryService: StoreHistoryService,
        private actionControllerService: ActionControllerService,
        private storeService: StoreService,
        private formBuilder: FormBuilder,
        private router: Router
    ) {

    }

    async ngAfterViewInit() {
        await DEBOUNCE(DEBOUNCE_TIME_FOR_AUTOCOMPLETE);
        this.getPlaceAutocomplete();
    }

    getPlaceAutocomplete() {
        this.locationAutocomplete = new google.maps.places.Autocomplete(
            this.location.nativeElement,
            {types: ['(regions)']},
        );
        this.locationAutocomplete.addListener('place_changed', () => {

            const data = this.locationAutocomplete.getPlace();

            this.placeDataMain = this.setMakerPositionModel(data);

            this.actionControllerService.successAction(`Select address: ${data.formatted_address}`);

        });
    }


    selectChangedValue(elements: string[]) {
        const pyrmont = new google.maps.LatLng(this.placeDataMain.lat,this.placeDataMain.lng);
        const request:any = {
            location: pyrmont,
            radius: DEFAULT_GOOLE_SEARCH_RADIUS,
            type: elements
        };
        const test = new google.maps.places.PlacesService(document.createElement('div'));
        test.nearbySearch(request, (results, status) => {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                this.specificPosition = results;
            }
        });
    }

    setSpecific(data){
        this.placeDataSpecific = this.setMakerPositionModel(data)
    }

    setMakerPositionModel(data): MakerPositionModel{
        return new MakerPositionModel({
            lat: data.geometry.location.lat(),
            lng: data.geometry.location.lng(),
            formatted_address: data.formatted_address || data.name
        });
    }

    async back() {
        this.actionControllerService.successAction(`Route back`);
        await this.router.navigateByUrl('/');
    }

    create(): void {
        if (!this.placeDataMain) {
            this.actionControllerService.errorAction(`Location invalid`);
            return;
        }

        if (this.MakerFormGroup.invalid) {
            this.actionControllerService.errorAction(`Form invalid`);
            return;
        }
        const data = {
            ...this.MakerFormGroup.value,
            position: Object.assign({}, this.placeDataMain),
            positionSpecific: Object.assign({}, this.placeDataSpecific),
            images: [...(this.loadedPhoto || [])],
            category: [...(this.MakerFormGroup.value.category || [])]
        };


        this.storeService.createItem(data)
            .subscribe((item: MakerModel) => {
                this.storeService.selectMaker = item;
                this.actionControllerService.successAction(`Create marker: ${item.id}`);
                this.back()
            });
    }
}
