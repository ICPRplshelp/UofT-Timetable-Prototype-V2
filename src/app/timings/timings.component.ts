import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
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
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class TimingsComponent implements OnInit {
  // , "ins", "time", "delivery"

  @Input() storedCourses: Course[] = [];
  @Input() smallScreen: boolean = false;
  @Input() hideCourseCode: boolean = false;

  noCourses(): boolean {
    return this.storedCourses.length === 0;
  }

  padLecs(): boolean{ 
    return this.smallScreen && this.util.courseListOnly;
  }

  displayedColumns: string[] = (this.util.enableTimetableBuilder && !this.util.courseListOnly)
    ? ['sel', 'lec', 'ins', 'time', 'delivery']
    : ['lec', 'ins', 'time', 'delivery'];
  displayedColumnsExpanded: string[] = [...this.displayedColumns];
  expandedElement: Section | null = null;
  smallScreenVal: string = '';

  constructor(
    public util: UtilitiesService,
    private clTimingsSharer: ClTimingsSharerService,
    private selectedCoursesService: SelectedCoursesService
  ) {
    // console.log("Small screen?", data.smallScreen);
  }

  getTableColor(crs: Course): string {
    const sesCode = crs.sectionCode;
    switch (sesCode) {
      case 'F':
        return this.util.tableSessionColors[0];
      case 'S':
        return this.util.tableSessionColors[1];
      case 'Y':
        return this.util.tableSessionColors[2];
      default:
        return 'white';
    }
  }

  getDayColor(dayOfWeek: number): string {
    let dayOfWeek2 = forceNum(dayOfWeek);
    if (isNaN(dayOfWeek2) || dayOfWeek2 === -1) {
      dayOfWeek2 = this.util.dayColors.length - 1;
    }
    // console.log("temp will be", dayOfWeek2, "and is", this.util.dayColors[dayOfWeek2]);
    // if (temp === undefined){
    //   temp = "gray";
    // }
    return this.util.dayColors[dayOfWeek2];
  }

  getDayColoredText(dayOfWeekT: number): string {
    let dayOfWeek: number = forceNum(dayOfWeekT);
    if (isNaN(dayOfWeek) || dayOfWeek === -1) {
      dayOfWeek = this.util.dayColorText.length - 1;
    }
    return this.util.dayColorText[dayOfWeek];
  }

  getDayBrightenedColors(dayOfWeekT: number): string {
    let dayOfWeek: number = forceNum(dayOfWeekT);
    if (isNaN(dayOfWeek) || dayOfWeek === -1) {
      dayOfWeek = this.util.dayBrightenedColors.length - 1;
    }
    return this.util.dayBrightenedColors[dayOfWeek];
  }

  days: string[] = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA', '⠀⠀'];

  // with a millisofday return HH:MM timecode in 24 hour format
  getTimeCode(millis: number): string {
    if (isNaN(millis) || millis === -1) {
      return 'NA';
    }

    let date = new Date(millis);
    let hours = date.getHours() + 5;
    let minutes = date.getMinutes();
    let minsStr = '';
    if (minutes >= 1) {
      minsStr = minutes < 10 ? '0' + minutes : `${minutes}`;
      minsStr = ':' + minsStr;
    }

    return hours + minsStr;
  }

  getTimeCode12(millisTemp: number): string {
    let millis = forceNum(millisTemp);
    if (isNaN(millis) || millis === -1) {
      return 'NA';
    }

    let date = new Date(millis);
    let hours = date.getHours() + 5;
    let minutes = date.getMinutes();
    let minsStr = '';
    if (minutes >= 1) {
      minsStr = minutes < 10 ? '0' + minutes : `${minutes}`;
      minsStr = ':' + minsStr;
    }
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    return (hours + minsStr).trim();
  }

  /**
   *
   * @param millisTemp millis
   * Returns AM, PM, or nothing
   */
  ampm(millis: number): string {
    if (isNaN(millis) || millis === -1) {
      return '';
    }

    let date = new Date(millis);
    let hours = date.getHours() + 5;
    if (hours >= 20) {
      return 'p';
    } else if (hours <= 10) {
      return '';
    } else {
      return '';
    }
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

  getIcon(sec: Section): string {
    return this.getSyncIcon(this.getDeliveryMode(sec));
  }

  getToolTip(sec: Section): any {
    const deliv = this.getDeliveryMode(sec);
    switch (deliv) {
      case 'INPER':
        return 'In person';
      case 'CLASS':
        return 'In person';
      case 'SYNIF':
        return 'Online synchronous (with in-person assessments)';
      case 'HYBR':
        return 'Hybrid';
      case 'SYNC':
        return 'Online synchronous';
      case 'ONL':
        return 'Online synchronous';
      case 'ONLSYNC':
        return 'Online synchronous';
      case 'ASYNC':
        return 'Asynchronous';
      case 'ONLASYNC':
        return 'Asynchronous';
      case 'ASYIF':
        return 'Asynchronous (with in-person assessments)';
      default:
        return 'Unknown';
    }
  }

  ensureNotes(notes?: CourseNote[]): string {
    if (notes === null || notes === undefined) {
      return '';
    }
    let finalStr = '';
    notes.forEach((nt) => {
      if (nt === null || nt === undefined) {
        return;
      }
      let nContent = this._ensureIndividualNote(nt);
      finalStr += nContent;
    });
    return finalStr;
  }

  private _ensureIndividualNote(notes: CourseNote): string {
    if (notes === null || notes === undefined) {
      return '';
    }
    let content = notes.content;
    if (content !== null) {
      return content;
    } else {
      return '';
    }
  }

  /**
   * Return the sync icon.
   * @param mode SYNC, INPER, and so on.
   */
  getSyncIcon(mode: string): string {
    const inper = 'group';
    const sync = 'wifi';
    const syncif = 'wifi group';
    const hybridDelivery = 'wifi group';
    const async = 'wifi_off';
    const asyncif = 'wifi_off group';

    switch (mode) {
      case 'INPER':
        return inper;
      case 'CLASS':
        return inper;
      case 'SYNIF':
        return syncif;
      case 'HYBR':
        return hybridDelivery;
      case 'SYNC':
        return sync;
      case 'ONL':
        return sync;
      case 'ONLSYNC':
        return sync;
      case 'ASYNC':
        return async;
      case 'ONLASYNC':
        return async;
      case 'ASYIF':
        return asyncif;
      default:
        return 'question_mark';
    }
  }

  getDayCode(dayOfWeekT: number) {
    let dayOfWeek: number = forceNum(dayOfWeekT);
    if (isNaN(dayOfWeek)) {
      dayOfWeek = 7;
    }
    return this.days[dayOfWeek];
  }

  ensureScheduleMini(ses: Section): MeetingTime[][] {
    return [this.ensureSchedule(ses)[0]];
  }

  /**
   *
   * @param mets2 MeetingTime[][] the input array
   * @returns it transposed
   */
  groupMeetings(mets2: MeetingTime[][]): MeetingTime[][] {
    if (mets2.length === 0) {
      return [
        [
          {
            start: { day: '', millisofday: '-1' },
            end: { day: '', millisofday: '-1' },
            building: {
              buildingCode: '',
              buildingRoomNumber: '',
              buildingUrl: '',
              buildingName: '',
            },
            sessionCode: '10000',
            repetition: 'WEEKLY',
            repetitionTime: 'ONCE_A_WEEK',
          },
        ],
      ];
    }
    let array = mets2;
    // console.log(temp);
    return array[0].map((_, colIndex) => array.map((row) => row[colIndex]));
    // return array[0].map((col, i) => array.map(row => row[i]));
  }

  getRidOfDuplicateLocations(mtt: MeetingTime[]): MeetingTime[] {
    const toReturn: MeetingTime[] = [];
    const roomsSoFar: string[] = [];
    for (let mt of mtt) {
      let buildingIdentifier = `${mt.building.buildingCode ?? ''} ${mt.building.buildingRoomNumber ?? ''}`;
      if (!roomsSoFar.includes(buildingIdentifier)) {
        roomsSoFar.push(buildingIdentifier);
        toReturn.push(mt);
      }
    }
    return toReturn;
  }

  ensureSchedule(ses: Section): MeetingTime[][] {
    let meetingTimes2 = ses.meetingTimes;
    // console.log(meetingTimes2);
    if (meetingTimes2 === null || meetingTimes2 === undefined) {
      meetingTimes2 = [];
    }
    meetingTimes2.sort((a, b) => {
      let aStart = forceNum(a.start.day);
      if (isNaN(aStart)) {
        aStart = 0;
      }
      let bStart = forceNum(b.start.day);
      if (isNaN(bStart)) {
        bStart = 0;
      }
      if (aStart < bStart) {
        return -1;
      } else if (aStart > bStart) {
        return 1;
      }
      let ams = forceNum(a.start.millisofday);
      let bms = forceNum(b.start.millisofday);
      if (isNaN(ams)) ams = 0;
      if (isNaN(bms)) bms = 0;
      return ams - bms; // if bms is higher, it is negative
    });
    return this.splitMeetingTimes(meetingTimes2);
  }

  splitMeetingTimes(meets: MeetingTime[]): MeetingTime[][] {
    const toReturn: MeetingTime[][] = [];
    const sessionList: string[] = [];
    for (let met of meets) {
      let ind = sessionList.indexOf(met.sessionCode);
      if (ind === -1) {
        toReturn.push([]);
        sessionList.push(met.sessionCode);
        ind = sessionList.length - 1;
      }
      toReturn[ind].push(met);
    }
    return toReturn;
  }

  ensureCourseFormat(cs?: Section[]): Section[] {
    if (cs === null || cs === undefined) {
      return [];
    }
    return cs;
  }

  convertLecSessionName(lname: string): string {
    if (lname.startsWith('LEC') && lname[3] === '2') {
      return lname.slice(0, 3) + 'S' + lname.slice(4);
    } else return lname;
  }

  sortSections(secs: Section[]): Section[] {
    if (this.util.hideSpecial) {
      secs = secs.filter((sec) => sec.name[3] !== '2');
    }

    secs.sort((a, b) => {
      const aname = this.convertLecSessionName(a.name);
      const bname = this.convertLecSessionName(b.name);
      return aname.localeCompare(bname);
    });
    return secs;
  }

  shortenLecNameIfSmall(lecSessionName: string): string {
    if (this.smallScreen) {
      return lecSessionName[0] + lecSessionName.slice(3);
    } else return lecSessionName;
  }

  getCurrentlyEnrolled(element: Section): number {
    if (
      element.currentEnrolment !== null &&
      element.currentEnrolment !== undefined &&
      element.currentWaitlist !== null &&
      element.currentWaitlist !== undefined
    )
      return (
        forceNum(element.currentEnrolment) + forceNum(element.currentWaitlist)
      );
    else if (
      element.currentEnrolment !== null &&
      element.currentEnrolment !== undefined
    )
      return forceNum(element.currentEnrolment);
    else return 0;
  }

  getCapacity(element: Section): number {
    if (element.maxEnrolment !== null && element.maxEnrolment !== undefined) {
      return forceNum(element.maxEnrolment);
    } else {
      return 0;
    }
  }

  ensureInstructorsFromElement(element: Section): Instructor[] {
    if (element.instructors === null || element.instructors === undefined) {
      return [];
    }
    return element.instructors;
  }

  /**
   * Returns whether the enrollment control is universal.
   *
   * @param ctrl the individual enrollment control
   * @returns whether the control is universal
   */
  controlIsUniversal(ctrl?: IndividualControl | null): boolean {
    if (ctrl === undefined || ctrl === null) {
      return true;
    }

    for (let ctc of [ctrl.code, ctrl.name]) {
      if (ctc === null || ctc === undefined || ctc === '*') {
        return true;
      }
    }
    return false;
  }

  notNullEmpty(cst?: string | null): boolean {
    // console.log(cst);
    return !(cst === undefined || cst === null || cst.trim() === '');
  }

  uListEmpty<T>(li: T[] | undefined): T[] {
    if (li === undefined) return [];
    else return li;
  }

  ensureEnrolmentControls(sec: Section | null | undefined): EnrolmentControl[] {
    if (sec === null || sec === undefined) {
      return [];
    } else {
      if (sec.enrolmentControls === undefined) {
        return [];
      }
      return sec.enrolmentControls.filter(
        (item) => this.controlToReadable(item).trim() !== ''
      );
    }
  }

  createEnrolmentControlsReadable(sec: Section | null | undefined): string[] {
    if (sec === null || sec === undefined) {
      return ['See notes'];
    }
    if (sec.enrolmentControls === null || sec.enrolmentControls === undefined) {
      return ['See notes'];
    }
    if (sec.enrolmentControls.length === 0) {
      return ['See notes'];
    } else {
      let temp1 = [
        ...new Set(
          sec.enrolmentControls
            .map((item) => this.controlToReadable(item).trim())
            .filter((item) => item !== '')
        ),
      ];

      return temp1;
    }
  }

  dupeFas(tl: string[]): string[] {
    let fasCount = 0;
    tl.forEach((item) => {
      if (item.includes('Arts and Science')) {
        fasCount++;
      }
    });
    if (fasCount >= 2) {
      return tl.filter((item) => item.trim() !== 'Faculty of Arts and Science');
    } else {
      return tl;
    }
  }

  /**
   * Creates a list of readable enrolment controls.
   *
   * @param ectr the enrolment controls object from a section
   * @returns a list of individual controls, sorted in a specific way,
   * that does not contain anything that would be deemed universal.
   */
  createReadableControls(
    ectr: EnrolmentControl | null | undefined
  ): IndividualControl[] {
    if (ectr === null || ectr === undefined) {
      return [];
    }
    if (ectr.quantity === '0') {
      return [];
    }
    const tl: string[] = [];
    const controlItems: (IndividualControl | undefined)[] = [
      ectr.primaryOrg,
      ectr.associatedOrg,
      ectr.adminOrg,
      ectr.secondOrg,
      ectr.post,
      ectr.subject,
      ectr.subjectPost,
      ectr.typeOfProgram,
      ectr.designation,
    ];
    const tl2: IndividualControl[] = [];
    for (let item of controlItems) {
      if (item !== undefined && !this.controlIsUniversal(item)) {
        tl2.push(item);
      }
    }
    return tl2;
  }

  controlToReadable(ectr: EnrolmentControl | null | undefined): string {
    return this.joinWithEndash(
      this.individualControlListToString(
        this.createReadableControls(ectr),
        ectr
      )
    );
  }

  individualControlListToString(
    indv: IndividualControl[],
    ectr?: EnrolmentControl | null | undefined
  ): string[] {
    const temp = indv.map((item) => item.name);
    const temp2: string[] = [];
    if (ectr !== null && ectr !== undefined) {
      if (
        ectr.yearOfStudy !== null &&
        ectr.yearOfStudy !== undefined &&
        ectr.yearOfStudy.trim() !== '*'
      ) {
        temp2.push(`Year ${ectr.yearOfStudy?.trim()}`);
      }
    }

    return [...temp2, ...temp];
  }

  joinWithEndash(items: string[]): string {
    return items.join(' – ');
  }

  sectionIsLecture(sec: Section): boolean {
    // console.log(sec);
    if (sec === null || sec === undefined) {
      return false;
    }
    // console.log(sec.teachMethod);
    if (sec.teachMethod === undefined || sec.teachMethod === null) {
      return false;
    }
    return sec.teachMethod.trim() === 'LEC';
  }

  // return notes form a section
  getNotes(sec: Section): string {
    if (sec === null || sec === undefined) {
      return '';
    }
    if (sec.notes === null || sec.notes === undefined) {
      return '';
    }
    // console.log(sec.notes);
    let ns = '';
    for (let sn of sec.notes) {
      if (sn.content !== null && sn.content !== undefined) ns += sn.content;
    }

    return ns;
  }

  cutOutUndefined(cand: string | null | undefined): string {
    if (cand === null || cand === undefined || cand.trim() === '') {
      return 'None';
    } else return cand;
  }

  /**
   * "instructors":
   * {"instructors":
   *  [{"firstName": "Asher", "lastName": "Cutter"},
   *  {"firstName": "Megan", "lastName": "Frederickson"}
   *  ]}
   * @param ins the instructors object or list of it
   * @returns always as a list
   */
  ensureInstructors(ins: any): any[] {
    if (ins === null || ins === undefined) {
      return [];
    }
    if (Array.isArray(ins)) {
      return ins;
    } else {
      return [ins];
    }
  }

  ngOnInit(): void {
    if (!this.smallScreen) {
      this.smallScreenVal = 'padding: 42px';
    } else {
      this.days = ['U', 'M', 'T', 'W', 'R', 'F', 'S', '⠀'];
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


  addOrRemoveSectionFromPlan(sec: Section, curCrs: Course): void {
    this.selectedCoursesService.addOrRemoveSection(
      new SectionSelection(sec, this.storedCourses, curCrs)
    );
  }
  // code that interacts with the service
  addSectionToPlan(sec: Section, curCrs: Course): void {
    this.selectedCoursesService.addSection(
      new SectionSelection(sec, this.storedCourses, curCrs)
    );
  }

  removeSectionFromPlan(sec: Section, curCrs: Course): void {
    this.selectedCoursesService.removeSection(
      new SectionSelection(sec, this.storedCourses, curCrs)
    );
  }

  checkSectionEnrolled(sec: Section, curCrs: Course): boolean {
    return this.selectedCoursesService.checkEnrolled(
      new SectionSelection(sec, this.storedCourses, curCrs)
    );
  }



  onCheckboxChange(
    $event: MatCheckboxChange,
    sec: Section,
    curCrs: Course
  ): void {
    
    this.addOrRemoveSectionFromPlan(sec, curCrs);
    return;

    // [ ] -> [C]
    if ($event.checked) {
      this.addSectionToPlan(sec, curCrs);
    } else {
      // [C] -> [ ]
      this.removeSectionFromPlan(sec, curCrs);
    }



  }

  forceNum(cand: string | number): number {
    return forceNum(cand);
  }

  get curCourseCode(): string {
    if (this.storedCourses.length === 0) {
      return '';
    } else {
      return this.storedCourses[0].code;
    }
  }

  meetingCollectionConflicts(
    mCol: MeetingTime[],
    crs: Course,
    sec: Section
  ): ConflictInfo | null {

    if(!this.util.enableTimetableBuilder)
      return null;

    if (mCol.length === 0) {
      return null;
    }
    const sesSel: SectionSelection = new SectionSelection(
      sec, [crs], crs
    );
    const dayOfWeek = mCol[0].start.day;
    const startMinute = msToM(mCol[0].start.millisofday);
    const endMinute = msToM(mCol[0].end.millisofday);
    const preRe = this.selectedCoursesService.conflictsWithExisting(
      crs.sectionCode,
      forceNum(dayOfWeek),
      startMinute,
      endMinute,
      sesSel
    );
    // console.log(preRe);
    return preRe;
  }
}
