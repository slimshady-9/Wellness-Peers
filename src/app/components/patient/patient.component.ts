
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { PatientService } from 'src/app/services/patient.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss']
})
export class PatientComponent implements AfterViewInit {
  displayedColumns: string[] = ['SUBJECT_ID', 'HADM_ID', 'Riskgroup', 'AGE','GENDER','actions'];
  gridColumns = 3;
  allpatientData!:any;
  dataSource!:any;
  admissionTypeCount!:any;
  currentCount = 3000;
  currentCountElective=200;
  currentCountUrgent=0;
  

  constructor(private _liveAnnouncer: LiveAnnouncer, private patientService:PatientService, private router:Router) {}

  @ViewChild(MatSort) sort: MatSort | undefined;
  @ViewChild(MatPaginator) paginator: MatPaginator  | undefined;
  
   
  
  ngOnInit() {
    this.patientService.getAdmissionTypeCount().subscribe((res)=>{
      this.admissionTypeCount=res;

    })

    this.patientService.getAllPatientData().subscribe((res)=>{
      this.allpatientData=res;
      this.dataSource = new MatTableDataSource(this.allpatientData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
     setInterval(() => {
      if (this.currentCount < this.admissionTypeCount[0].EMERGENCY) {
      this.currentCount++;
       }
    }, 0);  
    setInterval(() => {
      if (this.currentCountElective< this.admissionTypeCount[0].ELECTIVE) {
      this.currentCountElective++;
       }
    }, 0);  
    
    setInterval(() => {
      if (this.currentCountUrgent< this.admissionTypeCount[0].URGENT) {
      this.currentCountUrgent++;
       }
    }, 20); 
  }

  ngAfterViewInit() {

  }

  toggleGridColumns() {
    this.gridColumns = this.gridColumns === 3 ? 4 : 3;
  }
  onButtonClick(rowData: any) {
    console.log(rowData);

    this.router.navigateByUrl('/patient/'+rowData.hadmID)
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}

