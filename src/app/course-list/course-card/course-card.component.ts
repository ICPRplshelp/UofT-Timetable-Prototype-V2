import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogHolderComponent } from 'src/app/dialog-holder/dialog-holder.component';
import {
  DropInfo,
  DropRateViewerService,
} from 'src/app/drop-rate-viewer.service';
import { SelectedCoursesService } from 'src/app/selected-courses.service';
import { ClTimingsSharerService } from 'src/app/shared/cl-timings-sharer.service';
import { Breadth, Course, Section } from 'src/app/shared/course-interfaces';
import { CourseListGetterService } from 'src/app/shared/course-list-getter.service';
import { UtilitiesService } from 'src/app/shared/utilities.service';

@Component({
  selector: 'app-course-card',
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.scss'],
})
export class CourseCardComponent implements OnInit {
  constructor(
    public constants: UtilitiesService,
    public dialog: MatDialog,
    private clTimingsSharer: ClTimingsSharerService,
    private dropRateViewerService: DropRateViewerService
  ) {}

  ngOnInit(): void {}

  // set of things I can show
  @Input() canShow: Record<string, boolean> = {};
  @Input() coursePack: Course[] = [];
  @Input() dropRateSession: string = '20229';
  @Input() isSmallScreen: boolean = false;

  getDropInfo(courseCode: string): DropInfo {
    return this.dropRateViewerService.getDropInfo(
      this.dropRateSession,
      courseCode
    );
  }

  getDrops(courseCode: string): number {
    const temp = this.dropRateViewerService.getDropInfo(
      this.dropRateSession,
      courseCode
    );
    return temp.d / temp.o;
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

  addToCanShowDescriptions(crsCode: string): void {
    this.canShow[crsCode] = this.canShow[crsCode] !== true;

    // console.log(this.canShow);
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

  onlineModes = [
    'SYNC',
    'SYNIF',
    'SYNCIF',
    'OLNSYNC',
    'ASYNC',
    'ASYIF',
    'ASYNIF',
    'HYBR',
    'ONLSYNC',
  ];

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
      day: number;
      startTime: number;
      endTime: number;
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
          const startEndDayTemp = {
            startTime: forceNum(startTime),
            endTime: forceNum(endTime),
            day: forceNum(day),
          };
          if (seenTimes.some((x) => compareTimeCells(x, startEndDayTemp))) {
            continue;
          } else {
            seenTimes.push(startEndDayTemp);
            maxAcc += (forceNum(endTime) - forceNum(startTime)) / 3600000;
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
      totMax =
        this.calculateMode(lecList) +
        this.calculateMode(tutList) +
        this.calculateMode(praList);
    }
    // console.log(coursePack[0].code, lecMax, tutMax, praMax);
    return totMax;
  }

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
    if (mode !== undefined) return mode;
    else return 0;
  }

  selectCourse(coursePack: Course[]): void {
    this.clTimingsSharer.setData(coursePack);
    if (
      this.constants.courseListOnly ||
      !this.constants.enableTimetableBuilder ||
      this.isSmallScreen
    ) {
      this.openCourseDialogPage(coursePack);
    } else {
    }
  }

  isNullOrEmpty(text: string): boolean {
    return text === null || text === undefined || text === '';
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

  addSpacesBetweenSlashes(text: string): string {
    // text = text.replace(/([^\s></])\/([^\s></])/g, "$1 / $2");
    // return text;
    const regex = /\/(?!([^<]+)?>)/g;

    // Replace slashes with slashes followed by a space
    const result = text.replace(regex, '/ ');

    return result;
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

  emptyIfUndef(citem: string | undefined | null): string {
    if (citem === undefined || citem === null) {
      return '';
    } else {
      return citem;
    }
  }

  ensureList<T>(li: T[] | undefined | null): T[] {
    if (li === undefined || li === null) {
      return [];
    }
    return li;
  }
}

function forceNum(st: string | number): number {
  if (typeof st === 'string') {
    return parseInt(st);
  } else {
    return st;
  }
}
