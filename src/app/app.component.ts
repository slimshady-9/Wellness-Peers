import { Component } from '@angular/core';
import { PatientService } from './services/patient.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'health_risk_status';
  constructor(private patientService:PatientService){}
  ngOnInit() {
    if(!sessionStorage.hasOwnProperty('isUserLoggedIn')){
      console.log("has property");
      sessionStorage.setItem('isUserLoggedIn','false');
      this.patientService.isUserLoggedIn.next(false);
    }
  }
}
