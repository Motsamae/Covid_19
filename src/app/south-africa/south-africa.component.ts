import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { QedCovidService } from '../services/qed-covid.service';

@Component({
  selector: 'south-africa',
  templateUrl: './south-africa.component.html',
  styleUrls: ['./south-africa.component.css']
})
export class SouthAfricaComponent implements OnInit {
  constructor(private qedCovidService: QedCovidService) {

  }

  ngOnInit() {
    this.getDailyReportByCountryNameAndDate();
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
