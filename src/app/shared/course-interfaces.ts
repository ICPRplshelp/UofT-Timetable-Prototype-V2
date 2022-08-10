export interface TTBBase {
    TTBResponse: TTBResponse;
}

export interface TTBResponse {
    payload: Payload;
    status:  TTBResponseStatus;
}

export interface Payload {
    pageableCourse:    PageableCourse;
    divisionalLegends: DivisionalLegends;
}

export interface DivisionalLegends {
    APSC:  string;
    MUSIC: string;
    ERIN:  string;
    SCAR:  string;
    ARTSC: string;
    ARCLA: string;
}

export interface PageableCourse {
    courses:   Courses;
    total:     string;
    page:      string;
    pageSize:  string;
    direction: string;
}

export interface Courses {
    courses: Course[];
}

export interface Course {
    id:                 string;
    name:               string;
    ucName:             string;
    code:               string;
    sectionCode:        string;
    campus:             Campus;
    sessions:           SessionsClass;
    sections:           CourseSections;
    duration:           string;
    cmCourseInfo:       CMCourseInfo;
    created:            Created;
    modified:           string;
    lastSaved:          string;
    primaryTeachMethod: TeachMethod;
    faculty:            Department;
    coSec:              string;
    department:         Department;
    title:              string;
    maxCredit:          string;
    minCredit:          string;
    breadths:           PurpleBreadths | string;
    notes:              PurpleNotes | string;
    cancelInd:          CancelIndEnum;
    fullyOnline:        string;
}

export interface PurpleBreadths {
    breadths: Breadth[] | FluffyBreadths;
}

export interface Breadth {
    org:          Department;
    breadthTypes: BreadthTypesClass;
}

export interface BreadthTypesClass {
    breadthTypes: BreadthType[] | BreadthType;
}

export interface BreadthType {
    type:        BreadthTypesType;
    description: DistributionRequirements;
    code:        BreadthTypesCode;
}

export enum BreadthTypesCode {
    Arts = "Arts",
    Br1 = "BR=1",
    Br3 = "BR=3",
    Br5 = "BR=5",
    Hum = "Hum",
    SSc = "SSc",
    Sci = "Sci",
    SocBeh = "SocBeh",
}

export enum DistributionRequirements {
    ArtsLiteratureLanguage = "Arts, Literature & Language",
    BR1CreativeAndCulturalRepresentation = "BR=1 Creative and Cultural Representation",
    BR3SocietyAndItsInstitutions = "BR=3 Society and Its Institutions",
    BR5ThePhysicalAndMathematicalUniverses = "BR=5 The Physical and Mathematical Universes",
    Humanities = "Humanities",
    Science = "Science",
    SocialBehaviouralSciences = "Social & Behavioural Sciences",
    SocialScience = "Social Science",
}

export enum BreadthTypesType {
    ArtsLitLang = "Arts Lit & Lang",
    CreativeCultural = "Creative Cultural",
    Humanities = "Humanities",
    PhysicalUniverse = "Physical Universe",
    Science = "Science",
    SocialBehavioural = "Social & Behavioural",
    SocialScience = "Social Science",
    SocietyInstitutions = "Society Institutions",
}

export interface Department {
    code: CollaborativeOrgGroupCodeEnum;
    name: DepartmentName;
}

export enum CollaborativeOrgGroupCodeEnum {
    Acmsc = "ACMSC",
    Apsc = "APSC",
    Arcla = "ARCLA",
    Artsc = "ARTSC",
    AsNdegb = "AS   NDEGB",
    Asmaj0608 = "ASMAJ0608",
    Asspe0608 = "ASSPE0608",
    Cmssc = "CMSSC",
    Code = "",
    Empty = "*",
    Erin = "ERIN",
    Esc = "ESC",
    Scar = "SCAR",
    Sgs = "SGS",
    Stat = "STAT",
    Wdw = "WDW",
}

export enum DepartmentName {
    AcademicBridgingProgram = "Academic Bridging Program",
    ActuarialScienceMajor = "Actuarial Science Major",
    ActuarialScienceSpecialist = "Actuarial Science Specialist",
    All = "All",
    DepartmentOfStatisticalSciences = "Department of Statistical Sciences",
    DeptOfArtsCultureMediaUTSC = "Dept. of Arts, Culture & Media (UTSC)",
    DeptOfComputerMathematicalSciUTSC = "Dept. of Computer & Mathematical Sci (UTSC)",
    DivisionOfEngineeringScience = "Division of Engineering Science",
    Empty = "",
    FacultyOfAppliedScienceEngineering = "Faculty of Applied Science & Engineering",
    FacultyOfArtsAndScience = "Faculty of Arts and Science",
    JohnHDanielsFacultyOfArchitectureLandscapeDesign = "John H. Daniels Faculty of Architecture, Landscape, & Design",
    SchoolOfGraduateStudies = "School of Graduate Studies",
    UniversityOfTorontoMississauga = "University of Toronto Mississauga",
    UniversityOfTorontoScarborough = "University of Toronto Scarborough",
    WoodsworthCollege = "Woodsworth College",
}

export interface FluffyBreadths {
    org:          Department;
    breadthTypes: BreadthTypesClass | string;
}

export enum Campus {
    Scarborough = "Scarborough",
    StGeorge = "St. George",
}

export enum CancelIndEnum {
    Empty = "",
    N = "N",
}

export interface CMCourseInfo {
    description:               string;
    title:                     string;
    levelOfInstruction:        LevelOfInstruction;
    prerequisitesText:         string;
    corequisitesText:          string;
    exclusionsText:            string;
    recommendedPreparation:    RecommendedPreparation;
    note:                      string;
    division:                  Division;
    breadthRequirements?:      BreadthRequirements | string[] | string;
    distributionRequirements?: DistributionRequirementsClass;
    publicationSections:       PublicationSectionsClass;
}

export interface BreadthRequirements {
    breadthRequirements: string[] | string;
}

export interface DistributionRequirementsClass {
    distributionRequirements: DistributionRequirements[] | DistributionRequirements;
}

export enum Division {
    AppliedScienceEngineeringFacultyOf = "Applied Science & Engineering, Faculty of",
    ArtsAndScienceFacultyOf = "Arts and Science, Faculty of",
    UniversityOfTorontoScarborough = "University of Toronto Scarborough",
}

export enum LevelOfInstruction {
    Undergraduate = "undergraduate",
}

export interface PublicationSectionsClass {
    publicationSections: string[] | PublicationSectionsEnum;
}

export enum PublicationSectionsEnum {
    AcademicBridgingProgram = "Academic Bridging Program",
    ActuarialScience = "Actuarial Science",
    ArtsCultureAndMedia = "Arts, Culture and Media",
    EngineeringScience = "Engineering Science",
    Statistics = "Statistics",
}

export enum RecommendedPreparation {
    ACT370H1StronglyRecommended = "ACT370H1 strongly recommended",
    Empty = "",
    Phy180H1 = "PHY180H1",
}

export enum Created {
    The20220807012221024 = "2022-08-07@01:22:21.024",
    The20220807012221025 = "2022-08-07@01:22:21.025",
    The20220807012221026 = "2022-08-07@01:22:21.026",
    The20220807012221027 = "2022-08-07@01:22:21.027",
    The20220807012221028 = "2022-08-07@01:22:21.028",
    The20220807012221029 = "2022-08-07@01:22:21.029",
    The20220807012221030 = "2022-08-07@01:22:21.030",
    The20220807012221031 = "2022-08-07@01:22:21.031",
}

export interface PurpleNotes {
    notes: FluffyNotes;
}

export interface FluffyNotes {
    name:    NotesName;
    type:    NotesType;
    content: string;
}

export enum NotesName {
    CourseNote = "Course Note",
    SectionNote = "Section Note",
}

export enum NotesType {
    Course = "COURSE",
    Section = "SECTION",
}

export enum TeachMethod {
    Lec = "LEC",
    Pra = "PRA",
    Tut = "TUT",
}

export enum SectionCode {
    F = "F",
    S = "S",
    Y = "Y",
}

export interface CourseSections {
    sections: Section[] | Section;
}

export interface Section {
    name:              string;
    type:              SectionType;
    teachMethod:       TeachMethod;
    sectionNumber:     string;
    meetingTimes:      MeetingTimesClass;
    firstMeeting:      string;
    instructors:       PurpleInstructors | string;
    currentEnrolment:  string;
    maxEnrolment:      string;
    subTitle:          string;
    cancelInd:         CancelIndEnum;
    waitlistInd:       WaitlistIndEnum;
    deliveryModes:     SectionDeliveryModes;
    currentWaitlist:   string;
    enrolmentInd:      EnrolmentInd;
    tbaInd:            CancelIndEnum;
    openLimitInd:      CancelIndEnum;
    notes:             PurpleNotes;
    enrolmentControls: EnrolmentControlsClass | string;
}

export interface SectionDeliveryModes {
    deliveryModes: DeliveryMode;
}

export interface DeliveryMode {
    session: string;
    mode:    Mode;
}

export enum Mode {
    Inper = "INPER",
}

export interface EnrolmentControlsClass {
    enrolmentControls: EnrolmentControl[] | EnrolmentControl;
}

export interface EnrolmentControl {
    yearOfStudy:               CollaborativeOrgGroupCodeEnum;
    post:                      Department;
    subject:                   Department;
    subjectPost:               Department;
    typeOfProgram:             Department;
    designation:               Department;
    primaryOrg:                Department;
    associatedOrg:             Department;
    secondOrg:                 Department;
    adminOrg:                  Department;
    collaborativeOrgGroupCode: CollaborativeOrgGroupCodeEnum;
    quantity:                  string;
    sequence:                  string;
}

export enum EnrolmentInd {
    Empty = "",
    R1 = "R1",
}

export interface PurpleInstructors {
    instructors: Instructor;
}

export interface Instructor {
    firstName: string;
    lastName:  string;
}

export interface MeetingTimesClass {
    meetingTimes: MeetingTime[] | MeetingTime;
}

export interface MeetingTime {
    start:          End;
    end:            End;
    building:       Building;
    sessionCode:    string;
    repetition:     Repetition;
    repetitionTime: RepetitionTime;
}

export interface Building {
    buildingCode:       string;
    buildingRoomNumber: string;
    buildingUrl:        string;
    buildingName:       string;
}

export interface End {
    day:         string;
    millisofday: string;
}

export enum Repetition {
    BIWeekly = "BI_WEEKLY",
    Weekly = "WEEKLY",
}

export enum RepetitionTime {
    FirstAndThirdWeek = "FIRST_AND_THIRD_WEEK",
    OnceAWeek = "ONCE_A_WEEK",
    SecondAndFourthWeek = "SECOND_AND_FOURTH_WEEK",
}

export enum SectionType {
    Lecture = "Lecture",
    Practical = "Practical",
    Tutorial = "Tutorial",
}

export enum WaitlistIndEnum {
    N = "N",
    Y = "Y",
}

export interface SectionsSectionsClass {
    name:              SectionsName;
    type:              SectionType;
    teachMethod:       TeachMethod;
    sectionNumber:     string;
    meetingTimes:      MeetingTimesClass | string;
    firstMeeting:      string;
    instructors:       FluffyInstructors | string;
    currentEnrolment:  string;
    maxEnrolment:      string;
    subTitle:          string;
    cancelInd:         CancelIndEnum;
    waitlistInd:       WaitlistIndEnum;
    deliveryModes:     SectionsDeliveryModes;
    currentWaitlist:   string;
    enrolmentInd:      string;
    tbaInd:            WaitlistIndEnum;
    openLimitInd:      OpenLimitInd;
    notes:             PurpleNotes | string;
    enrolmentControls: EnrolmentControlsClass | string;
}

export interface SectionsDeliveryModes {
    deliveryModes: DeliveryMode[] | DeliveryMode;
}

export interface FluffyInstructors {
    instructors: Instructor[] | Instructor;
}

export enum SectionsName {
    Lec01 = "LEC01",
    Lec0101 = "LEC0101",
    Lec5101 = "LEC5101",
    Pra0101 = "PRA0101",
    Tut0101 = "TUT0101",
}

export enum OpenLimitInd {
    C = "C",
    N = "N",
}

export interface SessionsClass {
    sessions: string[] | string;
}

export interface TTBResponseStatus {
    status: StatusStatus;
}

export interface StatusStatus {
    code:    string;
    message: string;
}