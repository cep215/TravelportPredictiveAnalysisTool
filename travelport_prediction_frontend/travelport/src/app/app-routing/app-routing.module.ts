import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {TopDestinationsComponent} from "../top-destinations/top-destinations.component";
import {AboutPageComponent} from "../about-page/about-page.component";
import {BookingPredictionComponent} from "../booking-prediction/booking-prediction.component";
import {AgencyCompetitionComponent} from "../agency-competition/agency-competition.component";
import {DestinationPredictionComponent} from "../destination-prediction/destination-prediction.component";

const routes: Routes = [
  {path: '', redirectTo: '/about', pathMatch: 'full'},
  {path: 'about', component: AboutPageComponent, pathMatch: 'full'},
  {path: 'top-destinations', component: TopDestinationsComponent, pathMatch: 'full'},
  {path: 'prediction', component: BookingPredictionComponent, pathMatch: 'full'},
  {path: 'competition', component: AgencyCompetitionComponent, pathMatch: 'full'},
  {path: 'destinations', component: DestinationPredictionComponent, pathMatch: 'full'},
  {path: '**', redirectTo: '/about', pathMatch: 'full'},
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})




export class AppRoutingModule { }
