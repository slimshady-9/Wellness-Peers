import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PatientService } from '../services/patient.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {
  loginFlag!:any;
  constructor(private router:Router, private patientService:PatientService){

  }
  ngOnInit() {
    this.patientService.isUserLoggedIn.subscribe(res=>{
      this.loginFlag=res;
    })
  }

  navigateDashboard(){
    this.router.navigateByUrl('/dashboard');
  }

  navigatePatients(){
    this.router.navigateByUrl('/patients');
  }
  navigateToSinglePatientPage()
  {
    this.router.navigateByUrl('/singlePatient');
  }

  navigateLogin(){
    this.router.navigateByUrl('/login');
  }

  navigateHome(){
    this.router.navigateByUrl('/');
  }

  onLogoutClick(){
    this.patientService.isUserLoggedIn.next(false);
    sessionStorage.setItem('isUserLoggedIn','false');
    this.router.navigateByUrl('/');
  }
}
