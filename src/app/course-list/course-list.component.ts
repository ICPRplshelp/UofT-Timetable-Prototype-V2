import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {Breadth, Course, PageableCourses, Section} from '../shared/course-interfaces';
import {CourseListGetterService} from '../shared/course-list-getter.service';
import {UtilitiesService} from '../shared/utilities.service';
import {TimingsComponent} from '../timings/timings.component';

@Component({
    selector: 'app-course-list',
    templateUrl: './course-list.component.html',
    styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit {

    constructor(private crsGetter: CourseListGetterService,
                public constants: UtilitiesService,
                public dialog: MatDialog) {
    }

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
        let temp: PageableCourses;
        let courseListCandidate: Course[];
        if (this.courseFilter === this.lastSearchQuery) {
            return;
        }
        this.crsGetter.getSpecificTTBResponse(this.courseFilter).subscribe(
            (data) => {
                temp = data;
            },
            (err) => {
                console.log(err);
                this.errorMessage = "First three letters of a course only!";
            },
            () => {
                courseListCandidate = temp.courses;
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
        for (let crs of coursePack) {
            if (crs.sectionCode.toUpperCase() === term) {
                return true;
            }
        }
        return false;
    }

    utscBrStrs = ["Literature", "Behavio", "History", "Natural", "Quant"];


    canShowDescriptions: Set<String> = new Set<String>();

    canShow: any = {};


    addToCanShowDescriptions(crsCode: string): void {
        this.canShow[crsCode] = this.canShow[crsCode] !== true;

        console.log(this.canShow);
    }

    isNullOrEmpty(text: string): boolean {
        return text === null || text === undefined || text === "";
    }

    checkCanShowDescription(crsCode: string): boolean {
        // console.log(state);
        return this.canShow[crsCode] === true;
    }

    getDesc(crs: Course) {
        const crsInfo = crs.cmCourseInfo;
        if (crsInfo === null || crsInfo === undefined) {
            return "";
        }

        const desc = crsInfo.description;
        if (desc === null || desc === undefined) {
            return "A description was not provided for this course.";
        }
        return desc;
    }

    getPrq(crs: Course) {
        return crs.cmCourseInfo.prerequisitesText;
    }


    getCrq(crs: Course) {
        return crs.cmCourseInfo.corequisitesText;
    }


    getExc(crs: Course) {
        return crs.cmCourseInfo.exclusionsText;
    }


    whatBreadths2(brStuffTemp: Breadth[]): number[] {
        if(brStuffTemp === null || brStuffTemp === undefined){
            return [];
        }
        let breadthsSoFar: number[] = [];
        for (let br of brStuffTemp) {
            if(br.breadthTypes === null || br.breadthTypes === undefined){
                continue;
            }
            br.breadthTypes.forEach(bt => {
                if(bt === null || bt === undefined){
                    return;
                }
                if(bt.code === null || bt.code === undefined){
                    return ;
                }
                for (let num of [1, 2, 3, 4, 5]) {
                    if (bt.code.includes(num.toString())) {
                        breadthsSoFar.push(num);
                    }
                }
            })
        }
        if(breadthsSoFar.length === 0)
            return [0];
        return breadthsSoFar;
    }


    openCourseDialog(coursePack: Course[]): void {
        if (coursePack.length === 0) {
            console.log("No meetings!!!");
            return;
        }

        const dialogConfig = new MatDialogConfig();
        // const dialogWidth = 600 * Math.max(coursePack.length, 1);
        dialogConfig.data = {courses: coursePack};
        const dialogRef = this.dialog.open(TimingsComponent, dialogConfig);

    }

    whatLevel(crsCode: string): number {
        let thirdChar = crsCode[3];
        // if thirdChar is a number, then return it.
        if (thirdChar >= '0' && thirdChar <= '9') {
            return parseInt(thirdChar);
        }
        // otherwise, if thirdChar is a letter, then return its number equivalent - A = 1, B = 2, and so on.
        else {
            return thirdChar.charCodeAt(0) - 65 + 1;
        }
    }


    onlineModes = ['SYNC', 'SYNIF', 'SYNCIF', 'OLNSYNC',
        'ASYNC', 'ASYIF', 'ASYNIF'];


    oneHasOnline(crses: Course[]): boolean {
        for (let crs of crses) {
            if (this.hasOnline(crs)) {
                return true;
            }
        }
        return false;
    }

    hasOnline(crs: Course) {
        let secs = crs.sections;
        for (let sec of secs) {
            let deliv = this.getDeliveryMode(sec);
            if (sec.name.startsWith("LEC") && this.onlineModes.includes(deliv)) {
                return true;
            }

        }
        return false;
    }

    getDeliveryMode(sec: Section): string {
        return sec.deliveryModes[0].mode
    }


}
