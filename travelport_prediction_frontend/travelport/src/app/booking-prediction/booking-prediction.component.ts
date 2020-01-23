import { Component } from "@angular/core";
import { Chart } from "../encapsulation-objects/chart/chart";
import { HttpApiService } from "../http-api-service.service";
import { ChartType } from "../encapsulation-objects/chart/chart-type";
import { ChartData } from "../encapsulation-objects/chart/chart-data";
import { ChartBuilder } from "../encapsulation-objects/chart/chart-builder";
import {AgencyAlias} from "../utility/agency_alias";

@Component({
  selector: "app-booking-prediction",
  templateUrl: "./booking-prediction.component.html",
  styleUrls: ["./booking-prediction.component.css"],
  providers: [HttpApiService]
})
export class BookingPredictionComponent {
  public arimaPredictionList: Chart[] = [];
  public prophetPredictionList: Chart[] = [];
  public realDataset: ChartData;
  public realLabels: string[] = [];
  public selectedAgency = "";
  public prophetLoading: boolean = false;
  public arimaLoading: boolean = false;

  private selectedAgencyToken: string;

  constructor(private apiService: HttpApiService) {}

  displayChart(): void {

    if (!AgencyAlias.isValidAlias(this.selectedAgency)) {
      this.selectedAgency = 'Invalid alias';
      return;
    }

    this.selectedAgencyToken = AgencyAlias.getCode(this.selectedAgency);

    this.prophetLoading = true;
    this.arimaLoading = true;
    this.arimaPredictionList = [];
    this.prophetPredictionList = [];
    this.realLabels = [];
    this.getRealData();
    this.getProphetPredictionModel();
    this.getProphetPredictionGraphs();
    this.getArimaPredictionModel();
    this.getArimaPredictionGraphs();
  }

  public getProphetPredictionModel(): void {
    let predictionJson: string;
    this.apiService.getProphetModel(this.selectedAgencyToken).subscribe(
      jsonData => (predictionJson = JSON.stringify(jsonData)),
      error => console.log(error),
      () => {
        let chart: Chart = this.generateChart(predictionJson);

        this.prophetPredictionList.push(chart);
      }
    );
  }

  public getProphetPredictionGraphs(): void {
    let predictionJson: string;
    this.apiService
      .getProphetBookingPredictions(this.selectedAgencyToken, 20)
      .subscribe(
        jsonData => (predictionJson = JSON.stringify(jsonData)),

        error => console.log(error),
        () => {
          let chart: Chart = this.generateChart(predictionJson);

          this.prophetPredictionList.push(chart);
          this.prophetLoading = false;
        }
      );
  }

  public getArimaPredictionModel(): void {
    let predictionJson: string;
    this.apiService.getArimaModel(this.selectedAgencyToken).subscribe(
      jsonData => (predictionJson = JSON.stringify(jsonData)),
      error => console.log(error),
      () => {
        let chart: Chart = this.generateChart(predictionJson);

        this.arimaPredictionList.push(chart);
      }
    );
  }

  public getArimaPredictionGraphs(): void {
    let predictionJson: string;
    /** Hardcoded for march for testing */
    this.apiService
      .getArimaBookingPredictions(this.selectedAgencyToken, 20)
      .subscribe(
        jsonData => (predictionJson = JSON.stringify(jsonData)),
        error => console.log(error),
        () => {
          let chart: Chart = this.generateChart(predictionJson);

          this.arimaPredictionList.push(chart);
          this.arimaLoading = false;
        }
      );
  }

  public getRealData(): void {
    let bookingsJson: string;
    this.apiService.getBookingData(this.selectedAgencyToken).subscribe(
      jsonData => (bookingsJson = JSON.stringify(jsonData)),
      error => console.log(error),
      () => {
        let parsedBoookings = JSON.parse(bookingsJson);
        let realData: number[] = [];
        parsedBoookings.map(data => {
          realData.push(data.bookings);
          this.realLabels.push(data.week);
        });
        this.realDataset = new ChartData(realData, "No. Bookings");
      }
    );
  }

  public generateChart(Response): Chart {
    let parsedTopDes = JSON.parse(Response);
    let chartData: number[] = [];
    let labels: string[] = [];

    parsedTopDes.map(data => {
      chartData.push(data.bookings);
      labels.push(data.week);
    });

    if (labels.length < this.realLabels.length) {
      chartData = new Array(this.realLabels.length - labels.length).concat(
        chartData
      );
    }
    // TODO FIX THIS, WE RELY ON REQUEST TO GET this.realDataset being quicker than the other one, we should really wait
    let dataset: ChartData = new ChartData(chartData, "Predicted Bookings");
    let chart: Chart = ChartBuilder.aLineChart()

      .withDataSet([dataset, this.realDataset])
      .withLabels(
        labels.length > this.realLabels.length ? labels : this.realLabels
      )
      .withOptions({
        scaleShowVerticalLines: false,
        responsive: true,
        scales: {
          xAxes: [{scaleLabel: {display: true, labelString: 'Date'}}],
          yAxes: [{ticks: {suggestedMin: 0}, scaleLabel: {display: true, labelString: 'No. Bookings'}}]
        }
      })
      .withColors([
        { backgroundColor: "rgba(0, 0, 0, 0)", borderColor: "#0779BF" }
      ])
      .build();

    return chart;
  }
}
