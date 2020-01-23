
export class Months {
  public static Months: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  public static getMonth(monthNumber: number): string {
    return Months.Months[monthNumber - 1];
  }

  public static getMonthNumbers(): number[] {
    return Array.from(Array(12).keys()).map(num => num + 1);
  }
}
