import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { BreadthRequirements, Course, TTBBase } from '../shared/course-interfaces';
import { CourseListGetterService } from '../shared/course-list-getter.service';
import { UtilitiesService } from '../shared/utilities.service';
import { TimingsComponent } from '../timings/timings.component';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit {

  constructor(private crsGetter: CourseListGetterService,
    public constants: UtilitiesService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.obtainEverything();

  }

  brDescs: string[] = ["No A&S breadths fullfilled",
"BR=1", "BR=2", "BR=3", "BR=4", "BR=5"];


  courseFilter: string = "CSC";  // this value is binded.
  lastSearchQuery: string = "";
  
  keyDownFunction(event: { keyCode: number; }) {
    if (event.keyCode === 13) {
      this.obtainEverything();
      // rest of your code
    }
  }
  
  errorMessage = "";

  courseList: Course[] = [];
  condensedCourseList: Course[][] = [];


  obtainEverything(): void {
    let temp: TTBBase;
    let courseListCandidate: Course[];
    if(this.courseFilter === this.lastSearchQuery){
      return;
    }
    this.crsGetter.getSpecificTTBResponse(this.courseFilter).subscribe(
      (data) => {
        temp = data;
      },
      (err) => {console.log(err);
      this.errorMessage = "First three letters of a course only!";},
      () => {
        courseListCandidate = temp.TTBResponse.payload.pageableCourse.courses.courses;
        this.courseList = courseListCandidate;
        console.log("Successfully constructed the course list");
        this.condensedCourseList = this.crsGetter.condenseCourses(courseListCandidate);
        console.log(this.condensedCourseList);
        this.errorMessage = "";
        this.lastSearchQuery = this.courseFilter;
        this.condensedCourseList.sort((cl1, cl2) => {
          let cr1 = cl1[0];
          let cr2 = cl2[0];
          let code1 = cr1.code;
          let code2 = cr2.code;
          // for both strings above - move the last character to the first
          code1 = code1.substring(code1.length - 1) + code1.substring(0, code1.length - 1);
          code2 = code2.substring(code2.length - 1) + code2.substring(0, code2.length - 1);
          return code1.localeCompare(code2);
        });
      }
    );
  }

  /**
   * 
   * @param term F, S, or Y
   * @param coursePack a list of courses
   * @returns whether a course in this list is offered in term.
   */
  isThisCourseOfferedInThisTerm(term: string, coursePack: Course[]): boolean {
    for(let crs of coursePack){
      if(crs.sectionCode.toUpperCase() === term){
        return true;
      }
    }
    return false;
  }

  utscBrStrs = ["Literature", "Behavio", "History", "Natural", "Quant"];


  canShowDescriptions: Set<String> = new Set<String>();
  
  canShow: any = {};


  addToCanShowDescriptions(crsCode: string): void{
    if(this.canShow[crsCode] === true){
      this.canShow[crsCode] = false;
    } else {

    this.canShow[crsCode] = true;
    }

    console.log(this.canShow);
  }

  isNullOrEmpty(text: string): boolean {
    return text === null || text === undefined || text === "";
  }

  checkCanShowDescription(crsCode: string): boolean{
    let state =  this.canShow[crsCode] === true;
    // console.log(state);
    return state;
  }
  
  getDesc(crs: Course){
    const crsInfo = crs.cmCourseInfo;
    if(crsInfo === null || crsInfo == undefined){
      return "";
    }

    const desc = crsInfo.description;
    if(desc === null || desc === undefined){
      return "A description was not provided for this course.";
    }
    return desc;
  }

  getPrq(crs: Course){
    const crsInfo = crs.cmCourseInfo;
    if(crsInfo === null || crsInfo == undefined){
      return "";
    }

    const desc = crsInfo.prerequisitesText;
    if(desc === null || desc === undefined){
      return "";
    }
    return desc;
  }


  getCrq(crs: Course){
    const crsInfo = crs.cmCourseInfo;
    if(crsInfo === null || crsInfo == undefined){
      return "";
    }

    const desc = crsInfo.corequisitesText;
    if(desc === null || desc === undefined){
      return "";
    }
    return desc;
  }
  
  getExc(crs: Course){
    const crsInfo = crs.cmCourseInfo;
    if(crsInfo === null || crsInfo == undefined){
      return "";
    }

    const desc = crsInfo.exclusionsText;
    if(desc === null || desc === undefined){
      return "";
    }
    return desc;
  }


  whatBreadths2(brStuffTemp: any){
    if(brStuffTemp === undefined || brStuffTemp === null){
      return [0];
    }
    let brStuff = JSON.stringify(brStuffTemp);
    let brq: number[] = [];
    for(let i = 1; i <= 5; i++){
      if(brStuff.includes(i.toString())){
        brq.push(i);
      }
    }
    // console.log(brStuff, brq);


    // if brq is empty add 0 to it
    if(brq.length === 0){
      brq.push(0);
    }

    return brq;
  }


  openCourseDialog(coursePack: Course[]): void{
    if(coursePack.length === 0){
      console.log("No meetings!!!");
      return;
    }

    const dialogConfig = new MatDialogConfig();
    // const dialogWidth = 600 * Math.max(coursePack.length, 1);
    dialogConfig.data = {courses: coursePack};
    const dialogRef = this.dialog.open(TimingsComponent, dialogConfig);

  }

  whatBreadths(brqStr: string | string[] | BreadthRequirements | undefined): number[]{
    // for the numbers 1, 2, 3, 4, 5, if they appear in
    // brqStr, then return them.

    // if brqStr is an array of strings, then make it a string by joining the array
    // if brqStr is undefined return an empty array
    if(brqStr === undefined){
      return [0];
    }
    
    brqStr = brqStr?.toString();
    
    
    if(Array.isArray(brqStr)){
      brqStr = brqStr.join("");
    }


    let brq: number[] = [];
    for(let i = 1; i <= 5; i++){
      if(brqStr.includes(i.toString())){
        brq.push(i);
      }
    }
    

    

    // if brq is an empty array then add 0 to it
    if(brq.length === 0){
      
      brq = [0];
    }
    console.log(brq);
    return brq;
  }

  whatLevel(crsCode: string): number{
    let thirdChar = crsCode[3];
    // if thirdChar is a number, then return it.
    if(thirdChar >= '0' && thirdChar <= '9'){
      return parseInt(thirdChar);
    }
    // otherwise, if thirdChar is a letter, then return its number equivalent - A = 1, B = 2, and so on.
    else{
      return thirdChar.charCodeAt(0) - 65 + 1;
    }
  }

}
