import {Color} from "ng2-charts";
import {ChartType} from "./chart-type";
import {Chart} from "./chart";
import {ChartData} from "./chart-data";

export class ChartBuilder {

  public static aHorizontalBarChart(): ChartBuilder {
    return new ChartBuilder(ChartType.horizontalBar);
  }

  public static aVerticalBarChart(): ChartBuilder {
    return new ChartBuilder(ChartType.bar);
  }

  public static aLineChart(): ChartBuilder {
    return new ChartBuilder(ChartType.line);
  }

  private constructor(chartType: ChartType) {
    this.chart = new Chart(chartType);
    this.chart.legend = false;
  }

  private chart: Chart;

  // use chart.data for a single data entry
  public withData(data: number[]): ChartBuilder {
    this.chart.data = data;
    return this;
  }

  // use chart.datasets for multiple data entries
  public withDataSet(dataset: ChartData[]): ChartBuilder {
    this.chart.datasets = dataset;
    return this;
  }

  public withLabels(labels: string[]): ChartBuilder {
    this.chart.labels = labels;
    return this;
  }

  public withOptions(options: any): ChartBuilder {
    this.chart.options = options;
    return this;
  }

  public withColors(colors: Color[]): ChartBuilder {
    this.chart.colors = colors;
    return this;
  }

  public withLegendVisible(): ChartBuilder {
    this.chart.legend = true;
    return this;
  }

  public build(): Chart {
    return this.chart;
  }

}
