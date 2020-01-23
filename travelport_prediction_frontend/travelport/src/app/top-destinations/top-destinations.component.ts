import {Component, ViewChild} from '@angular/core';
import {Chart} from "../encapsulation-objects/chart/chart";
import {HttpApiService} from "../http-api-service.service";
import {Months} from "../utility/months";
import {ChartBuilder} from "../encapsulation-objects/chart/chart-builder";
import {BaseChartDirective} from "ng2-charts";
import {ChartData} from "../encapsulation-objects/chart/chart-data";

@Component({
  selector: 'app-top-destinations',
  templateUrl: './top-destinations.component.html',
  styleUrls: ['./top-destinations.component.css'],
  providers: [HttpApiService]
})
export class TopDestinationsComponent {
  public topDestination: Chart;
  public months: string[] = Months.Months;
  public selectedMonth: string = this.months[0];
  @ViewChild(BaseChartDirective) baseChart: BaseChartDirective;

  constructor(private apiService: HttpApiService) {
    this.updateChart();
  }

  public updateChart(): void {
    this.getTopDestinationsInMonth(Months.Months.indexOf(this.selectedMonth) + 1);
  }

  private getTopDestinationsInMonth(monthNo: number): void {
    let jsonTopDes: string;
    this.apiService.getTopDestinationsInMonth(monthNo).subscribe(
      jsonData => jsonTopDes = JSON.stringify(jsonData),
      error => console.log(error),
      () => {
        let parsedTopDes = JSON.parse(jsonTopDes);
        let chartData: number[] = [];
        let labels: string[] = [];

        parsedTopDes.map(data => {
          chartData.push(data.count);
          labels.push(data.airport);
        });


        // create chart and initialise style
        this.topDestination = ChartBuilder.aHorizontalBarChart()
          .withDataSet([new ChartData(chartData, 'Number of visits')])
          .withLabels(labels)
          .withOptions({
            scaleShowVerticalLines: false,
            responsive: true,
            scales: {
              xAxes: [{scaleLabel: {display: true, labelString: 'Number of visits'}, ticks: {beginAtZero: true}}],
              yAxes: [{scaleLabel: {display: true, labelString: 'Airport Code'}}]
            }
          })
          .withColors([{backgroundColor: 'darkRed', hoverBackgroundColor: 'purple'}])
          .build();

        this.baseChart.chart.config.data.labels = this.topDestination.labels;
      }
    )
  }

}
