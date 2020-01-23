import { TestBed, inject } from '@angular/core/testing';

import { HttpApiService } from './http-api-service.service';
import {HttpModule} from "@angular/http";

describe('HttpApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [HttpApiService]
    });
  });

  it('should be created', inject([HttpApiService], (service: HttpApiService) => {
    expect(service).toBeTruthy();
  }));
});
