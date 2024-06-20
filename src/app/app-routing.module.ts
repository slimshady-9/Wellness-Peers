import { SinglePatientDetailsComponent } from './components/single-patient-details/single-patient-details.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientComponent } from './components/patient/patient.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { DashyComponent } from './dashy/dashy.component';
import { AuthGuard } from './guards/auth.guard'

const routes: Routes = [
  {path:'' , component:DashyComponent},
  {path:'login', component:LoginPageComponent},
  {path:'dashboard', component:DashboardComponent, canActivate:[AuthGuard]},
  {path:'patients' , component:PatientComponent, canActivate:[AuthGuard]},
  {path:'patient/:hadmId',component:SinglePatientDetailsComponent, canActivate:[AuthGuard]}

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
