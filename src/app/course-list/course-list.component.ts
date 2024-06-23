import { Component, HostListener, OnInit } from '@angular/core';
import { Course, PageableCourses } from '../shared/course-interfaces';
import { CourseListGetterService } from '../shared/course-list-getter.service';
import { SessionInfo, UtilitiesService } from '../shared/utilities.service';
import { ClTimingsSharerService } from '../shared/cl-timings-sharer.service';
import { SelectedCoursesService } from '../selected-courses.service';
import { Subscription } from 'rxjs';
import { ExporterService } from '../shared/exporter.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss'],
})
export class CourseListComponent implements OnInit {
  dropRateSession: string = '20229';

  private functionSubscription: Subscription;

  constructor(
    public crsGetter: CourseListGetterService,
    public constants: UtilitiesService,
    private clTimingsSharer: ClTimingsSharerService,
    private selectedCourseService: SelectedCoursesService,
    private exporterService: ExporterService
  ) {
    this.functionSubscription = this.exporterService
      .getFunctionTriggerObservable()
      .subscribe((session) => {
        // Call the function you want to trigger in the component.
        this.currentSession = this.urlToSession(session);
        this.obtainEverything(false);
      });
  }

  importJsonFunction = (input: string) => {
    this.exporterService.importCoursesFromString(input);
  };

  isSmallScreen: boolean = false;

  @HostListener('window:resize')
  checkScreenSize() {
    this.isSmallScreen =
      window.innerWidth < this.constants.smallScreenThreshold; // Adjust the value as per your definition of a small screen
  }

  parentHideCourseList() {
    this.toggleDisplayCourseList();
  }

  toggleDisplayCourseList(): void {
    this.constants.displayCourseList = !this.constants.displayCourseList;
  }

  // get enableTTB() {
  //   return this.constants.enableTimetableBuilder;
  // }

  // set enableTTB(val: boolean) {

  //   this.constants.enableTimetableBuilder = val;
  // }

  ngOnInit(): void {
    this.obtainEverything();
    this.checkScreenSize();
    if (this.isSmallScreen) {
      // this.constants.enableTimetableBuilder = false;
    }
  }

  lastSessionQuery: string = '';

  get allSessions(): SessionInfo[] {
    return this.constants.allSessions;
  }
  get sessionsList(): string[] {
    return this.allSessions.map((item) => item.sessionName);
  }
  private _currentSession = this.sessionsList[this.sessionsList.length - 1];

  public get currentSession() {
    return this._currentSession;
  }

  public set currentSession(value: string) {
    this._currentSession = value;
  }

  sessionToUrl(ses: string): string {
    const candLink = this.allSessions.find(
      (ss) => ss.sessionName === ses
    )?.sessionUrl;
    if (candLink === undefined) {
      return this.allSessions[0].sessionUrl;
    }
    return candLink;
  }

  urlToSession(urlSes: string): string {
    const candLink = this.allSessions.find(
      (ss) => ss.sessionUrl === urlSes
    )?.sessionName;
    if (candLink === undefined) {
      return this.allSessions[0].sessionName;
    }
    return candLink;
  }

  brDescs: string[] = [
    'No A&S breadths fullfilled',
    'BR=1',
    'BR=2',
    'BR=3',
    'BR=4',
    'BR=5',
  ];

  courseFilter: string = 'CSC'; // this value is binded.
  lastSearchQuery: string = '';

  keyDownFunction(event: { keyCode: number }) {
    if (event.keyCode === 13) {
      this.obtainEverything();
      // rest of your code
    }
  }

  errorMessage = '';

  courseList: Course[] = [];
  condensedCourseList: Course[][] = [];
  recondensedCourseList: Course[][][] = [];

  /**
   * 
   * @param ccl This must be sorted appropirately
   *
   * @returns 
   */
  recondenseCourseList(ccl: Course[][]): Course[][][] {
    const replNum = (n: string) => {
      for (const ltr of [
        ['A', '1'],
        ['B', '2'],
        ['C', '3'],
        ['D', '4'],
      ]) {
        n = n.replace(ltr[0], ltr[1]);
      }
      let index = n.search(/[^0-9]/);
    
      // If no non-numeric character is found, return the length of the string
      index === -1 ? n.length : index;
      const ac =  n.slice(0, index);
      console.log(ac);
      return ac;
    };

    const acc: Course[][][] = [];
    let curCl: Course[][] = [];

    let currentLevel = -99;
    let currentCampus = -99;

    for (const c of ccl) {
      const level = Math.floor(parseInt(replNum(c[0].code.slice(3))) / 100);
      if (isNaN(level)) {
        continue;
      }
      const code = c[0].code;
      let campus = parseInt(code.charAt(code.length - 1));
      if (isNaN(campus)) {
        campus = 1; // graduate course
      }
      // reset list if level or campus changes
      console.log(level, campus);
      if (!(currentLevel === level && currentCampus === campus)) {
        if (curCl.length >= 1) {
          acc.push(curCl);
        }
        curCl = [];
        currentLevel = level;
        currentCampus = campus;
      }
      // add to current list
      curCl.push(c);
    }
    // finalize
    if(curCl.length >= 1){
      acc.push(curCl);
    }
    return acc;
  }

  obtainEverything(clearSections: boolean = true): void {
    let temp: PageableCourses;
    let courseListCandidate: Course[];
    if (
      this.courseFilter === this.lastSearchQuery &&
      this.lastSessionQuery === this.currentSession
    ) {
      return;
    }
    if (
      this.lastSessionQuery !== '' &&
      this.lastSessionQuery !== this.currentSession &&
      clearSections
    ) {
      this.selectedCourseService.clearSections();
      this.clTimingsSharer.setData([]);
    }

    if (!this.courseFilter.match(/^[a-zA-Z]{3}$/)) {
      this.errorMessage = 'First three letters of a course only!';
      return;
    }
    this.dropRateSession = this.sessionToUrl(this.currentSession);
    console.log(this.dropRateSession);
    const tempResp = this.crsGetter.getSpecificTTBResponse(
      this.courseFilter,
      this.sessionToUrl(this.currentSession)
    );

    if (tempResp === null) {
      this.errorMessage = 'Invalid inputs to the course searcher';
      return;
    }
    tempResp.subscribe({
      next: (data) => {
        temp = data;
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 404)
          this.errorMessage =
            'This course desginator does not exist or is not offering any courses this term';
        else if (err.status === 403)
          this.errorMessage =
            "You're not doing anything weird with your browser, aren't you?";
        else if (err.status >= 500)
          this.errorMessage = `Server-side error: ${err.status}`;
        else if (err.status === 0)
          this.errorMessage =
            'You are offline or your connection is really bad';
        else this.errorMessage = `Something went wrong: ${err.status}`;
      },
      complete: () => {
        courseListCandidate = temp.courses;
        this.courseList = courseListCandidate;
        // console.log("Successfully constructed the course list");
        this.condensedCourseList =
          this.crsGetter.condenseCourses(courseListCandidate);
        // console.log(this.condensedCourseList);
        this.errorMessage = '';
        this.lastSearchQuery = this.courseFilter;
        this.lastSessionQuery = this.currentSession;
        this.selectedCourseService.sessionCode = this.sessionToUrl(
          this.currentSession
        );
        this.condensedCourseList.sort((cl1, cl2) => {
          let cr1 = cl1[0];
          let cr2 = cl2[0];
          let code1 = cr1.code;
          let code2 = cr2.code;
          // for both strings above - move the last character to the first
          const th = (st: string) => {
            if(st === "H" || st === "Y") {
              return "2";
            } else if (st === "0"){
              return "3";
            } else if (st === "3"){
              return "4";
            } else {
              return st;
            }
          };

          const rewriteL0 = (cd: string) => {
            return cd.substring(0, 3) + (cd.charAt(3) === "0" ? "9" : cd.charAt(3))  + cd.substring(4);
          }

          code1 =
            th(code1.substring(code1.length - 1)) +
            rewriteL0(code1.substring(0, code1.length - 1));
          code2 =
            th(code2.substring(code2.length - 1)) +
            rewriteL0(code2.substring(0, code2.length - 1));
          const temp1 = code1.localeCompare(code2);
          if (temp1 === 0) {
            return cr1.sectionCode.localeCompare(cr2.sectionCode);
          } else {
            return temp1;
          }
        });
        this.recondensedCourseList = this.recondenseCourseList(this.condensedCourseList);
      },
    });
  }

  ensureList<T>(li: T[] | undefined | null): T[] {
    if (li === undefined || li === null) {
      return [];
    }
    return li;
  }

  utscBrStrs = ['Literature', 'Behavio', 'History', 'Natural', 'Quant'];

  // canShowDescriptions: Set<String> = new Set<String>();

  canShow: Record<string, boolean> = {};

  isNullOrEmpty(text: string): boolean {
    return text === null || text === undefined || text === '';
  }

  checkCanShowDescription(crsCode: string): boolean {
    // console.log(state);
    return this.canShow[crsCode] === true;
  }

  whatLevel(crsCode: string): number {
    let thirdChar = crsCode[3];
    // if thirdChar is a number, then return it.
    if (thirdChar >= '0' && thirdChar <= '9') {
      return parseInt(thirdChar);
    }
    // otherwise, if thirdChar is a letter, then return its number equivalent - A = 1, B = 2, and so on.
    else {
      return thirdChar.charCodeAt(0) - 65 + 1;
    }
  }
}

export function forceNum(st: string | number): number {
  if (typeof st === 'string') {
    return parseInt(st);
  } else {
    return st;
  }
}
