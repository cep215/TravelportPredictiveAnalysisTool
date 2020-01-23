import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyCompetitionComponent } from './agency-competition.component';
import {ChartsModule} from "ng2-charts";
import {HttpApiService} from "../http-api-service.service";
import {HttpModule} from "@angular/http";
import {FormsModule} from "@angular/forms";

describe('AgencyCompetitionComponent', () => {
  let component: AgencyCompetitionComponent;
  let fixture: ComponentFixture<AgencyCompetitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ChartsModule, HttpModule, FormsModule],
      declarations: [ AgencyCompetitionComponent ],
      providers: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgencyCompetitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
