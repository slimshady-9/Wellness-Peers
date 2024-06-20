import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PatientService } from '../services/patient.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {
  constructor(private router: Router, private patientService:PatientService) {}
  email!: string;
  password!: number;
  //admin_email='admin@gamil.com'
  //admin_password=123;

  onSubmit() {
    if (this.email == 'admin@gmail.com' && this.password == 123456) {
      sessionStorage.setItem('isUserLoggedIn','true');
      this.patientService.isUserLoggedIn.next(true);
      this.router.navigateByUrl('/dashboard');
    }
  }
}
