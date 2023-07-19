import {Course, MeetingTime, Section} from "./shared/course-interfaces";

export class SectionSelection {
    // ASSUMPTIONS -- the term never changes.
    // ASSUMPTION 2 - the time unit is always "minutes since start of day"
    sectionSelected: Section;  // points to the meeting selected
    allCourses: Course[];  // points to all offerings of the full course
    targetCourse: Course;  // points to the course where I selected this from

    constructor(sectionSelected: Section, allCourses: Course[],
      targetCourse: Course) {
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
        this.targetCourse.sectionCode === other.targetCourse.sectionCode
      ];
      return conditions.every(item => Boolean(item));
    }
}





