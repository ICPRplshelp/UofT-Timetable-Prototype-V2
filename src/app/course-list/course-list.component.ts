import {Component, EventEmitter, HostListener, OnInit, Output} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {Breadth, Course, PageableCourses, Section,} from '../shared/course-interfaces';
import {CourseListGetterService} from '../shared/course-list-getter.service';
import {SessionInfo, UtilitiesService} from '../shared/utilities.service';
import {DialogHolderComponent} from "../dialog-holder/dialog-holder.component";
import {ClTimingsSharerService} from "../shared/cl-timings-sharer.service";
import { SelectedCoursesService } from '../selected-courses.service';
import { Subscription } from 'rxjs';
import { ExporterService } from '../shared/exporter.service';








@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss'],
})
export class CourseListComponent implements OnInit {


  private functionSubscription: Subscription;

  constructor(
    public crsGetter: CourseListGetterService,
    public constants: UtilitiesService,
    public dialog: MatDialog,
    private clTimingsSharer: ClTimingsSharerService,
    private selectedCourseService: SelectedCoursesService,
    private exporterService: ExporterService
  ) {
    this.functionSubscription = this.exporterService.getFunctionTriggerObservable().subscribe((session) => {
      // Call the function you want to trigger in the component.
      this.currentSession = this.urlToSession(session);
      this.obtainEverything(false);
    });
  }

  importJsonFunction = (input: string) => {this.exporterService.importCoursesFromString(input)};

  isSmallScreen: boolean = false;

  @HostListener('window:resize')
  checkScreenSize() {
    this.isSmallScreen = window.innerWidth < 768; // Adjust the value as per your definition of a small screen
  }

  get enableTTB() {
    return this.constants.enableTimetableBuilder;
  }

  set enableTTB(val: boolean) {
    

    this.constants.enableTimetableBuilder = val;
  }

  ngOnInit(): void {
    this.obtainEverything();
    this.checkScreenSize();
    if(this.isSmallScreen){
      this.constants.enableTimetableBuilder = false;
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
    const candLink = this.allSessions.find((ss) => ss.sessionName === ses)?.sessionUrl;
    if(candLink === undefined){
      return this.allSessions[0].sessionUrl;
    }
    return candLink;
  }

  urlToSession(urlSes: string): string {
    const candLink = this.allSessions.find((ss) => ss.sessionUrl === urlSes)?.sessionName;
    if(candLink === undefined){
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

  obtainEverything(clearSections: boolean = true): void {
    let temp: PageableCourses;
    let courseListCandidate: Course[];
    if (
      this.courseFilter === this.lastSearchQuery &&
      this.lastSessionQuery === this.currentSession
    ) {
      return;
    }
    if(this.lastSessionQuery !== "" && this.lastSessionQuery !== this.currentSession && clearSections){
      this.selectedCourseService.clearSections();
      this.clTimingsSharer.setData([]);
    }

    if(!this.courseFilter.match(/^[a-zA-Z]{3}$/)){
      this.errorMessage = 'First three letters of a course only!';
      return;
    }
    const tempResp = this.crsGetter
      .getSpecificTTBResponse(
        this.courseFilter,
        this.sessionToUrl(this.currentSession)
      );
      
      if(tempResp === null){
        this.errorMessage = "Invalid inputs to the course searcher";
        return;
      }
      tempResp.subscribe({
        next: (data) => {
          temp = data;
        },
        error: (err) => {
          // console.log(err);
          this.errorMessage = 'This course desginator does not exist or is not offering any courses this term';
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
          this.selectedCourseService.sessionCode = this.sessionToUrl(this.currentSession);
          this.condensedCourseList.sort((cl1, cl2) => {
            let cr1 = cl1[0];
            let cr2 = cl2[0];
            let code1 = cr1.code;
            let code2 = cr2.code;
            // for both strings above - move the last character to the first
            const th = (st: string) => (st === 'H' || st === 'Y') ? 2 : st;
            code1 =
            th(code1.substring(code1.length - 1)) +
              code1.substring(0, code1.length - 1);
            code2 =
            th(code2.substring(code2.length - 1)) +
              code2.substring(0, code2.length - 1);
            const temp1 = code1.localeCompare(code2);
            if(temp1 === 0){
              return cr1.sectionCode.localeCompare(cr2.sectionCode);
            } else{
              return temp1;
            }
          });
        },
      });
  }

  /**
   *
   * @param term F, S, or Y
   * @param coursePack a list of courses
   * @returns whether a course in this list is offered in term.
   */
  isThisCourseOfferedInThisTerm(term: string, coursePack: Course[]): boolean {
    for (let crs of coursePack) {
      if (crs.sectionCode.toUpperCase() === term) {
        return true;
      }
    }
    return false;
  }

  strMultiply(stringInput: string, count: number, sep: string): string {
    const countInt = Math.round(count);
    let finalString = '';
    for (let i = 0; i < count; i++) {
      finalString += stringInput;
      if (i < count - 1) {
        finalString += sep;
      }
    }
    return finalString;
  }


  ensureList<T>(li: T[] | undefined | null): T[] {
    if (li === undefined || li === null) {
      return [];
    }
    return li;
  }


  /**
   * Do not double count: if a start-end time appears
   * the same for the same timing object thing,
   * don't count it.
   *
   * @param coursePack All offerings of the same course
   * @returns The number of hours I have to commit to the course
   */
  calculateHourCommitment(coursePack: Course[]): number {
    type TimeCellInfo = {
      day: string;
      startTime: string;
      endTime: string;
    };
    const compareTimeCells = (
      timeCell1: TimeCellInfo,
      timeCell2: TimeCellInfo
    ) => {
      return (
        timeCell1.day === timeCell2.day &&
        timeCell1.startTime === timeCell2.startTime &&
        timeCell1.endTime === timeCell2.endTime
      );
    };
    let totMax = 0;
    for (let crs of coursePack) {


      const lecList: number[] = [];
      const tutList: number[] = [];
      const praList: number[] = [];
      if (crs.sections === undefined || crs.sections === null) continue;
      for (let ses of crs.sections) {
        // one section - i.e. LEC0101
        if (ses.meetingTimes === undefined || ses.meetingTimes === null)
          continue;
        const seenTimes: TimeCellInfo[] = [];
        let maxAcc = 0;
        for (let met of ses.meetingTimes) {
          let startTime = met?.start?.millisofday;
          if (startTime === null || startTime === undefined) continue;
          let endTime = met?.end?.millisofday;
          if (endTime === null || endTime === undefined) continue;
          let day = met?.start?.day;
          if (day === null || day === undefined) continue;
          const startEndDayTemp = {startTime, endTime, day};
          if (seenTimes.some((x) => compareTimeCells(x, startEndDayTemp))) {
            continue;
          } else {
            seenTimes.push(startEndDayTemp);
            maxAcc += (parseInt(endTime) - parseInt(startTime)) / 3600000;
          }


        }
        if (ses?.teachMethod === undefined || ses?.teachMethod === null) {
          continue;
        }
        switch (ses?.teachMethod.trim().toUpperCase()) {
          case 'LEC':
            lecList.push(maxAcc);
            break;
          case 'TUT':
            tutList.push(maxAcc);
            break;
          case 'PRA':
            praList.push(maxAcc);
            break;
        }
      }
      // console.log(lecList, tutList, praList, crs.code);
      totMax = this.calculateMode(lecList) + this.calculateMode(tutList) + this.calculateMode(praList);
    }
    // console.log(coursePack[0].code, lecMax, tutMax, praMax);
    return totMax;
  }

  utscBrStrs = ['Literature', 'Behavio', 'History', 'Natural', 'Quant'];

  canShowDescriptions: Set<String> = new Set<String>();

  canShow: any = {};

  calculateMode(numbers: number[]): number {
    const frequencyMap: Map<number, number> = new Map();

    // Count the frequency of each number
    for (const number of numbers) {
      if (frequencyMap.has(number)) {
        frequencyMap.set(number, frequencyMap.get(number)! + 1);
      } else {
        frequencyMap.set(number, 1);
      }
    }

    let mode: number | undefined;
    let maxFrequency = 0;

    // Find the number with the highest frequency
    for (const [number, frequency] of frequencyMap.entries()) {
      if (frequency > maxFrequency) {
        mode = number;
        maxFrequency = frequency;
      }
    }
    if (mode !== undefined)
      return mode;
    else return 0;
  }


  addToCanShowDescriptions(crsCode: string): void {
    this.canShow[crsCode] = this.canShow[crsCode] !== true;

    // console.log(this.canShow);
  }

  isNullOrEmpty(text: string): boolean {
    return text === null || text === undefined || text === '';
  }

  checkCanShowDescription(crsCode: string): boolean {
    // console.log(state);
    return this.canShow[crsCode] === true;
  }

  getDesc(crs: Course) {
    const crsInfo = crs.cmCourseInfo;
    if (crsInfo === null || crsInfo === undefined) {
      return '';
    }

    const desc = crsInfo.description;
    if (desc === null || desc === undefined) {
      return 'A description was not provided for this course.';
    }
    return this.stripWrappingPs(desc);
  }

  emptyIfUndef(citem: string | undefined | null): string {
    if (citem === undefined || citem === null) {
      return '';
    } else {
      return citem;
    }
  }

  getPrq(crs: Course) {
    return this.emptyIfUndef(crs.cmCourseInfo?.prerequisitesText);
  }

  getRec(crs: Course) {
    return this.emptyIfUndef(crs.cmCourseInfo?.recommendedPreparation);
  }

  getCrq(crs: Course) {
    return this.emptyIfUndef(crs.cmCourseInfo?.corequisitesText);
  }

  getExc(crs: Course) {
    return this.emptyIfUndef(crs.cmCourseInfo?.exclusionsText);
  }

  whatBreadths2(brStuffTemp?: Breadth[]): number[] {
    if (brStuffTemp === null || brStuffTemp === undefined) {
      return [0];
    }
    let breadthsSoFar: number[] = [];
    for (let br of brStuffTemp) {
      if (br.breadthTypes === null || br.breadthTypes === undefined) {
        continue;
      }
      br.breadthTypes.forEach((bt) => {
        if (bt === null || bt === undefined) {
          return;
        }
        if (bt.code === null || bt.code === undefined) {
          return;
        }
        for (let num of [1, 2, 3, 4, 5]) {
          if (
            bt.code.includes(num.toString()) &&
            !breadthsSoFar.includes(num)
          ) {
            breadthsSoFar.push(num);
          }
        }
      });
    }
    if (breadthsSoFar.length === 0) return [0];
    return breadthsSoFar;
  }


  selectCourse(coursePack: Course[]): void {
    this.clTimingsSharer.setData(coursePack);
    if (!this.constants.enableTimetableBuilder) {
      this.openCourseDialogPage(coursePack);
    } else {


    }
  }


  private openCourseDialogPage(coursePack: Course[]) {
    if (coursePack.length === 0) {
      // console.log("No meetings!!!");
      return;
    }

    const dialogConfig = new MatDialogConfig();

    if (this.isSmallScreen) {
      dialogConfig.maxWidth = '100vw';
      dialogConfig.maxHeight = '100vh';
      dialogConfig.height = '100%';
      dialogConfig.width = '100%';
      dialogConfig.panelClass = 'full-screen-modal';
    }
    // const dialogWidth = 600 * Math.max(coursePack.length, 1);
    // dialogConfig.width = '100%'; // Set the dialog width to 100% of the screen
    // dialogConfig.height = '100%'; // Set the dialog height to 100% of the screen
    // dialogConfig.panelClass = 'full-screen-dialog'; // Apply a custom CSS class to the dialog

    dialogConfig.data = {
      courses: coursePack,
      smallScreen: this.isSmallScreen,
    };
    // dialogConfig.panelClass = 'custom-dialog-container';
    const dialogRef = this.dialog.open(DialogHolderComponent, dialogConfig);
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

  onlineModes = [
    'SYNC',
    'SYNIF',
    'SYNCIF',
    'OLNSYNC',
    'ASYNC',
    'ASYIF',
    'ASYNIF',
    'HYBR',
  ];

  oneHasOnline(crses: Course[]): boolean {
    for (let crs of crses) {
      if (this.hasOnline(crs)) {
        return true;
      }
    }
    return false;
  }

  hasOnline(crs: Course) {
    let secs = crs.sections;
    if (secs === null || secs === undefined) {
      secs = [];
    }
    for (let sec of secs) {
      let deliv = this.getDeliveryMode(sec);
      if (sec.name.startsWith('LEC') && this.onlineModes.includes(deliv)) {
        return true;
      }
    }
    return false;
  }

  getDeliveryMode(sec: Section): string {
    if (sec === null || sec === undefined) {
      return 'INPER';
    }
    if (sec.deliveryModes === null || sec.deliveryModes === undefined) {
      return 'INPER';
    }
    if (sec.deliveryModes[0] === null || sec.deliveryModes[0] === undefined) {
      return 'INPER';
    }
    if (
      sec.deliveryModes[0].mode === null ||
      sec.deliveryModes[0].mode === undefined
    ) {
      return 'INPER';
    }
    return sec.deliveryModes[0].mode;
  }

  addSpacesBetweenSlashes(text: string): string {
    // text = text.replace(/([^\s></])\/([^\s></])/g, "$1 / $2");
    // return text;
    const regex = /\/(?!([^<]+)?>)/g;

    // Replace slashes with slashes followed by a space
    const result = text.replace(regex, '/ ');

    return result;
  }

  /**
   * If text starts with <p> and ends with </p> then
   * remove that.
   * @param text HTML text.
   */
  stripWrappingPs(text: string): string {
    text = text.trim();

    while (text.endsWith('<br />')) {
      text = text.slice(0, text.length - 6);
      text = text.trim();
    }
    while (text.startsWith('<p>') && text.endsWith('</p>')) {
      text = text.slice(3, text.length - 4);
      text = text.trim();
    }

    return text;
  }
}
