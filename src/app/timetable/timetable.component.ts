import { Component, Input, OnInit } from '@angular/core';
import {
  ConflictGrouper,
  ConflictingCourseTableCell,
  CourseDisplay,
  CourseTableCell,
  EmptyTableCell,
  OccupiedTableCell,
  TableCell,
} from './timetable-interfaces';
import { Subscription } from 'rxjs';
import { EmptyCell } from '../shared/simplified-interfaces';
import { SelectedCoursesService } from '../selected-courses.service';
import { UtilitiesService } from '../shared/utilities.service';

type TableRow = {
  hourText: string;
  cells: TableCell[];
};

/**
 * THERE IS ONE TIMETABLE PER SESSION: F/Y/S
 */
@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.scss'],
})
export class TimetableComponent implements OnInit {


  private _hourHeight: number = 60;
  get hourHeight() {
    return this._hourHeight * (this.minutesPerCell /60)
  }


  readonly DAYS_IN_WEEK = [
    'SUN',
    'MON',
    'TUE',
    'WED',
    'THU',
    'FRI',
    'SAT',
  ];
  readonly FIRST_DAY = 1; // 1 for monday-
  readonly LAST_DAY = 6; // 6 for -friday
  readonly WEEKS_IN_DAY = this.DAYS_IN_WEEK.length;
  readonly HOURS_IN_DAY = 24;
  minutesPerCell = 60;
  readonly emptyCell = new EmptyCell();
  readonly occupiedCell = new OccupiedTableCell();
  
  readonly MIN_START_HOUR = 9;
  readonly MIN_END_HOUR = 16;

  startHour = 9;
  endHour = 16; // exclusive. 23 = last slot is 22


  


  /**
   * Generate the date strings that appear on the first row of the table.
   */
  generateDateStrings(): string[] {
    return this.DAYS_IN_WEEK.slice(this.FIRST_DAY, this.LAST_DAY);
  }

  /**
   * Generate the time strings that appear on the first column of the table.
   */
  generateTimeStrings(): string[] {
    let curMin = this.startHour * 60;
    const endMin = this.endHour * 60;
    const acc: string[] = [];
    while (curMin < endMin) {
      acc.push(`${Math.floor(curMin / 60)}:${getTensAndOnesPlace(curMin % 60)}`);
      curMin += this.minutesPerCell;
    }
    return acc;
  }

  cellsPerHour(): number {
    return Math.ceil(60 / this.minutesPerCell);
  }

  /**
   *
   * @param mins minutes. any minute.
   * @returns How many cells could fit into that minute, rounded up.
   */
  cellsTakenFromMinutes(mins: number) {
    return Math.ceil(mins / this.minutesPerCell);
  }

  readonly conflictGrouper = new ConflictGrouper();

  // TableCell
  rawTable: TableCell[][] = this._buildEmptyCalendar();
  // 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, ..., 23
  // -, -, -, -, -, -, -, -, -, -, ..., 23
  finalTable: TableCell[][] = transpose(this.rawTable);


  generateAllTableRows(): TableRow[] {
    const timeStrings = this.generateTimeStrings();
    const listAccum: TableRow[] = [];
    const cellOffset = this.cellsTakenFromMinutes(this.startHour * 60);
    for (
      let i = 0;
      i < Math.min(timeStrings.length, this.finalTable.length);
      i++
    ) {
      listAccum.push({
        hourText: timeStrings[i],
        cells: this.finalTable[i + cellOffset].slice(this.FIRST_DAY, this.LAST_DAY),
      });
    }
    return listAccum;
  }

  filterOccupiedCells(tableRows: TableCell[]): TableCell[] {
    
    return tableRows.filter((item) => this.calculateRowSpan(item) !== 0);
  }
  
  private subscription: Subscription | undefined = undefined;


  @Input() sectionCode: string = "F";  // the sessioncode is always initinalized
  // via input BEFORE ngOnInit is called. Can either be F or S
  yearSectionCode: string = "Y";
  constructor(private selectedCourseService: SelectedCoursesService,
    private utilities: UtilitiesService){
    
  }

  ngOnInit(): void {
    this.subscription = this.selectedCourseService.methodCalled$.subscribe(() => {
      const potentialTableCells: CourseDisplay[] = [];
      // sessionCode is used here
      const relevantSections = this.selectedCourseService.addedSections.filter(item => item.targetCourse.sectionCode === this.sectionCode || item.targetCourse.sectionCode === this.yearSectionCode);
      for(let rs of relevantSections){
        for(let mt of rs.sectionSelected?.meetingTimes ?? []){
          potentialTableCells.push(new CourseDisplay(mt, rs));
        }
      }
      let earliestStart = this.MIN_START_HOUR;
      let latestEnd = this.MIN_END_HOUR;

      let hasHalfHourStartOrEnds = false;
      for(let cd of potentialTableCells){
        if(cd.startTimeMins % 60 === 30 || cd.endTimeMins % 60 === 30){
          hasHalfHourStartOrEnds = true;
        }
        const se = Math.floor(cd.startTimeMins / 60);
        const ee = Math.ceil(cd.endTimeMins / 60);
        earliestStart = Math.min(se, earliestStart);
        latestEnd = Math.max(ee, latestEnd);
      }
      this.startHour = earliestStart;
      this.endHour = latestEnd;
      this.minutesPerCell = hasHalfHourStartOrEnds ? 30 : 60;
      this._rebuildTimetable(potentialTableCells);
    })
  }
  ngOnDestroy() {
    if(this.subscription !== undefined)
      this.subscription.unsubscribe();
  }

  

  /**
   * Rebuilds the entire table. With the correct arguments, this method does everything you could imagine.
   */
  _rebuildTimetable(potentialTableCells: CourseDisplay[]): void {

    

    // clean up the table
    this.rawTable = this._buildEmptyCalendar();
    /**
     * PER DAY
     */
    for (let i = 0; i < this.WEEKS_IN_DAY; i++) {
      this._processSingleDay(i, potentialTableCells);
    }

    this.finalTable = transpose(this.rawTable);
    // // // console.log(this.finalTable);
    // // console.log(this.rawTable);
  }

  /**
   * Calculates the rowspan of the current table cell.
   */
  calculateRowSpan(tc: TableCell): number {
    if(tc.isEmpty()){
      return 1;
    } else if(tc.isOccupied()){
      return 0;
    } else if (tc instanceof ConflictingCourseTableCell) {
      return this.cellsTakenFromMinutes(tc.getLatest() - tc.getEarliest());
    } else if (tc instanceof CourseTableCell){
      // // // console.log(tc.displayedCourse.endTimeMins - tc.displayedCourse.startTimeMins);
      return this.cellsTakenFromMinutes(tc.displayedCourse.endTimeMins - tc.displayedCourse.startTimeMins);
    }
    return 1;

  }

  private _hideThisTerm(cd: CourseDisplay): boolean {
    if(this.sectionCode === "F"){
      return cd.hideDuringFall();
    } else {
      return cd.hideDuringWinter();
    }
  }

  private _processSingleDay(
    i: number,
    potentialTableCells: CourseDisplay[]
  ): void {
    const displaysForThatDay = potentialTableCells.filter(
      (item) => item.dayOfWeek === i && (!this._hideThisTerm(item))
    );
    const ptc = this.conflictGrouper.groupConflictingInSameDay(displaysForThatDay);
    // // // console.log("ptc", ptc);
    // ptc.conflictGroups;  // CourseTableCell or ConflictingCourseTableCell
    // ptc.notConflicting;
    for (let conf of ptc.conflictGroups) {
      const c2 = new ConflictingCourseTableCell(conf);
      const startTime = c2.getEarliest();
      const endTime = c2.getLatest();
      // // console.log("Trying to mold conf:", c2, startTime, endTime);
      this._moldIntoTable(i, c2, startTime, endTime);
    }
    for (let ccell of ptc.notConflicting) {
      const c2 = new CourseTableCell(ccell);
      const startTime = ccell.startTimeMins;
      const endTime = ccell.endTimeMins;
      this._moldIntoTable(i, c2, startTime, endTime);
    }
  }

  private _moldIntoTable(
    dayId: number,
    tcAdd: TableCell,
    startTime: number,
    endTime: number
  ): boolean {
    const startCell = this.cellsTakenFromMinutes(startTime);
    const endCell = this.cellsTakenFromMinutes(endTime);
    const cellLength = endCell - startCell;
    // // console.log(dayId, cellLength);
    if (cellLength === 0) return false;
    setNextElementsToValue<TableCell>(
      this.rawTable[dayId],
      this.occupiedCell,
      startCell,
      endCell
    );
    this.rawTable[dayId][startCell] = tcAdd;
    return true;
  }

  private _buildEmptyCalendar(): EmptyTableCell[][] {
    return Array.from({ length: this.WEEKS_IN_DAY }, () =>
      this._buildEmptyDay()
    );
  }

  private _buildEmptyDay(): EmptyTableCell[] {
    return Array.from(
      { length: this.HOURS_IN_DAY * this.cellsPerHour() },
      () => new EmptyTableCell()
    );
  }

  isCourseTableCell(tc: TableCell): boolean {
    return tc instanceof CourseTableCell;
  }

  isConflictCell(tc: TableCell): boolean {
    return tc instanceof ConflictingCourseTableCell;
  }

  forceCourseTablecell(tc: TableCell): CourseTableCell {
    return (tc as CourseTableCell);
  }

  forceCourseConflictCell(tc: TableCell): ConflictingCourseTableCell {
    return (tc as ConflictingCourseTableCell);
  }

}

/**
 * targetList[start:end] = [value for _ in range(0, end - start)]
 */
function setNextElementsToValue<T>(
  targetList: T[],
  value: T,
  start: number,
  end: number
): void {
  for (let i = start; i < end && i < targetList.length; i++) {
    targetList[i] = value;
  }
}

function transpose<T>(arr: T[][]): T[][] {
  if (arr.length === 0 || arr[0].length === 0) {
    return [];
  }

  const numRows = arr.length;
  const numCols = arr[0].length;

  // Initialize the transposed array with empty arrays for each column
  const transposed: T[][] = new Array(numCols).fill(null).map(() => []);

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      transposed[col].push(arr[row][col]);
    }
  }

  return transposed;
}


function getTensAndOnesPlace(number: number): string {
  if(number < 10){
    return `0${number}`;
  } else {
    return `${number}`;
  }
}