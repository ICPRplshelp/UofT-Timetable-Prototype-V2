import { Component, Input, OnInit } from '@angular/core';
import { ConflictingCourseTableCell } from '../timetable-interfaces';

@Component({
  selector: 'app-conflict-timetable-cell',
  templateUrl: './conflict-timetable-cell.component.html',
  styleUrls: ['./conflict-timetable-cell.component.scss']
})
export class ConflictTimetableCellComponent implements OnInit {

  @Input() displayedCells!: ConflictingCourseTableCell;
  @Input() smallScreen: boolean = false;

  /**
   * 
   * @param startMin Starting minute
   * @returns from 0 to 1
   */
  calculatePos(min: number): number {
    const earliest = this.displayedCells.getEarliest();
    const latest = this.displayedCells.getLatest();
    const a1 = (min - earliest) / (latest - earliest);
    // // console.log(latest, earliest, min);
    // // // console.log("Calculated pos at", a1);
    return a1;
  }

  toPercent(posProportion: number): string {
    if(isNaN(posProportion)){
      return "100%";
    }
    // // console.log("Percentage is ", `${Math.round(posProportion * 100)}%`)
    return `${Math.round(posProportion * 100)}%`;
  }

  calculateHeight(min: number): number {
    // min is the duration
    const earliest = this.displayedCells.getEarliest();
    const latest = this.displayedCells.getLatest();
   const totalDur = latest - earliest;
   // // console.log("HT CALC", latest, earliest, min);
   return min / totalDur;
  }

  _conflictingCourseCount(cctc: ConflictingCourseTableCell): number {
    return cctc.displayedCourses.length;
  }

  





  constructor() { }

  ngOnInit(): void {
  }

}
