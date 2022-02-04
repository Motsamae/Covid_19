import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SouthAfricaComponent } from '../app/south-africa/south-africa.component';
import { HomeComponent } from '../app/home/home.component';

const routes: Routes = [
  { path: 'south-africa', component: SouthAfricaComponent },
  { path: 'home', component: HomeComponent },

  { path: '', redirectTo: '/home', pathMatch: 'full' }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule { }
