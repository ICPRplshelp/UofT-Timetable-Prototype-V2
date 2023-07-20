import { TestBed } from '@angular/core/testing';

import { ClTimingsSharerService } from './cl-timings-sharer.service';

describe('ClTimingsSharerService', () => {
  let service: ClTimingsSharerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClTimingsSharerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
