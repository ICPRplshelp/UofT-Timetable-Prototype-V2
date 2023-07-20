import { Injectable } from '@angular/core';
import { SectionSelection } from './selectedclasses';
import { Subject } from 'rxjs';
import { MeetingTime } from './shared/course-interfaces';

export type ConflictInfo = {
  sectionSelection: SectionSelection;
  conflictingMeeting: MeetingTime;
};

@Injectable({
  providedIn: 'root',
})
export class SelectedCoursesService {
  addedSections: SectionSelection[] = [];

  courseFMap: Map<string, string[]> = new Map<string, string[]>();
  courseSMap: Map<string, string[]> = new Map<string, string[]>();
  courseYMap: Map<string, string[]> = new Map<string, string[]>();

  allCourses: string[] = [];
  allCoursesMap: Map<string, number> = new Map<string, number>();

  /**
   * Resets all added sections.
   */
  clearSections(): void {
    this.addedSections = [];
    this._requestUpdateTimetable();
  }

  /**
   * Adds a section. Returns true if successful.
   */
  addSection(sectionSelection: SectionSelection): boolean {
    if (this.addedSections.every((item) => !item.equals(sectionSelection))) {
      // branch if sectionSelection isn't added already
      this.addedSections.push(sectionSelection);
      this._requestUpdateTimetable();
      return true;
    } else {
      console.log('Section already added!');
      return false; // section was already added!
    }
  }

  /**
   * Removes a section. Returns true if a section was successfully removed.
   */
  removeSection(sectionSelection: SectionSelection): boolean {
    const idx = this.addedSections.findIndex((item) =>
      item.equals(sectionSelection)
    );
    if (idx === -1) {
      return false;
    } else {
      this.addedSections.splice(idx, 1);
      this._requestUpdateTimetable();
      return true;
    }
  }

  private methodCallSource = new Subject<void>();
  methodCalled$ = this.methodCallSource.asObservable();

  checkEnrolled(sectionSelection: SectionSelection): boolean {
    const idx = this.addedSections.findIndex((item) =>
      item.equals(sectionSelection)
    );
    return idx !== -1;
  }

  _requestUpdateTimetable(): void {
    this._reloadEnrolledList();
    this.methodCallSource.next();
  }

  _reloadEnrolledList(): void {
    this.courseFMap.clear();
    this.courseSMap.clear();
    this.courseYMap.clear();
    const allCourseAcc = new Set<string>();
    this.allCourses = [];
    this.addedSections.forEach((sec) => {
      allCourseAcc.add(sec.targetCourse.code);
      // courseSet.add(sec.targetCourse.code);
      let targetCourseMap: Map<string, string[]>;
      switch (sec.targetCourse.sectionCode) {
        case 'F':
          targetCourseMap = this.courseFMap;
          break;
        case 'S':
          targetCourseMap = this.courseSMap;
          break;
        default:
          targetCourseMap = this.courseYMap;
          break;
      }

      if (!targetCourseMap.has(sec.targetCourse.code)) {
        targetCourseMap.set(sec.targetCourse.code, []);
      }
      targetCourseMap
        .get(sec.targetCourse.code)
        ?.push(sec.sectionSelected.name);
    });
    this.allCourses = Array.from(allCourseAcc);
    this.allCourses.sort();
    convertArrayToMap(this.allCourses, this.allCoursesMap);
  }

  readonly yearCourseLetter = 'Y';

  conflictsWithExisting(
    fys: string,
    dayOfWeek: string,
    startTimeMins: number,
    endTimeMins: number,
    sesSel: SectionSelection
  ): ConflictInfo | null {
    for (let sec of this.addedSections) {
      if(sec.equals(sesSel)){
        continue;
      }
      if (
        sec.targetCourse.sectionCode === fys ||
        sec.targetCourse.sectionCode === this.yearCourseLetter
      ) {
        // console.log("Testing if these conf with", dayOfWeek, startTimeMins, endTimeMins);
        let confState = sec.conflicts(dayOfWeek, startTimeMins, endTimeMins);
        if (confState !== null) {
          return {
            sectionSelection: sec,
            conflictingMeeting: confState,
          };
        }
      }
    }
    return null;
  }

  constructor() {}
}

function convertArrayToMap<T>(arr: T[], map: Map<T, number>): void {
  map.clear();
  arr.forEach((element, index) => {
    map.set(element, index);
  });
}
