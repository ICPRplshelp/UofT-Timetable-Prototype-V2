import { Component, Input, OnInit } from '@angular/core';
import { CourseDisplay, CourseTableCell } from '../timetable-interfaces';
import { ClTimingsSharerService } from 'src/app/shared/cl-timings-sharer.service';
import { SelectedCoursesService } from 'src/app/selected-courses.service';
import { UtilitiesService } from 'src/app/shared/utilities.service';

@Component({
  selector: 'app-timetable-cell',
  templateUrl: './timetable-cell.component.html',
  styleUrls: ['./timetable-cell.component.scss'],
})
export class TimetableCellComponent implements OnInit {
  @Input() displayedCell!: CourseDisplay;
  @Input() smallScreen: boolean = false;
  // get displayedCell() {
  //   return this.courseTableCell.displayedCourse;
  // }

  constructor(
    private clTimingsSharer: ClTimingsSharerService,
    private selectedCoursesService: SelectedCoursesService,
    private utils: UtilitiesService
  ) {}

  getColor(cd: CourseDisplay): string {
    const targetIndex =
      this.selectedCoursesService.allCoursesMap.get(cd.courseCode) ?? 0;
    return this.utils.timetableCellColors[
      targetIndex % this.utils.timetableCellColors.length
    ];
  }

  onClickCourse(cd: CourseDisplay): void {
    if (!this.smallScreen) {
      this.clTimingsSharer.setData(cd.ss.allCourses);
    }
  }

  isOnline(cd: CourseDisplay): boolean {
    // console.log(cd.buildingCode);
    return (
      !cd.deliveryMode.includes('INPER') &&
      (cd.buildingCode === null || cd.buildingCode === '')
    );
  }

  ngOnInit(): void {}

  minutesToTimestamp(minutesFromMidnight: number): string {
    if (minutesFromMidnight < 0 || minutesFromMidnight >= 1440) {
      throw new Error(
        'Invalid input: minutesFromMidnight should be between 0 and 1439'
      );
    }

    const hours = Math.floor(minutesFromMidnight / 60);
    const minutes = minutesFromMidnight % 60;

    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    if (minutes !== 0) return `${formattedHours}:${formattedMinutes}`;
    else return `${formattedHours}`;
  }
}
