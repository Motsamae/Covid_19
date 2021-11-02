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
      "x-rapidAPI-key": "d4618b9920msh391054b106bc37ap135d5djsn5feddb02bd93",
    }
  };

  constructor(private http: HttpClient) {
    this.source = new Array<any>();
  }

  getDailyReportByCountryName(country: any, date: any): any {
    this.options.method = "GET";
    this.options.params.country = country;
    this.options.params.day = date;

    return this.http.get(this.options.url, this.options).pipe(
      map((res: any) => {
        this.dailyReportByCountryName[country].push(res.response[0]);
        return res;
      }), catchError(err => {
        throw new Error(err);
      }));
  }

  dailyReportByCountryName: any = { 'south-africa': [], 'mauritius': [], 'kenya': [], 'nigeria': [] };

}
