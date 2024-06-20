import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashyComponent } from './dashy.component';

describe('DashyComponent', () => {
  let component: DashyComponent;
  let fixture: ComponentFixture<DashyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
