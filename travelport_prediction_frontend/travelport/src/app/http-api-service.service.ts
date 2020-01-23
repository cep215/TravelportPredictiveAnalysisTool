import { Injectable } from '@angular/core';
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {AppSettings} from "../AppSettings";
import "rxjs/add/operator/map";


@Injectable()
export class HttpApiService {

  constructor(private http: Http) { }


  public getTopDestinationsInMonth(monthNo: number): Observable<JSON> {
    return this.http.get(AppSettings.API_ENDPOINT + '/popular/' + monthNo).map(res => res.json());
  }

  public getProphetBookingPredictions(agency: string, weeks_to_predict: number): Observable<JSON> {
    return this.http.get(AppSettings.API_ENDPOINT + '/prediction/prophet/' + agency + '/' + weeks_to_predict).map(res => res.json());
  }

  public getProphetModel(agency: string): Observable<JSON> {
    return this.http.get(AppSettings.API_ENDPOINT + '/prediction/prophet/model/' + agency).map(res => res.json());
  }

  public getArimaModel(agency: string): Observable<JSON> {
    return this.http.get(AppSettings.API_ENDPOINT + '/prediction/arima/model/' + agency).map(res => res.json());
  }

  public getArimaBookingPredictions(agency: string, weeks_to_predict: number): Observable<JSON> {
    return this.http.get(AppSettings.API_ENDPOINT + '/prediction/arima/' + agency + '/' + weeks_to_predict).map(res => res.json());
  }

  public getBookingData(agency: string): Observable<JSON> {
    return this.http.get(AppSettings.API_ENDPOINT + '/prediction/real/' + agency).map(res => res.json());
  }

  public getProphetDestinationPredictions(airport: string, weeks_to_predict: number): Observable<JSON> {
    return this.http.get(AppSettings.API_ENDPOINT + '/prediction/prophet/destination/' + airport + '/' + weeks_to_predict).map(res => res.json());
  }

  public getDestProphetModel(airport: string): Observable<JSON> {
    return this.http.get(AppSettings.API_ENDPOINT + '/prediction/prophet/model/destination/' + airport).map(res => res.json());
  }

  public getArimaDestinationPredictions(airport: string, weeks_to_predict: number): Observable<JSON> {
    return this.http.get(AppSettings.API_ENDPOINT + '/prediction/arima/destination/' + airport + '/' + weeks_to_predict).map(res => res.json());
  }

  public getDestArimaModel(airport: string): Observable<JSON> {
    return this.http.get(AppSettings.API_ENDPOINT + '/prediction/arima/model/destination/' + airport).map(res => res.json());
  }

  public getDestData(airport: string): Observable<JSON> {
    return this.http.get(AppSettings.API_ENDPOINT + '/prediction/real/destination/' + airport).map(res => res.json());
  }

  public getCompetitorInfo(agency: string): Observable<JSON> {
    // agency = "b51f893e9f392af33cf7906943863a33";
    return this.http.get(AppSettings.API_ENDPOINT + '/competitors/' + agency).map(res => res.json());
  }

}
