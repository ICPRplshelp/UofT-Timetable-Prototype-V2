import { Component, Input, OnInit } from '@angular/core';
import { forceNum } from 'src/app/course-list/course-list.component';
import { ConflictInfo, SelectedCoursesService } from 'src/app/selected-courses.service';
import { SectionSelection, msToM } from 'src/app/selectedclasses';
import { ClTimingsSharerService } from 'src/app/shared/cl-timings-sharer.service';
import { Course, MeetingTime, Section } from 'src/app/shared/course-interfaces';
import { UtilitiesService } from 'src/app/shared/utilities.service';

@Component({
  selector: 'app-meeting-chip',
  templateUrl: './meeting-chip.component.html',
  styleUrls: ['./meeting-chip.component.scss']
})
export class MeetingChipComponent implements OnInit {


  @Input() element!: Section;
  @Input() crs!: Course;


  constructor(
    public util: UtilitiesService,
    private clTimingsSharer: ClTimingsSharerService,
    private selectedCoursesService: SelectedCoursesService

  ) { }

  ngOnInit(): void {
  }

  /**
   * Y code
   * @param meets 
   * @returns 
   */
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
  ensureSchedule(ses?: Section): MeetingTime[][] {
    let meetingTimes2 = ses?.meetingTimes ?? [];
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

  ensureScheduleMini(ses: Section): MeetingTime[][] {
    return [this.ensureSchedule(ses)[0]];
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
    if(hours >= 12){
      return 'p';
    } else {
      return 'a';
    }
    // if (hours >= 18) {
    //   return 'p';
    // } else if (hours <= 10) {
    //   return '';
    // } else {
    //   return '';
    // }
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


  getDayCode(dayOfWeekT: number) {
    let dayOfWeek: number = forceNum(dayOfWeekT);
    if (isNaN(dayOfWeek)) {
      dayOfWeek = 7;
    }
    return this.days[dayOfWeek];
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

  forceNum(cand: string | number): number {
    return forceNum(cand);
  }

}
