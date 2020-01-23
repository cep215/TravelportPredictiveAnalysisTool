import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopDestinationsComponent } from './top-destinations.component';
import {ChartsModule} from "ng2-charts";
import {HttpModule} from "@angular/http";
import {FormsModule} from "@angular/forms";

describe('TopDestinationsComponent', () => {
  let component: TopDestinationsComponent;
  let fixture: ComponentFixture<TopDestinationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ChartsModule, HttpModule, FormsModule],
      declarations: [ TopDestinationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopDestinationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
