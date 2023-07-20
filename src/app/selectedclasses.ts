import { Course, MeetingTime, Section } from './shared/course-interfaces';

export class SectionSelection {
  // ASSUMPTIONS -- the term never changes.
  // ASSUMPTION 2 - the time unit is always "minutes since start of day"
  sectionSelected: Section; // points to the meeting selected
  allCourses: Course[]; // points to all offerings of the full course
  targetCourse: Course; // points to the course where I selected this from

  constructor(
    sectionSelected: Section,
    allCourses: Course[],
    targetCourse: Course
  ) {
    this.sectionSelected = sectionSelected;
    this.allCourses = allCourses;
    this.targetCourse = targetCourse;
  }

  /**
   *
   * @returns all meetings for this course
   */
  getAllMeetings(): MeetingTime[] {
    return this.sectionSelected.meetingTimes ?? [];
  }

  /**
   *
   * @param other true iff both sections are the same
   */
  equals(other: SectionSelection): boolean {
    // true iff
    const conditions = [
      this.sectionSelected.name === other.sectionSelected.name,
      this.targetCourse.code === other.targetCourse.code,
      this.targetCourse.sectionCode === other.targetCourse.sectionCode,
    ];
    return conditions.every((item) => Boolean(item));
  }

  /**
   * 
   * @param otherDay the other day of the meeting to check
   * @param otherStart the other start time in minutes since midnight to check
   * @param otherEnd the othert  end time in minutes since midnight to check
   * @returns the Meeting that conflicts, or null if there are no conflicts
   */
  conflicts(otherDay: string, otherStart: number, otherEnd: number): MeetingTime | null {
    const other = {
      dayOfWeek: otherDay,
      startTimeMins: otherStart,
      endTimeMins: otherEnd,
    };

    for (let met1 of this.sectionSelected.meetingTimes ?? []) {
      const met = {
        dayOfWeek: met1.start.day,
        startTimeMins: msToM(met1.start.millisofday),
        endTimeMins: msToM(met1.end.millisofday)
      };
      
      if (met.dayOfWeek !== other.dayOfWeek) {
        continue;
      }
      // // console.log("Testing if these conf with", otherDay, otherStart, otherEnd);

      const c1 =
        met.startTimeMins <= other.startTimeMins &&
        other.startTimeMins < met.endTimeMins;
      const c2 =
        other.startTimeMins <= met.startTimeMins &&
        met.startTimeMins < other.endTimeMins;
        // console.log(met.startTimeMins, other.startTimeMins, met.endTimeMins, other.endTimeMins);
        // console.log(c1, c2);
        if (c1 || c2) {
        return met1;
      }
    }
    return null;
  }
}


export function msToM(ms: number | string): number {
  if(typeof ms === 'string'){
    ms = parseInt(ms);
  }
  return Math.round(ms / 60000);
}