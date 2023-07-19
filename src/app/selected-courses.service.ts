import { Injectable } from '@angular/core';
import { SectionSelection } from './selectedclasses';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectedCoursesService {

  addedSections: SectionSelection[] = [];


  /**
   * Resets all added sections.
   */
  clearSections(): void {
    this.addedSections = [];
  }

  /**
   * Adds a section. Returns true if successful.
   */
  addSection(sectionSelection: SectionSelection): boolean {
    if(this.addedSections.every(item => !(item.equals(sectionSelection)))){
      // branch if sectionSelection isn't added already
      this.addedSections.push(sectionSelection);
      this._requestUpdateTimetable();
      return true;
    } else {
      console.log("Section already added!");
      return false;  // section was already added!
    }

  }

  /**
   * Removes a section. Returns true if a section was successfully removed.
   */
  removeSection(sectionSelection: SectionSelection): boolean {
    const idx = this.addedSections.findIndex(item => item.equals(sectionSelection));
    if(idx === -1){
      return false;
    } else {
      this.addedSections.splice(idx, 1);
      this._requestUpdateTimetable();
      return true;
    }
  }

  private methodCallSource = new Subject<void>();
  methodCalled$ = this.methodCallSource.asObservable();
  

  checkEnrolled(sectionSelection: SectionSelection): boolean {
    const idx = this.addedSections.findIndex(item => item.equals(sectionSelection));
    return idx !== -1;
  }

  _requestUpdateTimetable(): void {
    this.methodCallSource.next()
  }




  constructor() { 

  }
}
