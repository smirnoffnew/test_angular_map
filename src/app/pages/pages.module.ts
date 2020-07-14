import {NgModule} from '@angular/core';
import {GoogleMapsModule, GoogleMap} from '@angular/google-maps'
import {MaterialModule} from "../material.module";
import {PagesRoutingModule} from "./pages-routing.module";
import {CreateMarkerComponent} from "./create-marker/create.marker.component";
import {MapComponent} from "./map/map.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {UploadImageComponent} from "../components/upload-image/upload.image.component";

@NgModule({
    imports: [
        MaterialModule,
        GoogleMapsModule,
        PagesRoutingModule,
        FormsModule,
        CommonModule,
        ReactiveFormsModule
    ],
    declarations: [
        CreateMarkerComponent,
        MapComponent,
        UploadImageComponent
    ],
    providers: [GoogleMap],
    bootstrap: []
})
export class PagesModule {

}
