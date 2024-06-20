import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinglePatientDetailsComponent } from './single-patient-details.component';

describe('SinglePatientDetailsComponent', () => {
  let component: SinglePatientDetailsComponent;
  let fixture: ComponentFixture<SinglePatientDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SinglePatientDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SinglePatientDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
