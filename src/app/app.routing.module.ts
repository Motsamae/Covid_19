import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SouthAfricaComponent } from '../app/south-africa/south-africa.component';
import { HomeComponent } from '../app/home/home.component';
import { NigeriaComponent } from './nigeria/nigeria.component';
import { KenyaComponent } from './kenya/kenya.component';
import { MauritiusComponent } from './mauritius/mauritius.component';

const routes: Routes = [
  { path: 'south-africa', component: SouthAfricaComponent },
  { path: 'home', component: HomeComponent },
  { path: 'nigeria', component: NigeriaComponent },
  { path: 'kenya', component: KenyaComponent },
  { path: 'mauritius', component: MauritiusComponent },

  { path: '', redirectTo: '/south-africa', pathMatch: 'full' }
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
