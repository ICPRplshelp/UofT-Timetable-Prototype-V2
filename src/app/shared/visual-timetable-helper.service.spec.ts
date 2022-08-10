import { TestBed } from '@angular/core/testing';

import { VisualTimetableHelperService } from './visual-timetable-helper.service';

describe('VisualTimetableHelperService', () => {
  let service: VisualTimetableHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VisualTimetableHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
