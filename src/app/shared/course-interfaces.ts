
    export interface DayTimeOfWeek {
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
        start: DayTimeOfWeek;
        end: DayTimeOfWeek;
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

    export interface SectionNote {
        name: string;
        type: string;
        content: string;
    }


    export interface IndividualControl {
        code: string;
        name: string;
    }


    export interface EnrolmentControl {
        yearOfStudy: string;
        post: IndividualControl;
        subject: IndividualControl;
        subjectPost: IndividualControl;
        typeOfProgram: IndividualControl;
        designation: IndividualControl;
        primaryOrg: IndividualControl;
        associatedOrg: IndividualControl;
        secondOrg: IndividualControl;
        adminOrg: IndividualControl;
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
        subTitle?: string;
        cancelInd: string;
        waitlistInd: string;
        deliveryModes: DeliveryMode[];
        currentWaitlist: string;
        enrolmentInd: string;
        tbaInd: string;
        openLimitInd: string;
        notes: SectionNote[];
        enrolmentControls: EnrolmentControl[];
        linkedMeetingSections: LinkedMeetingSection[];
    }

    export interface LinkedMeetingSection {
        teachMethod: string;
        sectionNumber: string;
    }

    export interface CmCourseInfo {
        description?: string;
        title?: string;
        levelOfInstruction: string;
        prerequisitesText?: string;
        corequisitesText?: string;
        exclusionsText?: string;
        recommendedPreparation?: string;
        note?: any;
        division: string;
        breadthRequirements?: string[];
        distributionRequirements?: string[];
        publicationSections?: string[];
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
        breadthTypes?: BreadthType[];
    }

    export interface CourseNote {
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
        sections?: Section[];
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
        breadths?: Breadth[];
        notes?: CourseNote[];
        cancelInd: string;
        fullyOnline: string;
    }

    export interface PageableCourses {
        courses: Course[];
    }
