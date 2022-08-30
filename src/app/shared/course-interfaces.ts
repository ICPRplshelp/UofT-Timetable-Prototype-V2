
    export interface Start {
        day: string;
        millisofday: string;
    }

    export interface End {
        day: string;
        millisofday: string;
    }

    export interface Building {
        buildingCode: string;
        buildingRoomNumber: string;
        buildingUrl: string;
        buildingName?: any;
    }

    export interface MeetingTime {
        start: Start;
        end: End;
        building: Building;
        sessionCode: string;
        repetition: string;
        repetitionTime: string;
    }

    export interface Instructor {
        firstName: string;
        lastName: string;
    }

    export interface DeliveryMode {
        session: string;
        mode: string;
    }

    export interface Note {
        name: string;
        type: string;
        content: string;
    }

    export interface Post {
        code: string;
        name: string;
    }

    export interface Subject {
        code: string;
        name: string;
    }

    export interface SubjectPost {
        code: string;
        name: string;
    }

    export interface TypeOfProgram {
        code: string;
        name: string;
    }

    export interface Designation {
        code: string;
        name: string;
    }

    export interface PrimaryOrg {
        code: string;
        name: string;
    }

    export interface AssociatedOrg {
        code: string;
        name: string;
    }

    export interface SecondOrg {
        code: string;
        name: string;
    }

    export interface AdminOrg {
        code: string;
        name: string;
    }

    export interface EnrolmentControl {
        yearOfStudy: string;
        post: Post;
        subject: Subject;
        subjectPost: SubjectPost;
        typeOfProgram: TypeOfProgram;
        designation: Designation;
        primaryOrg: PrimaryOrg;
        associatedOrg: AssociatedOrg;
        secondOrg: SecondOrg;
        adminOrg: AdminOrg;
        collaborativeOrgGroupCode: string;
        quantity: string;
        sequence: string;
    }

    export interface Section {
        name: string;
        type: string;
        teachMethod: string;
        sectionNumber: string;
        meetingTimes: MeetingTime[];
        firstMeeting?: any;
        instructors: Instructor[];
        currentEnrolment: string;
        maxEnrolment: string;
        subTitle?: any;
        cancelInd: string;
        waitlistInd: string;
        deliveryModes: DeliveryMode[];
        currentWaitlist: string;
        enrolmentInd: string;
        tbaInd: string;
        openLimitInd: string;
        notes: Note[];
        enrolmentControls: EnrolmentControl[];
    }

    export interface CmCourseInfo {
        description: string;
        title: string;
        levelOfInstruction: string;
        prerequisitesText: string;
        corequisitesText?: any;
        exclusionsText: string;
        recommendedPreparation: string;
        note?: any;
        division: string;
        breadthRequirements: string[];
        distributionRequirements: string[];
        publicationSections: string[];
    }

    export interface Faculty {
        code: string;
        name: string;
    }

    export interface Department {
        code: string;
        name: string;
    }

    export interface Org {
        code: string;
        name: string;
    }

    export interface BreadthType {
        type: string;
        description: string;
        code: string;
    }

    export interface Breadth {
        org: Org;
        breadthTypes: BreadthType[];
    }

    export interface Note2 {
        name: string;
        type: string;
        content: string;
    }

    export interface Course {
        id: string;
        name: string;
        ucName?: string;
        code: string;
        sectionCode: string;
        campus: string;
        sessions: string[];
        sections: Section[];
        duration?: string;
        cmCourseInfo: CmCourseInfo;
        created: string;
        modified?: string;
        lastSaved: string;
        primaryTeachMethod: string;
        faculty: Faculty;
        coSec?: any;
        department: Department;
        title?: string;
        maxCredit: string;
        minCredit: string;
        breadths: Breadth[];
        notes: Note2[];
        cancelInd: string;
        fullyOnline: string;
    }

    export interface PageableCourses {
        courses: Course[];
    }
