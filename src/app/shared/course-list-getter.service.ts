import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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


  getSpecificTTBResponse(crsDes: string, session: string): Observable<PageableCourses> {
    const linkToCourse = `api/${session}/courses${crsDes.toUpperCase()}.json`;
    return this.http.get<PageableCourses>(linkToCourse);
  }

  /**
   * Condense all
   * @param crses a list of courses, which all of them must be sorted by the course code
   * @returns [[MAT135H1-F, MAT135H1-S], [MAT136H1-S]]
   */
  condenseCourses(crses: Course[]): Course[][] {
    let newCourseListSoFar: Course[][] = [];
    let previousCourseCode = "NOT A CODE RIGHT NOW";
    crses.forEach(c => {
      // course code + new course list so far
      if(c.code === previousCourseCode && newCourseListSoFar.length >= 1){
        let tcl = newCourseListSoFar[newCourseListSoFar.length - 1];
        tcl.push(c);
      } else {
        newCourseListSoFar.push([c]);
      }
      previousCourseCode = c.code;
    })
    return newCourseListSoFar;
  }

  

}
