import { TestBed } from '@angular/core/testing';

import { ZonaRefriFormService } from './zona-refri-form.service';

describe('ZonaRefriFormService', () => {
  let service: ZonaRefriFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZonaRefriFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
