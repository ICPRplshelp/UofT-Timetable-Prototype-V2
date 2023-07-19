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
        return true;
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
        return true;
    }

    displayedCourses: CourseDisplay[];

    constructor(cd: CourseDisplay[]) {
        console.log("Detected conflict");
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
            const val = displayedCourse.startTimeMins;
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

  constructor(mt: MeetingTime, ss: SectionSelection) {
    this.courseCode = ss.targetCourse.code;
    this.sectionCode = ss.sectionSelected.name;
    this.fys = ss.targetCourse.sectionCode;
    this.dayOfWeek = parseInt(mt.start.day);
    // TODO: ensure program doesn't crash if millisofday isn't a number
    this.startTimeMins = millisToMinutes(mt.start.millisofday);
    this.endTimeMins = millisToMinutes(mt.end.millisofday);
    this.buildingCode = mt.building.buildingCode;
    this.buildingNumber = mt.building.buildingRoomNumber;
    this.deliveryMode = ss.sectionSelected.deliveryModes[0]?.mode ?? 'INPER';
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
      ? parseInt(milliseconds, 10)
      : milliseconds;
  return Math.round(millisecondsAsNumber / millisecondsPerMinute);
}


/**
 * AI generated code. If this breaks, blame this one.
 */
export class ConflictGrouper {
  courseDisplays: CourseDisplay[];

  constructor(courseDisplays: CourseDisplay[]) {
    this.courseDisplays = courseDisplays;
  }

  private findConflicts(courseDisplay: CourseDisplay): CourseDisplay[] {
    return this.courseDisplays.filter((otherCourseDisplay) =>
      courseDisplay.conflicts(otherCourseDisplay)
    );
  }

  private groupConflicts(): PotentialConflicts {
    const potentialConflicts: PotentialConflicts = {
      conflictGroups: [],
      notConflicting: [],
    };
  
    const visited = new Set<CourseDisplay>();
    for (const courseDisplay of this.courseDisplays) {
      if (visited.has(courseDisplay)) continue;
  
      const queue: CourseDisplay[] = [courseDisplay];
      const conflictGroup: CourseDisplay[] = [];
  
      while (queue.length > 0) {
        const currentCourse = queue.pop()!;
        if (visited.has(currentCourse)) continue;
  
        visited.add(currentCourse);
        conflictGroup.push(currentCourse);
  
        const conflicts = this.findConflicts(currentCourse);
        for (const conflictCourse of conflicts) {
          if (!visited.has(conflictCourse)) {
            queue.push(conflictCourse);
          }
        }
      }
  
      if (conflictGroup.length > 1) {
        // Sort the conflictGroup by startTimeMins
        conflictGroup.sort((a, b) => a.startTimeMins - b.startTimeMins);
        potentialConflicts.conflictGroups.push(conflictGroup);
      } else {
        // Check if the course is non-conflicting
        const nonConflictingCourse = conflictGroup[0];
        potentialConflicts.notConflicting.push(nonConflictingCourse);
      }
    }
  
    return potentialConflicts;
  }

  groupConflictingInSameDay(): PotentialConflicts {
    console.log("Attempting to group conflicts");
    return this.groupConflicts();
  }
}

// Usage:
// const grouper = new ConflictGrouper(courseDisplays);
// const potentialConflicts = grouper.groupConflictingInSameDay();
