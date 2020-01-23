import { BrowserModule } from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';

import { AppComponent } from './app.component';
import {ChartsModule} from "ng2-charts";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { TopDestinationsComponent } from './top-destinations/top-destinations.component';
import {HttpModule} from "@angular/http";
import { BookingPredictionComponent } from './booking-prediction/booking-prediction.component';
import {AppRoutingModule} from "./app-routing/app-routing.module";
import { AboutPageComponent } from './about-page/about-page.component';
import { AgencyCompetitionComponent } from './agency-competition/agency-competition.component';
import {FormsModule} from "@angular/forms";
import { DestinationPredictionComponent } from './destination-prediction/destination-prediction.component';

@NgModule({
  declarations: [
    AppComponent,
    TopDestinationsComponent,
    BookingPredictionComponent,
    AboutPageComponent,
    AgencyCompetitionComponent,
    DestinationPredictionComponent,
  ],
  imports: [
    BrowserModule,
    ChartsModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    NgbModule.forRoot()
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
