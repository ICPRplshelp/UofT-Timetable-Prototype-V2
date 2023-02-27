import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  Course,
  EnrolmentControl,
  IndividualControl,
  Instructor,
  MeetingTime,
  SectionNote,
  CourseNote,
  Section,
} from '../shared/course-interfaces';
import { UtilitiesService } from '../shared/utilities.service';

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

  storedCourses: Course[] = [];
  displayedColumns: string[] = ['lec', 'ins', 'time', 'delivery'];
  displayedColumnsExpanded: string[] = [...this.displayedColumns];
  expandedElement: Section | null = null;

  constructor(
    private dialogRef: MatDialogRef<TimingsComponent>,
    @Inject(MAT_DIALOG_DATA) data: { courses: Course[] },
    public util: UtilitiesService
  ) {
    this.storedCourses = data.courses;
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

  getDayColor(dayOfWeek: string): string {
    let dayOfWeek2 = parseInt(dayOfWeek);
    if (isNaN(dayOfWeek2) || dayOfWeek2 === -1) {
      dayOfWeek2 = this.util.dayColors.length - 1;
    }
    // console.log("temp will be", dayOfWeek2, "and is", this.util.dayColors[dayOfWeek2]);
    // if (temp === undefined){
    //   temp = "gray";
    // }
    return this.util.dayColors[dayOfWeek2];
  }

  getDayColoredText(dayOfWeekT: string): string {
    let dayOfWeek: number = parseInt(dayOfWeekT);
    if (isNaN(dayOfWeek) || dayOfWeek === -1) {
      dayOfWeek = this.util.dayColorText.length - 1;
    }
    return this.util.dayColorText[dayOfWeek];
  }

  getDayBrightenedColors(dayOfWeekT: string): string {
    let dayOfWeek: number = parseInt(dayOfWeekT);
    if (isNaN(dayOfWeek) || dayOfWeek === -1) {
      dayOfWeek = this.util.dayBrightenedColors.length - 1;
    }
    return this.util.dayBrightenedColors[dayOfWeek];
  }

  days: string[] = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA', ''];

  // with a millisofday return HH:MM timecode in 24 hour format
  getTimeCode(millisTemp: string): string {
    let millis = parseInt(millisTemp);
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

  getTimeCode12(millisTemp: string): string{
    let millis = parseInt(millisTemp);
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

      return hours + minsStr;
    
    
  }
  /**
   * 
   * @param millisTemp millis
   * Returns AM, PM, or nothing
   */
  ampm(millisTemp: string): string {
    let millis = parseInt(millisTemp);
    if (isNaN(millis) || millis === -1) {
      return '';
    }

    let date = new Date(millis);
    let hours = date.getHours() + 5;
    if(hours >= 12){
      return 'pm';
    } else {
      return 'am';
    }
  }

  getDeliveryMode(sec: Section): string {
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
    const async = 'wifi_off';
    const asyncif = 'wifi_off group';

    switch (mode) {
      case 'INPER':
        return inper;
      case 'CLASS':
        return inper;
      case 'SYNIF':
        return syncif;
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

  getDayCode(dayOfWeekT: string) {
    let dayOfWeek: number = parseInt(dayOfWeekT);
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
      let buildingIdentifier = `${mt.building.buildingCode} ${mt.building.buildingRoomNumber}`;
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
      let aStart = parseInt(a.start.day);
      if (isNaN(aStart)) {
        aStart = 0;
      }
      let bStart = parseInt(b.start.day);
      if (isNaN(bStart)) {
        bStart = 0;
      }
      if (aStart < bStart) {
        return -1;
      } else if (aStart > bStart) {
        return 1;
      }
      let ams = parseInt(a.start.millisofday);
      let bms = parseInt(b.start.millisofday);
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

  sortSections(secs: Section[]): Section[] {
    secs.sort((a, b) => a.name.localeCompare(b.name));
    return secs;
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
    if(ctrl === undefined || ctrl === null){
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
    return !(cst === undefined || cst === null || cst.trim() === "");

  }


  ensureEnrolmentControls(sec: Section | null | undefined): EnrolmentControl[] {
    if(sec === null || sec === undefined){
      return [];
    } else {
      return sec.enrolmentControls.filter(item => this.controlToReadable(
        item
      ).trim() !== "");
    }
  }

  createEnrolmentControlsReadable(sec: Section | null | undefined): string[] {
    if(sec === null || sec === undefined){
      return ["See notes"];
    }
    if(sec.enrolmentControls === null || sec.enrolmentControls === undefined){
      return ["See notes"];
    }
    if(sec.enrolmentControls.length === 0){
      return ["See notes"];
    }
    else {
      let temp1 =  [...new Set(sec.enrolmentControls.map(item => this.controlToReadable(
        item
      ).trim()).filter(item => item !== ""))];



      return temp1;
    }
  }

  dupeFas(tl: string[]): string[] {
    let fasCount = 0;
    tl.forEach(item => {if(item.includes("Arts and Science")){
      fasCount++;
    }});
    if(fasCount >= 2){
      return tl.filter(item => item.trim() !== 'Faculty of Arts and Science');
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
  createReadableControls(ectr: EnrolmentControl | null | undefined): IndividualControl[]{
    if(ectr === null || ectr === undefined){
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
      ectr.designation
    ];
    const tl2: IndividualControl[] = [];
    for(let item of controlItems){
      if(item !== undefined && !this.controlIsUniversal(item)){
        tl2.push(item);
      }
    }
    return tl2;
  }

  controlToReadable(ectr: EnrolmentControl | null | undefined): string {
    return this.joinWithEndash(
      this.individualControlListToString(
        this.createReadableControls(ectr), ectr
      )
    );

  }

  individualControlListToString(indv: IndividualControl[],
    ectr?: EnrolmentControl | null | undefined
    ): string[] {


    const temp = indv.map(item => item.name);
    const temp2: string[] = [];
      if(ectr !== null && ectr !== undefined){
        if((ectr.yearOfStudy !== null && ectr.yearOfStudy !== undefined)
        && ectr.yearOfStudy.trim() !== '*'
          ){
          temp2.push(`Year ${ectr.yearOfStudy?.trim()}`);
        }
      }


    return [...temp2 , ...temp];
  }

  joinWithEndash(items: string[]): string {
    return items.join(" – ");
  }

  sectionIsLecture(sec: Section): boolean{
    // console.log(sec);
    if(sec === null || sec === undefined){
      return false;
    }
    // console.log(sec.teachMethod);
    return sec.teachMethod.trim() === "LEC";
  }

  // return notes form a section
  getNotes(sec: Section): string {
    
    if(sec === null || sec === undefined){
      return "";
    }
    if(sec.notes === null || sec.notes === undefined){
      return "";
    }
    // console.log(sec.notes);
    let ns = "";
    for(let sn of sec.notes){
      if(sn.content !== null && sn.content !== undefined)
        ns += sn.content;
    }
    
    return ns;

  }


  cutOutUndefined(cand: string | null | undefined): string{
    if(cand === null || cand === undefined || cand.trim() === ""){
      return "None";
    }
    else return cand;
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

  ngOnInit(): void {}
}
