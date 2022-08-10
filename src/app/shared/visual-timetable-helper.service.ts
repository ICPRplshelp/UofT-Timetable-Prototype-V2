import { Injectable } from '@angular/core';
import {
  Cellable,
  EmptyCell,
  MeetingCell,
  OccupiedCell,
} from './simplified-interfaces';

@Injectable({
  providedIn: 'root',
})
export class VisualTimetableHelperService {
  constructor() {}

  /**
   * Group meeting cells by groups that don't conflict
   * @param items a list of meeting cells. They all occur on the same day.
   * @returns
   */
  organizeDayMeetingCells(items: MeetingCell[]): MeetingCell[][] {
    let newMeetingCells: MeetingCell[][] = [];
    while (items.length !== 0) {
      newMeetingCells.push(this.solveIntervalSchedulingProblem(items));
    }
    return newMeetingCells;
  }

  /**
   *
   * @param items2 for each item in items2, none may conflict
   */
  generateDayStrip(items2: MeetingCell[][]): Cellable[][] {
    let newDayStrip: Cellable[][] = [];
    for (let i = 0; i < items2.length; i++) {
      newDayStrip.push(this.generateEmptyStrip());
    }
    // start with the last day strip, and begin working backwards
    // units are always 30 minutes long
    for (let i = items2.length - 1; i >= 0; i--) {
      let currentStrip = newDayStrip[i];
      // this runs once per meeting cell
      // so inside this loop, we are concerend about a single meeting cell
      for (let mc of items2[i]) {
        let startTime = mc.start;
        let endTime = mc.end;
        let duration = endTime - startTime; // this is the rowspan
        mc.rowspan = duration;
        mc.colspan = 1;

        // add the "MEETING CELL" into the current strip's start time
        currentStrip[startTime] = mc;
        // fill the rest with occupied cells
        for (let j = startTime + 1; j < endTime; j++) {
          currentStrip[j] = new OccupiedCell();
        }
        // stretch the occupied cells if applicable

        for (let k = i; i < items2.length; k++) {
          let targetDayStrip = newDayStrip[k];
          let proceed = true;
          // this loop will run at least once.
          for (let m = startTime; m < endTime; m++) {
            if (!targetDayStrip[m].isEmpty) {
              proceed = false;
              break;
            }
          }
          if (proceed) {
            for (let m = startTime; m < endTime; m++) {
              targetDayStrip[m] = new OccupiedCell();
            }
            // add 1 to the colspan, because everything was occupied
            mc.colspan = mc.colspan + 1;
          }
        }
        // end of inside a single meeting cell
      }
    }
    // attempt to stretch the existing daystrips
    let transposedNewDayStrip = newDayStrip.map((_, i) =>
      newDayStrip.map((row) => row[i])
    );
    for (let hCol of transposedNewDayStrip) {
      let runList: number[][] = [];
      // find all runs and add it to runList, where the predicate is x => x.isEmpty
      for (let i = 0; i < hCol.length; i++) {
        if (hCol[i].isEmpty) {
          let run: number[] = [];
          for (let j = i; j < hCol.length; j++) {
            // every time j goes up by 1, so does i
            if (hCol[j].isEmpty) {
              run.push(j);
              i++;
            } else {
              break;
            }
          }
          runList.push(run);
        }

        for (let run of runList) {
          let iter = 0;
          for (let r of run) {
            if (iter === 0) {
              let curInd: number = r;
              if (iter === 0) {
                hCol[curInd].colspan = runList.length;
                iter++;
                continue;
              }
              hCol[curInd] = new OccupiedCell();
              iter++;
            }
          }
        }
      }
    }

    return newDayStrip;
  }

  generateEmptyStrip(): Cellable[] {
    let newCell: Cellable[] = [];
    for (let i = 0; i < 48; i++) {
      newCell.push(new EmptyCell());
    }
    return newCell;
  }

  /**
   * Solve the interval schedule problem.
   * @param items a list of meeting cells
   * @return one of the largest possible subset
   * of items where all of them are disjoint. MeetingCell
   * has start and end properities. Remove all of them from items
   * before returning.
   */
  solveIntervalSchedulingProblem(items: MeetingCell[]): MeetingCell[] {
    // sort the items by start time
    items.sort((a, b) => a.start - b.start);
    let result: MeetingCell[] = [];
    let currentEnd = 0;
    let removableIndices: number[] = [];
    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      // if this course starts at or later than the end time of the prev course
      if (item.start >= currentEnd) {
        result.push(item);
        currentEnd = item.end;
        removableIndices.push(i);
      }
    }
    // remove all indices in removableIndices from items
    for (let i = removableIndices.length - 1; i >= 0; i--) {
      items.splice(removableIndices[i], 1);
    }
    return result;
  }
}
