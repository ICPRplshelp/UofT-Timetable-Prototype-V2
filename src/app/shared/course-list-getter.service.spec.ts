import { TestBed } from '@angular/core/testing';

import { CourseListGetterService } from './course-list-getter.service';

describe('CourseListGetterService', () => {
  let service: CourseListGetterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourseListGetterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
