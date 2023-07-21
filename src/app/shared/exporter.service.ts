import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { SelectedCoursesService } from '../selected-courses.service';
import { FinalCourseExport } from '../export-interfaces';
import { CourseListGetterService } from './course-list-getter.service';
import { Observable } from 'rxjs';
import { Course, PageableCourses } from './course-interfaces';
import { SectionSelection } from '../selectedclasses';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExporterService {

  exportCourses(): void {
    const cData = this.selectedCoursesService.buildCourseExports();
    const jsonString = JSON.stringify(cData);
    console.log(jsonString);
    const blob = new Blob([jsonString], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'timetablePrototypeCourses.json');
  }


  importCoursesFromString(importStr: string): void {
    try {
      const jsonData = JSON.parse(importStr) as FinalCourseExport;
      this.importCourses(jsonData);
    } catch (error) {
      console.log("I couldn't do it!!");
    }
  }


  importCourses(imports: FinalCourseExport): void {
    this.triggerFunction(imports.sessionCode);
    this.selectedCoursesService.clearSections();
    const desObs: Observable<PageableCourses[]> | null = this.crsGetterService.getManyDesginators(imports.depts, imports.sessionCode);
    if(desObs === null){
      return;
    }
    desObs.subscribe({
      next: (resp: PageableCourses[]) => {
        const nl: Course[] = [];
        resp.forEach((item) => {
          nl.push(...item.courses);
        });
        for(let crsSel of imports.courses){
          const targetCourse: Course | undefined = nl.find((crs) => {
            const c1 = crs.code === crsSel.code;
            const c2 = crs.sectionCode === crsSel.sectionCode;
            return c1 && c2;
          });
          if(targetCourse === undefined) continue;

          for(let lec of targetCourse.sections ?? []){
            if(crsSel.meetings.includes(lec.name)){
              this.selectedCoursesService.addSection(
                new SectionSelection(lec,
                  [targetCourse], targetCourse)
              );
            }
          }
        }
      },
      error: (err) => {
        console.log("Something went wrong");
      }
    })
  }
  private functionTrigger = new Subject<string>();

  getFunctionTriggerObservable() {
    return this.functionTrigger.asObservable();
  }

  triggerFunction(sectionCode: string) {
    this.functionTrigger.next(sectionCode);
  }


  constructor(private selectedCoursesService: SelectedCoursesService,
    private crsGetterService: CourseListGetterService) {}
}
