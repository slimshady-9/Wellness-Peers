import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { PatientService } from '../services/patient.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private patientService:PatientService, private router:Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this.patientService.isUserLoggedIn_1 || sessionStorage.getItem('isUserLoggedIn')=='true'){
        return true;
      }
      else{
        this.router.navigate(['/login']);
        return false
      }
  }

}
