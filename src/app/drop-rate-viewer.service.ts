import { Injectable } from '@angular/core';
import { UtilitiesService } from './shared/utilities.service';
import { Observable, forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface DropInfo {
  d: number; // Drops
  o: number; // cutOff
}

type ReqRet = { session: string; dMap: [string, DropInfo][] };
type DropInfoMap = Map<string, Map<string, DropInfo>>;

@Injectable({
  providedIn: 'root',
})
export class DropRateViewerService {
  allData: DropInfoMap = new Map<string, Map<string, DropInfo>>();


  getDropInfo(session: string, code: string): DropInfo {

    if(!this.allData.has(session)){
      session = findLargestMatchingValue(Array.from(this.allData.keys()), (item) => item.charAt(item.length - 1) === session.charAt(session.length - 1)) ?? "20229";
    }

    // console.log(this.allData);
    return (this.allData.get(session)?.get(code)) ?? {
      d: 0, o: 0
    };
  }

  getAllData1(): Observable<ReqRet[]> {
    let requestList: Observable<ReqRet>[] = [];
    for (let item of this.constants.sessionsWithDrops) {
      const request1 = this.http.get<ReqRet>(`api/dropinfo/${item}_totals.json`);
      requestList.push(request1);
    }
    return forkJoin(requestList);
  }

  getAllData2(obsIn: Observable<ReqRet[]>): void {
    obsIn.subscribe({
      next: (item1) => {
        for (let item of item1) {
          this.allData.set(item.session, new Map(item.dMap));
        }
      },
      error: () => {},
      complete: () => {},
    });
  }

  constructor(private http: HttpClient, public constants: UtilitiesService) {
    this.getAllData2(this.getAllData1());
  }

  ngOnInit() {
    
  }
}


/**
 * Find the largest value in a list that matches the predicate.
 * @param list The list of values to search through.
 * @param predicate The function used to determine if a value matches the criteria.
 * @returns The largest value that matches the predicate, or `undefined` if no matches are found.
 */
function findLargestMatchingValue<T>(
  list: T[],
  predicate: (value: T) => boolean
): T | undefined {
  let largestMatch: T | undefined = undefined;

  for (const value of list) {
    if (predicate(value)) {
      if (!largestMatch || value > largestMatch) {
        largestMatch = value;
      }
    }
  }

  return largestMatch;
}