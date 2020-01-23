import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingPredictionComponent } from './booking-prediction.component';
import {ChartsModule} from "ng2-charts";
import {HttpModule} from "@angular/http";
import {FormsModule} from "@angular/forms";

describe('BookingPredictionComponent', () => {
  let component: BookingPredictionComponent;
  let fixture: ComponentFixture<BookingPredictionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ChartsModule, HttpModule, FormsModule],
      declarations: [ BookingPredictionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingPredictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
