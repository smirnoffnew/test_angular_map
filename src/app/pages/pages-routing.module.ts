import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {CreateMarkerComponent} from "./create-marker/create.marker.component";
import {MapComponent} from "./map/map.component";


const routes: Routes = [
    {path: 'create-maker', component: CreateMarkerComponent},
    {path: '', component: MapComponent},
    {path: '**', redirectTo: '/'}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule,]
})
export class PagesRoutingModule {
}
