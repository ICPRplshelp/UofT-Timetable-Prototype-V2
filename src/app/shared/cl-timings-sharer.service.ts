import { Injectable } from '@angular/core';
import {Course} from "./course-interfaces";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ClTimingsSharerService {

  constructor() { }
  private dataSubject = new BehaviorSubject<Course[]>([]);

  getData() {
    return this.dataSubject.asObservable();
  }

  setData(data: Course[]) {
    this.dataSubject.next(data);
  }

}
