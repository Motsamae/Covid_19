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
  selector: 'south-africa',
  templateUrl: './south-africa.component.html',
  styleUrls: ['./south-africa.component.css']
})
export class SouthAfricaComponent implements OnInit {

  tiles: Tile[] = [
    { text: 'Critical', cols: 1, rows: 1/*, color: 'lightblue'*/ },
    { text: 'Active', cols: 1, rows: 1/*, color: 'lightgreen' */ },
    { text: 'Deaths', cols: 1, rows: 1/*, color: 'lightpink' */ },
    { text: 'Tests', cols: 1, rows: 1/*, color: '#DDBDF1' */ },
  ];

  type = 'line';
  data = {
    labels: new Array<string>(),
    datasets: [
      {
        label: "South Africa",
        data: new Array<number>()
      }, {
        label: "Gauteng",
        data: new Array<number>()
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
    forkJoin(this.qedCovidService.getDailyReportByCountryName('south-africa', overAllDateList[0]), this.qedCovidService.getDailyReportByCountryName('south-africa', overAllDateList[1]),
      this.qedCovidService.getDailyReportByCountryName('south-africa', overAllDateList[2]), this.qedCovidService.getDailyReportByCountryName('south-africa', overAllDateList[3]),
      this.qedCovidService.getDailyReportByCountryName('south-africa', overAllDateList[4]), this.qedCovidService.getDailyReportByCountryName('south-africa', overAllDateList[5]),
      this.qedCovidService.getDailyReportByCountryName('south-africa', overAllDateList[6]),
      this.qedCovidService.getDailyReportForProvinces()).subscribe(([dayOne, dayTwo, dayThree, dayFour, dayFive, daySix, daySeven, gautengData]:
        [any, any, any, any, any, any, any, any]) => {
        // separate the days data to get labels
        // this.data
        for (var i = 0; i < overAllDateList.length; i++) {

          if (this.qedCovidService.dailyReportByCountryName['south-africa'][i]) {
            const getCaseDay = this.qedCovidService.dailyReportByCountryName['south-africa'].find((x: any) => x.day === overAllDateList[i]);
            let convertCaseToNumberArray = getCaseDay.cases.new.split('+');

            let caseToNumber = Number(convertCaseToNumberArray[1]);
            let todaysDateLable = new Date(overAllDateList[i]);
            let todaysDateLableConverted = this.datepipe.transform(todaysDateLable, 'dd-MMM-yyyy') || '';
            // this.data.labels.push(todaysDateLableConverted);
            this.demodoughnutChartData.push(caseToNumber!);
            this.doughnutChartLabels.push(todaysDateLableConverted!);
            this.demodoughnutChartData2[0].data?.push(caseToNumber);

            // deaths
            convertCaseToNumberArray = getCaseDay.deaths.new.split('+');
            caseToNumber = Number(convertCaseToNumberArray[1]);
            todaysDateLable = new Date(overAllDateList[i]);

            todaysDateLableConverted = this.datepipe.transform(todaysDateLable, 'dd-MMM-yyyy') || '';
            this.demodoughnutChartData2[1].data?.push(caseToNumber);

          } else {
            let todaysDateLable = new Date(overAllDateList[i]);

            let todaysDateLableConverted = this.datepipe.transform(todaysDateLable, 'dd-MMM-yyyy') || '';
            this.demodoughnutChartData.push(0);
            this.doughnutChartLabels.push(todaysDateLableConverted!);
            this.demodoughnutChartData2[1].data?.push(0);

          }
        }
        this.tiles[0].text = this.tiles[0].text + ' :' + this.qedCovidService.dailyReportByCountryName['south-africa'][0].cases.critical;
        this.tiles[1].text = this.tiles[1].text + ' :' + this.qedCovidService.dailyReportByCountryName['south-africa'][0].cases.active;
        this.tiles[2].text = this.tiles[2].text + ' :' + this.qedCovidService.dailyReportByCountryName['south-africa'][0].deaths.total;
        this.tiles[3].text = this.tiles[3].text + ' :' + this.qedCovidService.dailyReportByCountryName['south-africa'][0].tests.total;

        // Provice DATA
        const gautengCovidDataHolder = [];
        const kznCovidDataHolder = []
        const westernCapeDataHolder = [];
        const easternCapeCovidDataHolder = [];
        const northenCapeCovidDataHolder = []
        const limpopoCapeDataHolder = [];
        const northWestCovidDataHolder = [];
        const mpumalangaCovidDataHolder = []
        const freeStateDataHolder = [];
        for (let i = 0; i < gautengData.length; i++) {
          gautengCovidDataHolder.push(Number(gautengData[i].provinces.gauteng));
          kznCovidDataHolder.push(Number(gautengData[i].provinces.kwazulu_natal));
          westernCapeDataHolder.push(Number(gautengData[i].provinces.western_cape));

          easternCapeCovidDataHolder.push(Number(gautengData[i].provinces.eastern_cape));
          northenCapeCovidDataHolder.push(Number(gautengData[i].provinces.northern_cape));
          limpopoCapeDataHolder.push(Number(gautengData[i].provinces.limpopo));
          northWestCovidDataHolder.push(Number(gautengData[i].provinces.north_west));
          mpumalangaCovidDataHolder.push(Number(gautengData[i].provinces.mpumlanga));
          freeStateDataHolder.push(Number(gautengData[i].provinces.free_state));
        }
        let diffVal: number;
        // gauteng
        let totalHolder = [];
        for (let i = 0; i < gautengCovidDataHolder.length; i++) {
          if (i !== 0) {
            diffVal = (gautengCovidDataHolder[i + 1]) - gautengCovidDataHolder[i];
          } else {
            diffVal = (gautengCovidDataHolder[1]) - gautengCovidDataHolder[i];
          }
          if (diffVal) {
            totalHolder.push(diffVal);
          }
        }
        let gauTotal = totalHolder.reduce((sum, current) => sum + current, 0);
        totalHolder = []
        this.pieChartLabels.push('Gauteng');
        this.pieChartData.push(gauTotal);
        //  // kzn
        for (let i = 0; i < kznCovidDataHolder.length; i++) {
          if (i !== 0) {
            diffVal = (kznCovidDataHolder[i + 1]) - kznCovidDataHolder[i];
          } else {
            diffVal = (kznCovidDataHolder[1]) - kznCovidDataHolder[i];
          }
          if (diffVal) {
            totalHolder.push(diffVal);

          }
        }
        gauTotal = totalHolder.reduce((sum, current) => sum + current, 0);
        totalHolder = []
        this.pieChartLabels.push('Kwa-Zulu/Natal');
        this.pieChartData.push(gauTotal);

        //  // western cape
        for (let i = 0; i < westernCapeDataHolder.length; i++) {
          if (i !== 0) {
            diffVal = (westernCapeDataHolder[i + 1]) - westernCapeDataHolder[i];
          } else {
            diffVal = (westernCapeDataHolder[1]) - westernCapeDataHolder[i];
          }
          if (diffVal) {
            totalHolder.push(diffVal);

          }
        }
        gauTotal = totalHolder.reduce((sum, current) => sum + current, 0);
        totalHolder = []
        this.pieChartLabels.push('Western Cape');
        this.pieChartData.push(gauTotal);

        // Eastern Cape
        for (let i = 0; i < easternCapeCovidDataHolder.length; i++) {
          if (i !== 0) {
            diffVal = (easternCapeCovidDataHolder[i + 1]) - easternCapeCovidDataHolder[i];
          } else {
            diffVal = (easternCapeCovidDataHolder[1]) - easternCapeCovidDataHolder[i];
          }
          if (diffVal) {
            totalHolder.push(diffVal);

          }
        }
        gauTotal = totalHolder.reduce((sum, current) => sum + current, 0);
        totalHolder = []
        this.dataSource = [];
        let cumulative = gautengData[7].provinces.eastern_cape;
        this.dataSource.push({
          position: 1,
          province: 'Eastern Cape',
          sevenDayPeriod: gauTotal,
          cumulative: cumulative
        });

        // Northern Cape
        for (let i = 0; i < northenCapeCovidDataHolder.length; i++) {
          if (i !== 0) {
            diffVal = (northenCapeCovidDataHolder[i + 1]) - northenCapeCovidDataHolder[i];
          } else {
            diffVal = (northenCapeCovidDataHolder[1]) - northenCapeCovidDataHolder[i];
          }
          if (diffVal) {
            totalHolder.push(diffVal);

          }
        }
        gauTotal = totalHolder.reduce((sum, current) => sum + current, 0);
        totalHolder = []
        cumulative = gautengData[7].provinces.northern_cape;
        this.dataSource.push({
          position: 2,
          province: 'Northern Cape',
          sevenDayPeriod: gauTotal,
          cumulative: cumulative
        });

        //
        // limpopo
        for (let i = 0; i < limpopoCapeDataHolder.length; i++) {
          if (i !== 0) {
            diffVal = (limpopoCapeDataHolder[i + 1]) - limpopoCapeDataHolder[i];
          } else {
            diffVal = (limpopoCapeDataHolder[1]) - limpopoCapeDataHolder[i];
          }
          if (diffVal) {
            totalHolder.push(diffVal);
          }
        }
        gauTotal = totalHolder.reduce((sum, current) => sum + current, 0);
        totalHolder = [];
        cumulative = gautengData[7].provinces.limpopo;
        this.dataSource.push({
          position: 3,
          province: 'Limpopo',
          sevenDayPeriod: gauTotal,
          cumulative: cumulative
        });

        // North West
        for (let i = 0; i < northWestCovidDataHolder.length; i++) {
          if (i !== 0) {
            diffVal = (northWestCovidDataHolder[i + 1]) - northWestCovidDataHolder[i];
          } else {
            diffVal = (northWestCovidDataHolder[1]) - northWestCovidDataHolder[i];
          }
          if (diffVal) {
            totalHolder.push(diffVal);
          }
        }
        gauTotal = totalHolder.reduce((sum, current) => sum + current, 0);
        totalHolder = [];
        cumulative = gautengData[7].provinces.north_west;
        this.dataSource.push({
          position: 4,
          province: 'North West',
          sevenDayPeriod: gauTotal,
          cumulative: cumulative
        });

        // mpumlanga
        for (let i = 0; i < mpumalangaCovidDataHolder.length; i++) {
          if (i !== 0) {
            diffVal = (mpumalangaCovidDataHolder[i + 1]) - mpumalangaCovidDataHolder[i];
          } else {
            diffVal = (mpumalangaCovidDataHolder[1]) - mpumalangaCovidDataHolder[i];
          }
          if (diffVal) {
            totalHolder.push(diffVal);
          }
        }
        gauTotal = totalHolder.reduce((sum, current) => sum + current, 0);
        totalHolder = [];
        cumulative = gautengData[7].provinces.mpumlanga;
        this.dataSource.push({
          position: 5,
          province: 'Mpumalanga',
          sevenDayPeriod: gauTotal,
          cumulative: cumulative
        });

        // free state
        for (let i = 0; i < freeStateDataHolder.length; i++) {
          if (i !== 0) {
            diffVal = (freeStateDataHolder[i + 1]) - freeStateDataHolder[i];
          } else {
            diffVal = (freeStateDataHolder[1]) - freeStateDataHolder[i];
          }
          if (diffVal) {
            totalHolder.push(diffVal);
          }
        }
        gauTotal = totalHolder.reduce((sum, current) => sum + current, 0);
        totalHolder = [];
        cumulative = gautengData[7].provinces.free_state;
        this.dataSource.push({
          position: 6,
          province: 'Free State',
          sevenDayPeriod: gauTotal,
          cumulative: cumulative
        });
      }, function (err: any) {
        console.log(err);
      });

  }
  displayedColumns: string[] = ['position', 'province', 'sevenDayPeriod', 'cumulative'];
  dataSource: PeriodicElement[];
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = [];
  public pieChartData: SingleDataSet = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];


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
export interface PeriodicElement {
  province: string;
  position: number;
  sevenDayPeriod: number;
  cumulative: number;
}
