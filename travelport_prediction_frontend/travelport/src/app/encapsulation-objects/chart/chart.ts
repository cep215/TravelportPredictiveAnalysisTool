import {Color} from "ng2-charts";
import {ChartType} from "./chart-type";
import {ChartData} from "./chart-data";

export class Chart {
  public data: number[];
  public datasets: ChartData[];
  public labels: string[];
  public chartType: string;
  public legend: boolean;
  public options: any;
  public colors: Color[];

  constructor(chartType: ChartType) {
    this.chartType = ChartType[chartType];
  }



}

