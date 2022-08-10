import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {


  is24hour: boolean = false;

  brColors: string[] = [
    '#474545',  // no breath requirement
    '#d71a1a',  // br1
    '#34e7ff',
    '#ffd300',
    '#0ddc09',
    '#bb4bff'   // br5
  ];

  levelColors: string[] = [
    '#444444',  // 0-level
    '#02ad23',  // 100-level
    '#3694ff',
    '#9436ff',
    '#f53d00',  // 400-level
    '#5454e8',  // 500-level
    "#78630e", // 600-level,
    "#85462c" // 700-level
  ]

  tableSessionColors: string[] = [
    '#ffd3a4',  // fall
    '#a6f1ff',  // winter
    '#d5abff'   // year
  ]

  dayColors: string[] = [
    'DarkRed',  // sat/su [5] 8B0000
    'Coral',  // mon [0] FF7F50
    'bisque',  // tues [1] FFE4C4
    '#67e09b',  // wed [2] 67e09b
    'DodgerBlue',  // thurs [3] 1E90FF
    'DarkOrchid',  // fri [4] 9932CC
    'DarkRed',  // sat/su [5] 8B0000
    'gray'  // for async sections [6]
  ]
  dayBrightenedColors: string[] = [
    '#cc1818',
    '#ff9f64',
    '#ffebd3',
    '#81e8b4',
    '#26acff',
    '#b33fd9',
    '#cc1818',
    '#a0a0a0',
  ]
  dayColorText: string[] = [
    'white',
    'black',  // mon
    'black',  // tues
    'black',
    'white',
    'white',  // fri
    'white',  // sat/su
    'white'   // for async sections
  ]

  constructor() { }
}
