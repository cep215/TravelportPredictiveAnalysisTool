import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinationPredictionComponent } from './destination-prediction.component';
import {FormsModule} from "@angular/forms";
import {ChartsModule} from "ng2-charts";
import {HttpModule} from "@angular/http";

describe('DestinationPredictionComponent', () => {
  let component: DestinationPredictionComponent;
  let fixture: ComponentFixture<DestinationPredictionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ChartsModule, HttpModule],
      declarations: [ DestinationPredictionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DestinationPredictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
