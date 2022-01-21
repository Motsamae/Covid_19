import { Component, OnInit, ViewChild } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ChartDataSets, ChartType } from 'chart.js';
import { QedCovidService } from '../services/qed-covid.service';
import { DatePipe } from '@angular/common';
import { BaseChartDirective, Color } from 'ng2-charts';

@Component({
  selector: 'south-africa',
  templateUrl: './south-africa.component.html',
  styleUrls: ['./south-africa.component.css']
})
export class SouthAfricaComponent implements OnInit {

  type = 'line';
  data = {
    labels: new Array<string>(),// ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "South Africa",
        data: new Array<number>()// [65, 59, 80, 81, 56, 55, 40]
      }, {
        label: "Gauteng",
        data: new Array<number>()// [65, 59, 80, 81, 56, 55, 40]
      },
    ]
  };

  options = {
    responsive: true,
    maintainAspectRatio: false
  };

  constructor(private qedCovidService: QedCovidService, public datepipe: DatePipe) {

  }

  ngOnInit() {

    this.getDailyReportByCountryNameAndDate();
  }

  public doughnutChartLabels: string[] = [];// ['Age 18 to 24', 'Age 25 to 35', 'Above 35+'];
  public demodoughnutChartData: number[] = [];// [[350, 450, 100], [250, 350, 150], [0, 100, 150]];
  public demodoughnutChartData2: ChartDataSets[] = [
    { data: [], label: 'South Africa' },
    { data: [], label: 'Gauteng' },
    { data: [], label: 'KZN' },
    { data: [], label: 'Western Cape' }

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
  }, {
    // purple 147,112,219
    backgroundColor: 'rgba(147,112,219,0.2)',
    borderColor: 'rgba(147,112,219,1)',
    pointBackgroundColor: 'rgba(147,112,219,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(147,112,219,0.8)'
  }, {
    // green
    backgroundColor: 'rgba(202,255,112,0.2)',
    borderColor: 'rgba(202,255,112,1)',
    pointBackgroundColor: 'rgba(202,255,112,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(202,255,112,0.8)'

  }
  ];

  gautengCovidData: any = [];
  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  getDailyReportByCountryNameAndDate() {
    const overAllDateList: string[] = []
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
      this.qedCovidService.getDailyReportByCountryName('south-africa', overAllDateList[6]),
      this.qedCovidService.getDailyReportForProvinces()).subscribe(([dayOne, dayTwo, dayThree, dayFour, dayFive, daySix, daySeven, gautengData]:
        [any, any, any, any, any, any, any, any]) => {
        // separate the days data to get labels
        // this.data
        for (var i = 0; i < overAllDateList.length; i++) {
          const getCaseDay = this.qedCovidService.dailyReportByCountryName['south-africa'].find((x: any) => x.day === overAllDateList[i]);
          const convertCaseToNumberArray = getCaseDay.cases.new.split('+');
          const caseToNumber = Number(convertCaseToNumberArray[1]);
          // this.data.datasets[0].data.push(caseToNumber);
          const todaysDateLable = new Date(overAllDateList[i]);
          const todaysDateLableConverted = this.datepipe.transform(todaysDateLable, 'dd-MMM-yyyy') || '';
          // this.data.labels.push(todaysDateLableConverted);
          this.demodoughnutChartData.push(caseToNumber!);
          this.doughnutChartLabels.push(todaysDateLableConverted!);
          this.demodoughnutChartData2[0].data?.push(caseToNumber);
        }
        // Provice DATA
        const gautengCovidDataHolder = [];
        const kznCovidDataHolder = []
        const westernCapeDataHolder = [];
        for (let i = 0; i < gautengData.length; i++) {
          gautengCovidDataHolder.push(Number(gautengData[i].provinces.gauteng));
          kznCovidDataHolder.push(Number(gautengData[i].provinces.kwazulu_natal));
          westernCapeDataHolder.push(Number(gautengData[i].provinces.western_cape));
        }
        let diffVal: number;
        // gauteng
        for (let i = 0; i < gautengCovidDataHolder.length; i++) {
          if (i !== 0) {
            diffVal = (gautengCovidDataHolder[i + 1]) - gautengCovidDataHolder[i];
          } else {
            diffVal = (gautengCovidDataHolder[1]) - gautengCovidDataHolder[i];
          }
          if (diffVal) {
            this.demodoughnutChartData2[1].data?.push(diffVal);

            // manuelly get date and set cause of USA format
            const todaysDateLable = this.doDate(gautengData[i].date);
            const todaysDateLableConverted = this.datepipe.transform(todaysDateLable, 'dd-MMM-yyyy') || '';
            this.data.labels.push(todaysDateLableConverted);
          }
        }
        // kzn
        for (let i = 0; i < kznCovidDataHolder.length; i++) {
          if (i !== 0) {
            diffVal = (kznCovidDataHolder[i + 1]) - kznCovidDataHolder[i];
          } else {
            diffVal = (kznCovidDataHolder[1]) - kznCovidDataHolder[i];
          }
          if (diffVal) {
            this.demodoughnutChartData2[2].data?.push(diffVal);

            // manuelly get date and set cause of USA format
            const todaysDateLable = this.doDate(gautengData[i].date);
            const todaysDateLableConverted = this.datepipe.transform(todaysDateLable, 'dd-MMM-yyyy') || '';
            this.data.labels.push(todaysDateLableConverted);
          }
        }
        // western cape
        for (let i = 0; i < westernCapeDataHolder.length; i++) {
          if (i !== 0) {
            diffVal = (westernCapeDataHolder[i + 1]) - westernCapeDataHolder[i];
          } else {
            diffVal = (westernCapeDataHolder[1]) - westernCapeDataHolder[i];
          }
          if (diffVal) {
            this.demodoughnutChartData2[3].data?.push(diffVal);

            // manuelly get date and set cause of USA format
            const todaysDateLable = this.doDate(gautengData[i].date);
            const todaysDateLableConverted = this.datepipe.transform(todaysDateLable, 'dd-MMM-yyyy') || '';
            this.data.labels.push(todaysDateLableConverted);
          }
        }
        console.log(this.demodoughnutChartData2);
      }, function (err: any) {
        console.log(err);
      });

  }

  doDate(date: any) {
    try {
      const splitDate = date.split('-');
      const day = splitDate[0];
      const month = splitDate[1];
      const year = splitDate[2];
      const newDateISO = (month + '-' + day + '-' + year).toString();
      const newDate = new Date(newDateISO);
      return newDate;
    } catch (e) {
      console.log(e);
      return date;
    }
  }
}
