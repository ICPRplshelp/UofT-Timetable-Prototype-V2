import { Injectable } from '@angular/core';

export type SessionInfo = {
  sessionName: string,
  sessionUrl: string
}


@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  courseListOnly: boolean = false;
  is24hour: boolean = true;
  hideSpecial: boolean = false;
  readonly enableTimetableBuilder: boolean = true;
  oneSectionAtATime: boolean = true;
  smallScreenThreshold: number = 768;
  displayCourseList: boolean = true;
  // brColors: string[] = [
  //   '#474545',  // no breath requirement
  //   '#d71a1a',  // br1
  //   '#34e7ff',
  //   '#ffd300',
  //   '#0ddc09',
  //   '#bb4bff'   // br5
  // ];

  /**
   * When updating the drop directory, you must add these here
   */
  sessionsWithDrops: string[] = ['20229', '20235', '20239', '20245', '20249'];
  allSessions: SessionInfo[] = [
    {
      sessionName: 'Fall-Winter 2016-2017',
      sessionUrl: '20169'
    },
    {
      sessionName: 'Summer 2017',
      sessionUrl: '20175'
    },
    {
      sessionName: 'Fall-Winter 2017-2018',
      sessionUrl: '20179'
    },
    {
      sessionName: 'Summer 2018',
      sessionUrl: '20185'
    },
    {
      sessionName: 'Fall-Winter 2018-2019',
      sessionUrl: '20189'
    },
    {
      sessionName: 'Summer 2019',
      sessionUrl: '20195'
    },
    {
      sessionName: 'Fall-Winter 2019-2020',
      sessionUrl: '20199'
    },
    {
      sessionName: 'Summer 2020',
      sessionUrl: '20205'
    },
    {
      sessionName: 'Fall-Winter 2020-2021',
      sessionUrl: '20209'
    },
    {
      sessionName: 'Summer 2021',
      sessionUrl: '20215'
    },
    {
      sessionName: 'Fall-Winter 2021-2022',
      sessionUrl: '20219'
    },
    {
      sessionName: 'Summer 2022',
      sessionUrl: '20225'
    },
    {
      sessionName: 'Fall-Winter 2022-2023',
      sessionUrl: '20229'
    },
    {
      sessionName: 'Summer 2023',
      sessionUrl: '20235'
    },
    {
      sessionName: 'Fall-Winter 2023-2024',
      sessionUrl: '20239'
    },
    {
      sessionName: 'Summer 2024',
      sessionUrl: '20245'
    },
    {
      sessionName: 'Fall-Winter 2024-2025',
      sessionUrl: '20249'
    },
    {
      sessionName: 'Summer 2025',
      sessionUrl: '20255'
    },
    {
      sessionName: 'Fall-Winter 2025-2026',
      sessionUrl: '20259'
    },
  ];

  brColors: string[] = [
    '#474545',
    '#d71a1a',
    '#55E6CA',
    '#f7c959',
    '#B6E364',
    '#af4aed',
  ];


  levelColors: string[] = [
    '#444444',  // 0-level
    '#6F9E00',
    //  '#02ad23',  // 100-level
    '#3694ff',
    '#9436ff',
    '#D93D00',
    // '#E02D00',
    // '#f53d00',  // 400-level
    '#5454e8',  // 500-level
    "#78630e", // 600-level,
    "#85462c" // 700-level
  ];
  disableToolTips: boolean = false;
  conflictBrightColor = '#cc1818';
  conflictColor = '#8b0000';
  conflictTextColor = '#FFFFFF';

  tableSessionColors: string[] = [
    '#ffd3a4',  // fall ffd3a4 FFD9C3
    '#A6F1FF',  // winter a6f1ff
    '#d5abff'   // year d5abff D5B8FF d5abff
  ];

  dayColors: string[] = [
    '#7B68EE',  // sat/su [5] 8B0000
    '#ff9f64',  // mon [0] FF7F50 ff9f64
    'bisque',  // tues [1] FFE4C4
    '#67e09b',  // wed [2] 67e09b
    'DodgerBlue',  // thurs [3] 1E90FF
    'DarkOrchid',  // fri [4] 9932CC
    'DarkRed',  // sat/su [5] 8B0000
    'gray'  // for async sections [6]
  ];
  dayBrightenedColors: string[] = [
    '#cc1818',
    '#FFB43F',
    '#ffebd3',
    '#81e8b4',
    '#26acff',
    '#b33fd9',
    '#cc1818',
    '#a0a0a0',
  ];
  dayColorText: string[] = [
    'white',
    'black',  // mon
    'black',  // tues
    'black',
    'white',
    'white',  // fri
    'white',  // sat/su
    'white'   // for async sections
  ];

  timetableCellColors: string[] = [
    '#6E4DBC',
    '#1C996F',
    '#D1543B',
    '#AC3EBD',
    '#D48A35',
    '#3CABB5',
    '#47C900',
    '#d32295',
    '#2d89d3',
    '#6b4a32',
    '#505050',
    '#003b6e',
    '#a445c0',
    '#9b9100',
    '#cb3500',
    '#492100',
    '#000000',
  ];

  constructor() { }
}
