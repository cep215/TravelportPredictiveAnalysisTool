import { Component, OnInit } from "@angular/core";
import { ChartData } from "../encapsulation-objects/chart/chart-data";
import { Chart } from "../encapsulation-objects/chart/chart";
import { HttpApiService } from "../http-api-service.service";
import { ChartBuilder } from "../encapsulation-objects/chart/chart-builder";

@Component({
  selector: "app-destination-prediction",
  templateUrl: "./destination-prediction.component.html",
  styleUrls: ["./destination-prediction.component.css"],
  providers: [HttpApiService]
})
export class DestinationPredictionComponent {
  public arimaPredictionList: Chart[] = [];
  public prophetPredictionList: Chart[] = [];
  public realDataset: ChartData;
  public realLabels: string[] = [];
  public selectedDest = "";
  public prophetLoading: boolean = false;
  public arimaLoading: boolean = false;

  constructor(private apiService: HttpApiService) {}

  displayChart() {
    // loading = true
    this.prophetLoading = this.arimaLoading = true;

    // clear charts
    this.arimaPredictionList = [];
    this.prophetPredictionList = [];
    this.realLabels = [];

    this.fetchData();
  }

  public fetchData(): void {
    let bookingsJson: string;
    this.apiService.getDestData(this.selectedDest).subscribe(
      jsonData => (bookingsJson = JSON.stringify(jsonData)),
      error => {
        // if invalid stop loading data and display an error message
        this.selectedDest = 'Invalid IATA code';
        this.prophetLoading = this.arimaLoading = false;
      },
      () => {
        let parsedBoookings = JSON.parse(bookingsJson);
        let realData: number[] = [];
        parsedBoookings.map(data => {
          realData.push(data.bookings);
          this.realLabels.push(data.week);
        });
        this.realDataset = new ChartData(realData, "No. Bookings");

        // fetch the prediction models
        this.getProphetPredictionModel();
        this.getProphetPredictionGraphs();
        this.getArimaPredictionModel();
        this.getArimaPredictionGraphs();
      }
    );
  }

  public getProphetPredictionModel(): void {
    let predictionJson: string;
    this.apiService.getDestProphetModel(this.selectedDest).subscribe(
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
      .getProphetDestinationPredictions(this.selectedDest, 20)
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
    this.apiService.getDestArimaModel(this.selectedDest).subscribe(
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
      .getArimaDestinationPredictions(this.selectedDest, 20)
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
    let dataset: ChartData = new ChartData(chartData, "Predicted Bookings");
    return ChartBuilder.aLineChart()

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
  }
}
