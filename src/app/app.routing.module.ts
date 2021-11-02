import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SouthAfricaComponent } from '../app/south-africa/south-africa.component';
import { NewCasesComponent } from '../app/new-cases/new-cases.component';
const routes: Routes = [
  { path: 'south-africa', component: SouthAfricaComponent },
  { path: 'new-cases', component: NewCasesComponent },

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
