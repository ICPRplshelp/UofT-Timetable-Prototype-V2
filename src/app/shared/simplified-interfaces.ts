export interface Cellable {

    // this is used for cells that are occupied by one that is
    // slightly earlier. this is the only predicate
    // that an ngIf may check for.
    isOccupied: boolean;

    // this is used for unoccupied blank cells
    isEmpty: boolean;
    rowspan: number;  // the default is 1. if DNE, then it is 1.
    colspan: number;  // the default is 1. if DNE, then it is 1.
}

/**
 * The first hour of a meeting.
 */
export interface MeetingCell extends Cellable {
    start: number;  // 
    end: number;
    day: number;  // 0 for sunday, 6 for saturday
}

/**
 * A cell that has nothing scheduled on it
 */
export class EmptyCell implements Cellable {
    isOccupied: boolean = false;
    isEmpty: boolean = true;
    rowspan: number = 1;
    colspan: number = 1;
}

/**
 * A cell that has been occupied due to a class before it
 */
export class OccupiedCell implements Cellable {
    isOccupied: boolean = true;
    isEmpty: boolean = false;
    rowspan: number = 1;
    colspan: number = 1;
}
