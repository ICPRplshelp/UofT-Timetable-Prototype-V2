import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import {HttpClient} from '@angular/common/http';
import { PageableCourses, Course } from './course-interfaces';
import { switchMap } from "rxjs/operators";




@Injectable({
  providedIn: 'root'
})
export class CourseListGetterService {

  constructor(private http: HttpClient) { }
  
  pathToCourseList = "api/UTCourses.json";

  // create a method that does an HTTP GET request as an observable using HTTPClient
  /**
   * I need the entire TTB
   * @returns {Observable<any>} an observable of the HTTP GET request
   */
  getTTBResponse(): Observable<PageableCourses> {
    return this.http.get<PageableCourses>(this.pathToCourseList);
  }


  getSpecificTTBResponse(crsDes: string, session: string): null | Observable<PageableCourses> {
    if(!(session.match(/^\d{5}$/) && crsDes.match(/^[a-zA-Z]{3}$/))){
      return null;
    }
    const linkToCourse = `api/${session}/courses${crsDes.toUpperCase()}.json`;
    return this.http.get<PageableCourses>(linkToCourse);
  }

  /**
   * Condense all
   * @param crses a list of courses, which all of them must be sorted by the course code
   * @returns [[MAT135H1-F, MAT135H1-S], [MAT136H1-S]]
   */
  condenseCourses(crses: Course[]): Course[][] {
    crses.sort((a, b) => {
      return a.code.localeCompare(b.code);
    });
    let newCourseListSoFar: Course[][] = [];
    let previousCourseCode = "NOT A CODE RIGHT NOW";
    let previousCourseTitle: string | undefined = "NOT A TITLE RIGHT NOW";
    crses.forEach(c => {
      // course code + new course list so far
      // console.log(c.name, previousCourseTitle);
      if(c.code === previousCourseCode && c.name === previousCourseTitle &&
        newCourseListSoFar.length >= 1){
        let tcl = newCourseListSoFar[newCourseListSoFar.length - 1];
        tcl.push(c);
      } else {
        newCourseListSoFar.push([c]);
      }
      previousCourseCode = c.code;
      previousCourseTitle = c.name;
    })
    return newCourseListSoFar;
  }


  readonly MAX_DESGINATORS = 35;
  /**
   * To prevent excessive request, you can only request up to 15 desginators at a time,
   * and the desginator list will always have duplicates removed.
   * @param cDesList list of course desginators
   * @param session the session I am targeting
   * @returns observable of all combined fetches
   */
  getManyDesginators(cDesList: string[], session: string): null | Observable<PageableCourses[]> {
    cDesList = Array.from(new Set<string>(cDesList)).slice(0, this.MAX_DESGINATORS);

    const requestList: (Observable<PageableCourses> | null)[] = cDesList.map(cCode => {
      return this.getSpecificTTBResponse(cCode, session)
    });
    const noNullRequestList: Observable<PageableCourses>[] = [];
    for(let val of requestList){
      if(val !== null){
        noNullRequestList.push(val);
      }
    }
    return forkJoin(noNullRequestList);
  }
}
