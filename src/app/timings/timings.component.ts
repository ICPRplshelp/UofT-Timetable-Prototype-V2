
import { Component, Input, OnInit } from '@angular/core';
import {
  Course,
  CourseNote,
  EnrolmentControl,
  IndividualControl,
  Instructor,
  MeetingTime,
  Section,
} from '../shared/course-interfaces';
import { UtilitiesService } from '../shared/utilities.service';
import { ClTimingsSharerService } from '../shared/cl-timings-sharer.service';
import {
  ConflictInfo,
  SelectedCoursesService,
} from '../selected-courses.service';
import { SectionSelection, msToM } from '../selectedclasses';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { forceNum } from '../course-list/course-list.component';

/**
 * Inputs:
 * storedCourses: Course[]; // all F/S/Y offerings of that course
 * smallScreen: boolean;  // whether the screen is small, to compress things.
 */
@Component({
  selector: 'app-timings',
  templateUrl: './timings.component.html',
  styleUrls: ['./timings.component.scss'],

})
export class TimingsComponent implements OnInit {
  // , "ins", "time", "delivery"

  @Input() storedCourses: Course[] = [];
  @Input() smallScreen: boolean = false;
  @Input() forceVerbose: boolean = false;
  @Input() hideCourseCode: boolean = false;

  noCourses(): boolean {
    return this.storedCourses.length === 0;
  }


  smallScreenVal: string = '';

  constructor(
    public util: UtilitiesService,
    private clTimingsSharer: ClTimingsSharerService,
  ) {
    // console.log("Small screen?", data.smallScreen);
  }


  ngOnInit(): void {
    if (!this.smallScreen) {
      this.smallScreenVal = 'padding: 42px';
    } else if (!this.forceVerbose) {

    }
    this.clTimingsSharer.getData().subscribe({
      next: (data) => {
        this.storedCourses = data;
      },
      error: (err) => {},
      complete: () => {
        console.log("I've gotten the courses.");
      },
    });
  }

  get curCourseCode(): string {
    if (this.storedCourses.length === 0) {
      return '';
    } else {
      return this.storedCourses[0].code;
    }
  }
}
