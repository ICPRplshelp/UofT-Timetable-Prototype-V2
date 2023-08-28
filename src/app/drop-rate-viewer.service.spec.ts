import { TestBed } from '@angular/core/testing';

import { DropRateViewerService } from './drop-rate-viewer.service';

describe('DropRateViewerService', () => {
  let service: DropRateViewerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DropRateViewerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
