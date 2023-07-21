export interface CourseSelectionExport {
    code: string;
    sectionCode: string;
    meetings: string[];
}

export interface FinalCourseExport {
    sessionCode: string;

    depts: string[];
    courses: CourseSelectionExport[];
}

// return {
//     depts: Array.from(depts),
//     courses: cse
//   };