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
  selector: 'nigeria',
  templateUrl: './nigeria.component.html',
  styleUrls: ['./nigeria.component.css']
})
export class NigeriaComponent implements OnInit {

  constructor(private qedCovidService: QedCovidService, public datepipe: DatePipe) {

  }

  ngOnInit() {
 
  }
}
