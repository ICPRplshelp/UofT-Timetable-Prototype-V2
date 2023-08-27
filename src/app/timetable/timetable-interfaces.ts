import { forceNum } from '../course-list/course-list.component';
import { SectionSelection } from '../selectedclasses';
import { Course, MeetingTime } from '../shared/course-interfaces';

export interface TableCell {
  /**
   * Return true iff this cell is present but blank.
   */
  isEmpty(): boolean;

  /**
   * Returns true iff this cell would be overridden by a taller cell.
   */
  isOccupied(): boolean;

}

export class EmptyTableCell implements TableCell {
    isEmpty(): boolean {
        return true;
    }
    isOccupied(): boolean {
        return false;
    }

}

export class OccupiedTableCell implements TableCell {
    isEmpty(): boolean {
        return false;
    }
    isOccupied(): boolean {
        return true;
    }
}

export class CourseTableCell implements TableCell {
    isEmpty(): boolean {
        return false;
    }
    isOccupied(): boolean {
        return false;
    }

    displayedCourse: CourseDisplay;

    constructor(cd: CourseDisplay) {
        this.displayedCourse = cd;
    }
}

export class ConflictingCourseTableCell implements TableCell {
    isEmpty(): boolean {
        return false;
    }
    isOccupied(): boolean {
        return false;
    }

    displayedCourses: CourseDisplay[];

    constructor(cd: CourseDisplay[]) {
        // console.log("Detected conflict");
        this.displayedCourses = cd;
    }

    /**
     * 
     * @returns The earliest class start time in this conflict group.
     */
    getEarliest(): number {
        let lowest = -1;
        for(let displayedCourse of this.displayedCourses){
            const val = displayedCourse.startTimeMins;
            if(lowest === -1 || val < lowest) {
                lowest = val;
            }
        }
        if(lowest === -1){
            console.log("There is a conflict group with 0 courses");
        }
        return lowest;
    }

    /**
     * 
     * @returns The latest class start time in this conflict group.
     */
    getLatest(): number {
        let highest = 0;
        for(let displayedCourse of this.displayedCourses){
            const val = displayedCourse.endTimeMins;
            if(val > highest) {
                highest = val;
            }
        }
        return highest;
    }

}

export class CourseDisplay {
  courseCode: string; // CSC110Y1
  sectionCode: string; // LEC0101
  fys: string; // [FYS]
  dayOfWeek: number; // 0 for sun, and onwards
  startTimeMins: number; // MINUTES since 12AM
  endTimeMins: number;
  buildingCode: string;
  buildingNumber: string;
  deliveryMode: string;
  sessionCode: string;
  ss: SectionSelection;
  
  hideDuringFall(): boolean {
    if(this.sessionCode.endsWith("1")){
      return true;
    }
    return false;
  }

  hideDuringWinter(): boolean {
    if(this.sessionCode.endsWith("9")){
      return true;
    }
    return false;
  }

  getCourseCodeNoSuffix(): string {
    if(this.courseCode.match(/[A-Z]{3}[A-D\d]\d{2}[HY]/)){
      return this.courseCode.slice(0, 6);
    } else {
      return this.courseCode.slice(0, 7);
    }
  }

  constructor(mt: MeetingTime, ss: SectionSelection) {
    this.courseCode = ss.targetCourse.code;
    this.sectionCode = ss.sectionSelected.name;
    this.fys = ss.targetCourse.sectionCode;
    this.dayOfWeek = forceNum(mt.start.day);
    // TODO: ensure program doesn't crash if millisofday isn't a number
    this.startTimeMins = millisToMinutes(mt.start.millisofday);
    this.endTimeMins = millisToMinutes(mt.end.millisofday);
    this.buildingCode = mt.building.buildingCode ?? "";
    this.buildingNumber = mt.building.buildingRoomNumber ?? "";
    this.deliveryMode = (ss.sectionSelected.deliveryModes ?? [])[0]?.mode ?? 'INPER';
    this.sessionCode = mt.sessionCode;
    this.ss = ss;
  }

  conflicts(other: CourseDisplay): boolean {
    if (this.dayOfWeek !== other.dayOfWeek) {
      return false;
    }
    const c1 =
      this.startTimeMins <= other.startTimeMins &&
      other.startTimeMins < this.startTimeMins;
    const c2 =
      other.startTimeMins <= this.startTimeMins &&
      this.startTimeMins < other.startTimeMins;
    return c1 && c2;
  }
}

export type PotentialConflicts = {
  conflictGroups: CourseDisplay[][];
  notConflicting: CourseDisplay[];
};

function millisToMinutes(milliseconds: number | string): number {
  const millisecondsPerMinute = 60000; // 1 minute = 60,000 milliseconds
  const millisecondsAsNumber =
    typeof milliseconds === 'string'
      ? forceNum(milliseconds)
      : milliseconds;
  return Math.round(millisecondsAsNumber / millisecondsPerMinute);
}


/**
 * AI generated code. If this breaks, blame this one.
 */
export class ConflictGrouper {
  // courseDisplays: CourseDisplay[];

  /**
   * 
   * @param courseDisplays a list of course displays for that day. This mutuates the array's order, beware!
   * @returns 
   */
  groupConflictingInSameDay(courseDisplays: CourseDisplay[]): PotentialConflicts {
    // console.log("Attempting to group conflicts");
    const conflictGroups: CourseDisplay[][] = [];
    const notConflicting: CourseDisplay[] = [];
    courseDisplays.sort((item1, item2) => {
      return item1.startTimeMins - item2.startTimeMins;
    });
    // courseDisplays is now sorted by ascending start times
    // let conflictState: boolean = false;
    let courseDisplayBucket: CourseDisplay[] = [];
    let earliestStartTime = -5;
    let latestEndTime = -4;
    for(let cd of courseDisplays){
      // assert cd.startTimeMins >= earliestStartTime
      if(cd.startTimeMins >= latestEndTime){
        // no conflict
        // move things from bucket to correct list
        if(courseDisplayBucket.length >= 2){
          conflictGroups.push(courseDisplayBucket);
        } else if (courseDisplayBucket.length === 1){
          notConflicting.push(courseDisplayBucket[0]);
        }
        // reset the course display bucket
        earliestStartTime = cd.startTimeMins;
        latestEndTime = cd.endTimeMins;
        courseDisplayBucket = [cd];
        // conflictState = false;
      } else {
        // conflict
        // assert courseDisplayBucket.length >= 1
        latestEndTime = Math.max(latestEndTime, cd.endTimeMins);
        courseDisplayBucket.push(cd);
        // conflictState = true;
      }
    }
    // cleanup on the end of the loop
    if(courseDisplayBucket.length === 1){
      notConflicting.push(courseDisplayBucket[0]);
    } else if (courseDisplayBucket.length >= 2){
      conflictGroups.push(courseDisplayBucket);
    }
    return {conflictGroups: conflictGroups, notConflicting: notConflicting};
  }
}

// Usage:
// const grouper = new ConflictGrouper();
// const potentialConflicts = grouper.groupConflictingInSameDay(courseDisplays);
