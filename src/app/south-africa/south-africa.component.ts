import { Component, OnInit } from '@angular/core';
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
    // this.getDailyReportByCountryNameLoop();
  }

  getDailyReportByCountryNameLoop() {
    this.qedCovidService.getDailyReportByCountryNameLoop().subscribe(function (data:any) {
      console.log(data);
    }, function (err:any) {
      console.log(err);
    });
  }

}
