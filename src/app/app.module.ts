import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppRoutingModule } from '../app/app.routing.module'
import { HttpClientModule } from '@angular/common/http';
import { ChartModule } from 'angular2-chartjs';
import { ChartsModule, ThemeService } from 'ng2-charts';
import { SouthAfricaComponent } from './south-africa/south-africa.component';
import { DatePipe } from '@angular/common';
import { HomeComponent } from './home/home.component';
@NgModule({
  declarations: [
    AppComponent,
    SouthAfricaComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTabsModule,
    FlexLayoutModule,
    HttpClientModule,
    ChartModule,
    AppRoutingModule,
    ChartsModule,
  ],
  providers: [ThemeService, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
