import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ChartType } from 'chart.js';
import { QedCovidService } from '../services/qed-covid.service';

@Component({
  selector: 'south-africa',
  templateUrl: './south-africa.component.html',
  styleUrls: ['./south-africa.component.css']
})
export class SouthAfricaComponent implements OnInit {

  type = 'line';
  data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "My First dataset",
        data: [65, 59, 80, 81, 56, 55, 40]
      }
    ]
  };
  options = {
    responsive: true,
    maintainAspectRatio: false
  };

  constructor(private qedCovidService: QedCovidService) {

  }

  ngOnInit() {
    this.getDailyReportByCountryNameAndDate();
  }

  public doughnutChartLabels: string[] = ['Age 18 to 24', 'Age 25 to 35', 'Above 35+'];
  public demodoughnutChartData: number[][] = [[350, 450, 100], [250, 350, 150], [0, 100, 150]];
  public doughnutChartType: ChartType  = 'line';

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  getDailyReportByCountryNameAndDate() {
    const overAllDateList = []
    for (var i = 0; i < 7; i++) {
      const todaysDate = new Date();
      todaysDate.setDate(todaysDate.getDate() - i);
      const todaysDateIso = todaysDate.toISOString().substring(0, 10);
      overAllDateList.push(todaysDateIso);
    }
    console.log(overAllDateList);
    forkJoin(this.qedCovidService.getDailyReportByCountryName('south-africa', overAllDateList[0]), this.qedCovidService.getDailyReportByCountryName('south-africa', overAllDateList[1]),
      this.qedCovidService.getDailyReportByCountryName('south-africa', overAllDateList[2]), this.qedCovidService.getDailyReportByCountryName('south-africa', overAllDateList[3]),
      this.qedCovidService.getDailyReportByCountryName('south-africa', overAllDateList[4]), this.qedCovidService.getDailyReportByCountryName('south-africa', overAllDateList[5]),
      this.qedCovidService.getDailyReportByCountryName('south-africa', overAllDateList[6])).subscribe(([dayOne, dayTwo, dayThree, dayFour, dayFive, daySix]:
        [any, any, any, any, any, any, any]) => {
        console.log(dayOne);
        console.log(dayTwo);
        console.log(dayThree);
        console.log(dayFour);
        console.log(dayFive);
        console.log(daySix);
        console.log(this.qedCovidService.dailyReportByCountryName);
      }, function (err: any) {
        console.log(err);
      });
  }

}
