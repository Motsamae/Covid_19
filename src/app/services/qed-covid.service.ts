import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class QedCovidService {

  source: any[];
  options = {
    "method": "",
    "url": "https://covid-193.p.rapidapi.com/history",
    "params": { country: '', day: '' },
    "headers": {
      "x-rapidapi-host": "covid-193.p.rapidapi.com",
      "x-rapidapi-key": "d4618b9920msh391054b106bc37ap135d5djsn5feddb02bd93",
      "useQueryString": "true"
    }
  };

  constructor(private http: HttpClient) {
    this.source = new Array<any>();
  }

  getDailyReportByCountryName(country: any, date: any): any {
    this.options.method = "GET";
    this.options.params.country = country;
    this.options.params.day = date;

    return this.http.get(this.options.url + this.options.params + this.options.headers).pipe(
      map((res: any) => {
        this.dailyReportByCountryName[country].push(res.response[0]);
        return res;
      }), catchError(err => {
        throw new Error(err);
      }));
  }

  dailyReportByCountryName: any = { 'southAfrica': [],'mauritius':[],'kenya':[],'nigeria':[] }
  getDailyReportByCountryNameLoop() {
    // south africa last 7 days
    // get date    
    // for (var i = 0; i < 6; i++) {
      const todaysDate = new Date();
      todaysDate.setDate(todaysDate.getDate());
      const todaysDateIso = todaysDate.toISOString().substring(0, 10);
      const x = this.getDailyReportByCountryName('South Africa', todaysDateIso);
    // }
    console.log(x);
    return this.dailyReportByCountryName;
  }

}
