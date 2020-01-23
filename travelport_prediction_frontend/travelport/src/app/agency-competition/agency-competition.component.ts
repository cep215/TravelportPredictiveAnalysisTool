import {Component} from '@angular/core';
import {HttpApiService} from "../http-api-service.service";
import {Chart} from "../encapsulation-objects/chart/chart";
import {ChartBuilder} from "../encapsulation-objects/chart/chart-builder";
import {ChartData} from "../encapsulation-objects/chart/chart-data";
import {AgencyAlias} from "../utility/agency_alias";

@Component({
  selector: 'app-agency-competition',
  templateUrl: './agency-competition.component.html',
  styleUrls: ['./agency-competition.component.css'],
  providers: [HttpApiService]
})
export class AgencyCompetitionComponent {

  public competitorChart: Chart;
  public selectedAgency: string = "";

  constructor(private apiService: HttpApiService) {}

  public displayChart(): void {

    if (!AgencyAlias.isValidAlias(this.selectedAgency)) {
      this.selectedAgency = 'Invalid alias';
      return;
    }

    let selectedAgencyToken = AgencyAlias.getCode(this.selectedAgency);

    let jsonCompetitors: string;
    this.apiService.getCompetitorInfo(selectedAgencyToken).subscribe(
      jsonData => jsonCompetitors = JSON.stringify(jsonData),
      error => console.log(error),
      () => {
        // parse json and assign types
        let parsedData = JSON.parse(jsonCompetitors);
        let agencies: any[] = parsedData.agencies;
        let dates: string[] = parsedData.dates;

        let dataSet: ChartData[] = agencies.map(this.parseChartData());

        let stackedDataSet: ChartData[] = this.generateStackedData(dataSet);

        this.competitorChart = ChartBuilder.aLineChart().withDataSet(stackedDataSet).withLabels(dates)
          .withLegendVisible()
          .withOptions({
            // scales: {yAxes: [{stacked: true, ticks: {min: 0, max: 1}}]}
            scales: {
              xAxes: [{scaleLabel: {display: true, labelString: 'Date'}}],
              yAxes: [{
                stacked: true, ticks: {min: 0, max: 1},
                scaleLabel: {display: true, labelString: 'Market share proportion'}
              }]
            }
          })
          .build();
      }
    );
  }

  private generateStackedData(dataSet: ChartData[]): ChartData[] {
    // strip data of labels
    let unlabeledData: number[][] = dataSet.map(chartData => chartData.data);

    // get the total for each date by zipping the data and summing each element
    let totals: number[] = this.arrayZip(unlabeledData).map(AgencyCompetitionComponent.sum());

    // return a new data set where each data point is proportional
    return dataSet.map(chartData => {
      let proportionalData = chartData.data.map((n, i) => n / totals[i]);
      return new ChartData(proportionalData, chartData.label);
    });
  }

  private parseChartData() {
    return agency => new ChartData(agency.bookings.map(n => parseFloat(n)), agency.agency);
  }

  private static sum() {
    return (numbers: number[]) => numbers.reduce((a, b) => a + b, 0);
  }

  /*
   take n arrays of m elements and zip them as m arrays of n elements (basically a matrix transpose)
   e.g. [[1,2],[3,4],[5,6]] -> [[1,3,5],[2,4,6]]
    */
  private arrayZip(allData: number[][]): number[][] {
    let transposed: number[][] = Array.from(Array(allData[0].length)).map(() => []);
    allData.forEach(data => transposed.map((e, i) => e.push(data[i])));
    return transposed;
  }


}
