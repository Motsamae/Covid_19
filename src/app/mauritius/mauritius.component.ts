import { Component, OnInit, ViewChild } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { QedCovidService } from '../services/qed-covid.service';
import { DatePipe } from '@angular/common';
import { Color, Label, SingleDataSet } from 'ng2-charts';

export interface Tile {
  // color: string;
  cols: number;
  rows: number;
  text: string;
}

/**
 * @title Dynamic grid-list
 */

@Component({
  selector: 'mauritius',
  templateUrl: './mauritius.component.html',
  styleUrls: ['./mauritius.component.css']
})
export class MauritiusComponent implements OnInit {


  constructor(private qedCovidService: QedCovidService, public datepipe: DatePipe) {

  }

  ngOnInit() {
    this.getDailyReportByCountryNameAndDate();
  }

  tiles: Tile[] = [
    { text: 'Critical', cols: 1, rows: 1/*, color: 'lightblue'*/ },
    { text: 'Active', cols: 1, rows: 1/*, color: 'lightgreen' */ },
    { text: 'Deaths', cols: 1, rows: 1/*, color: 'lightpink' */ },
    { text: 'Tests', cols: 1, rows: 1/*, color: '#DDBDF1' */ },
  ];

  public doughnutChartLabels: string[] = [];
  public demodoughnutChartData: number[] = [];
  public demodoughnutChartData2: ChartDataSets[] = [
    { data: [], label: 'New Cases ' },
    { data: [], label: 'Deaths' },

  ];
  public doughnutChartType: ChartType = 'line';
  public doughnutChartColors: Color[] = [{
    // grey
    backgroundColor: 'rgba(148,159,177,0.2)',
    borderColor: 'rgba(148,159,177,1)',
    pointBackgroundColor: 'rgba(148,159,177,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  }, {
    // blue
    backgroundColor: 'rgba(0,114,187,0.2)',
    borderColor: 'rgba(0,114,187,1)',
    pointBackgroundColor: 'rgba(0,114,187,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(0,114,187,0.8)'
  }];

  options = {
    responsive: true,
    maintainAspectRatio: false
  };

  getDailyReportByCountryNameAndDate() {
    const overAllDateList: string[] = []
    for (var i = 0; i < 8; i++) {
      const todaysDate = new Date();
      todaysDate.setDate(todaysDate.getDate() - i);
      const todaysDateIso = todaysDate.toISOString().substring(0, 10);
      overAllDateList.push(todaysDateIso);
    }
    forkJoin(this.qedCovidService.getDailyReportByCountryName('mauritius', overAllDateList[0]), this.qedCovidService.getDailyReportByCountryName('mauritius', overAllDateList[1]),
      this.qedCovidService.getDailyReportByCountryName('mauritius', overAllDateList[2]), this.qedCovidService.getDailyReportByCountryName('mauritius', overAllDateList[3]),
      this.qedCovidService.getDailyReportByCountryName('mauritius', overAllDateList[4]), this.qedCovidService.getDailyReportByCountryName('mauritius', overAllDateList[5]),
      this.qedCovidService.getDailyReportByCountryName('mauritius', overAllDateList[6]), this.qedCovidService.getDailyReportByCountryName('mauritius', overAllDateList[7]),
      this.qedCovidService.getDailyReportForProvinces()).subscribe(([dayOne, dayTwo, dayThree, dayFour, dayFive, daySix, daySeven, dayEight, gautengData]:
        [any, any, any, any, any, any, any, any, any]) => {
        // separate the days data to get labels
        console.log(dayOne);
        console.log(this.qedCovidService.dailyReportByCountryName['mauritius']);
        const newDailyReport = this.qedCovidService.dailyReportByCountryName['mauritius'].filter((x:any)=>x !== undefined)
        for (var i = 0; i < overAllDateList.length; i++) {
          if (this.qedCovidService.dailyReportByCountryName['mauritius'][i]) {
            const getCaseDay = newDailyReport.find((x: any) => x.day === overAllDateList[i]);
            if (getCaseDay) {
                let convertCaseToNumberArray;
              if (getCaseDay.cases.new) {
                convertCaseToNumberArray = getCaseDay.cases.new.split('+');
              } else {
                convertCaseToNumberArray = ['', '0']
              }
              let caseToNumber = Number(convertCaseToNumberArray[1]);
              let todaysDateLable = new Date(overAllDateList[i]);
              let todaysMinus = todaysDateLable.setDate(todaysDateLable.getDate() - 1);
              let todaysDateLableConverted = this.datepipe.transform(todaysMinus, 'dd-MMM-yyyy') || '';
              this.demodoughnutChartData.push(caseToNumber!);
              this.doughnutChartLabels.push(todaysDateLableConverted!);
              this.demodoughnutChartData2[0].data?.push(caseToNumber);

              // deaths
              if (getCaseDay.deaths.new) {
                convertCaseToNumberArray = getCaseDay.deaths.new.split('+');
              } else {
                convertCaseToNumberArray = ['', '0'];
              }
              caseToNumber = Number(convertCaseToNumberArray[1]);
              todaysDateLable = new Date(overAllDateList[i]);

              todaysDateLableConverted = this.datepipe.transform(todaysDateLable, 'dd-MMM-yyyy') || '';
              this.demodoughnutChartData2[1].data?.push(caseToNumber);

            } else {
              let todaysDateLable = new Date(overAllDateList[i]);

              let todaysDateLableConverted = this.datepipe.transform(todaysDateLable, 'dd-MMM-yyyy') || '';
              this.demodoughnutChartData.push(0);
              this.doughnutChartLabels.push(todaysDateLableConverted!);
              this.demodoughnutChartData2[0].data?.push(0);

              this.demodoughnutChartData2[1].data?.push(0);

            }
          } else {
            let todaysDateLable = new Date(overAllDateList[i]);

            let todaysDateLableConverted = this.datepipe.transform(todaysDateLable, 'dd-MMM-yyyy') || '';
            this.demodoughnutChartData.push(0);
            this.doughnutChartLabels.push(todaysDateLableConverted!);
            this.demodoughnutChartData2[0].data?.push(0);

            this.demodoughnutChartData2[1].data?.push(0);

          }
        }
        this.tiles[0].text = this.tiles[0].text + ' :' + this.qedCovidService.dailyReportByCountryName['mauritius'][0].cases.critical;
        this.tiles[1].text = this.tiles[1].text + ' :' + this.qedCovidService.dailyReportByCountryName['mauritius'][0].cases.active;
        this.tiles[2].text = this.tiles[2].text + ' :' + this.qedCovidService.dailyReportByCountryName['mauritius'][0].deaths.total;
        this.tiles[3].text = this.tiles[3].text + ' :' + this.qedCovidService.dailyReportByCountryName['mauritius'][0].tests.total;
      }, function (err: any) {
        console.log(err);
      });

  }

  public chartClicked(e: any): void {
    // console.log(e);
  }

  public chartHovered(e: any): void {
    // console.log(e);
  }


}
