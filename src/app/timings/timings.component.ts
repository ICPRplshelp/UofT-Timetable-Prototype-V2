import { animate, state, style, transition, trigger } from '@angular/animations';
import { ArrayDataSource } from '@angular/cdk/collections';
import { temporaryAllocator } from '@angular/compiler/src/render3/view/util';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Course, CourseSections, MeetingTime, Section } from '../shared/course-interfaces';
import { UtilitiesService } from '../shared/utilities.service';

@Component({
  selector: 'app-timings',
  templateUrl: './timings.component.html',
  styleUrls: ['./timings.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', visibility: 'hidden'})),
      state('expanded', style({height: '*', visibility: 'visible'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class TimingsComponent implements OnInit {
  // , "ins", "time", "delivery"

  storedCourses: Course[] = [];
  displayedColumns: string[] = ["lec", "ins", "time", "delivery"];
  constructor(
    private dialogRef: MatDialogRef<TimingsComponent>,
    @Inject(MAT_DIALOG_DATA) data: {courses: Course[]},
    private util: UtilitiesService
  ) { 
    this.storedCourses = data.courses;
  }


  getTableColor(crs: Course): string {
    const sesCode = crs.sectionCode;
    switch(sesCode){
      case "F": return this.util.tableSessionColors[0];
      case "S": return this.util.tableSessionColors[1];
      case "Y": return this.util.tableSessionColors[2];
      default: return "white";
    }
  }


  getDayColor(dayOfWeek: string): string {
    let dayOfWeek2 = parseInt(dayOfWeek);
      if(dayOfWeek2 === NaN){
        dayOfWeek2 = 7;
      }

    return this.util.dayColors[dayOfWeek2];
  }

  getDayColoredText(dayOfWeekT: string): string {
    let dayOfWeek: number = parseInt(dayOfWeekT);
    if(dayOfWeek === NaN){
      dayOfWeek = 7;
    }
    return this.util.dayColorText[dayOfWeek];
  }

  getDayBrightenedColors(dayOfWeekT: string): string {
    let dayOfWeek: number = parseInt(dayOfWeekT);
    if(dayOfWeek === NaN){
      dayOfWeek = 7;
    }
    
    return this.util.dayBrightenedColors[dayOfWeek];
  }

  days: string[] = ["SU", "MO", "TU",
"WE", "TH", "FR", "SA", ""]

  // with a millisofday return HH:MM timecode in 24 hour format
  getTimeCode(millisTemp: string): string {
    let millis = parseInt(millisTemp);
    if(millis === NaN){
      return "NA";
    }
    let date = new Date(millis);
    let hours = date.getHours() + 5;
    let minutes = date.getMinutes();
    let minsStr = "";
    if(minutes >= 1){
      minsStr = minutes < 10 ? '0'+minutes : `${minutes}`;
      minsStr = ':'+minsStr;
    }
    if(this.util.is24hour){
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    
    return hours + minsStr + ampm;
    } else {
      return hours + minsStr;
    }
  }

  getDeliveryMode(sec: Section): string {
    const sdm = sec.deliveryModes;
    if(sdm === null || sdm === undefined){
      return "";
    }
    const sdm2 = sdm.deliveryModes;
    if(Array.isArray(sdm2)){
      if(sdm2.length !== 0)
        return sdm2[0].mode;
      else return "";
    }
    
    return sdm2.mode;
  }

  getIcon(sec: Section): string {
    return this.getSyncIcon(this.getDeliveryMode(sec));
  }

  getToolTip(sec: Section): any {
    const deliv = this.getDeliveryMode(sec);
    switch(deliv){
      case 'INPER':
        return "In person";
      case 'CLASS':
        return "In person";
      case 'SYNIF':
        return "Online synchronous (with in-person assessments)";
      case 'SYNC':
        return "Online synchronous";
      case 'ONL':
        return "Online synchronous";
      case 'ONLSYNC':
        return "Online synchronous";
      case 'ASYNC':
        return "Asynchronous";
      case 'ONLASYNC':
        return "Asynchronous";
      case 'ASYIF':
        return "Asynchronous (with in-person assessments)";
      default:
        return 'Unknown';

    }

  }

  ensureNotes(notes: any): string{
    if(notes === null || notes === undefined){
      return "";
    }
    let cand1 = notes.notes;
    if(cand1 === null || cand1 === undefined){
      return "";
    }
    let cand3 = cand1.content;
    if(cand3 === null || cand3 === undefined){
      return "";
    }
    return cand3;
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


    switch(mode){
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

    }}


  getDayCode(dayOfWeekT: string){
    let dayOfWeek: number = parseInt(dayOfWeekT);
    if(dayOfWeek === NaN){
      dayOfWeek = 6;
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
    if(mets2.length === 0){
      return [];
    }
    let array = mets2;
    let temp = array[0].map((_, colIndex) => array.map(row => row[colIndex]));
    // console.log(temp);
    return temp;
    // return array[0].map((col, i) => array.map(row => row[i]));



  }


  getRidOfDuplicateLocations(mtt: MeetingTime[]): MeetingTime[] {
    const toReturn: MeetingTime[] = [];
    const roomsSoFar: string[] = [];
    for(let mt of mtt){
      let buildingIdentifier = `${mt.building.buildingCode} ${mt.building.buildingRoomNumber}`;
      if(!roomsSoFar.includes(buildingIdentifier)){
      roomsSoFar.push(buildingIdentifier);
      toReturn.push(mt);
    }

    }
    return toReturn;

  }

  ensureSchedule(ses: Section): MeetingTime[][]{
    let meetingTimes = ses.meetingTimes;
    if(meetingTimes === null || meetingTimes === undefined){
      return [];
    }
    let meetingTimes2 = meetingTimes.meetingTimes;
    if(Array.isArray(meetingTimes2)){
      meetingTimes2.sort((a, b) => {
        let aStart = parseInt(a.start.day);
        if(aStart === NaN){
          aStart = 0;
        }
        let bStart = parseInt(b.start.day);
        if(bStart == NaN){
          bStart = 0;
        }
        if(aStart < bStart){
          return -1;
        } else if (aStart > bStart){
          return 1
        }

        let ams = parseInt(a.start.millisofday);
        let bms = parseInt(b.start.millisofday);
        if(ams === NaN) ams = 0;
        if(bms === NaN) bms = 0;
        return ams - bms;  // if bms is higher, it is negative
      
      })


      return this.splitMeetingTimes(meetingTimes2);
    } else {
      return [[meetingTimes2]];
    }
  }

  splitMeetingTimes(meets: MeetingTime[]): MeetingTime[][]{
    const toReturn: MeetingTime[][] = [];
    const sessionList: string[] = [];
    for(let met of meets){
      let ind = sessionList.indexOf(met.sessionCode);
      if(ind === -1){
        toReturn.push([]);
        sessionList.push(met.sessionCode);
        ind = sessionList.length - 1;
      }
      toReturn[ind].push(met);
    }
    return toReturn;
  }


  ensureCourseFormat(cs: CourseSections): Section[] {
    const tempSec = cs.sections;
    if(Array.isArray(tempSec)){
      return tempSec;
    } else {
      return [tempSec];
    }
  }

  sortSections(secs: Section[]): Section[]{
    secs.sort((a, b) => 
      a.name.localeCompare(b.name)
    );
    return secs;
  }


  ensureInstructorsFromElement(element: any): any[] {
    if(element.instructors === null || element.instructors === undefined){
      return [];
    }
    let ei = element.instructors.instructors;
    return this.ensureInstructors(ei);
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
    if(ins === null || ins === undefined){
      return [];
    }
    if(Array.isArray(ins)){
      return ins;
    } else {
      return [ins];
    }
  }


  ngOnInit(): void {
  }

}
