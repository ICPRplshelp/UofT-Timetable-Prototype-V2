import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {


  is24hour: boolean = true;
  hideSpecial: boolean = false;

  // brColors: string[] = [
  //   '#474545',  // no breath requirement
  //   '#d71a1a',  // br1
  //   '#34e7ff',
  //   '#ffd300',
  //   '#0ddc09',
  //   '#bb4bff'   // br5
  // ];

  brColors: string[] = [
    '#474545',
    '#d71a1a',
    '#55E6CA',
    '#f7c959',
    '#B6E364',
    '#af4aed',
  ]


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
  ]

  tableSessionColors: string[] = [
    '#ffd3a4',  // fall ffd3a4 FFD9C3
    '#A6F1FF',  // winter a6f1ff
    '#d5abff'   // year d5abff D5B8FF d5abff
  ]

  dayColors: string[] = [
    '#7B68EE',  // sat/su [5] 8B0000
    '#ff9f64',  // mon [0] FF7F50 ff9f64
    'bisque',  // tues [1] FFE4C4
    '#67e09b',  // wed [2] 67e09b
    'DodgerBlue',  // thurs [3] 1E90FF
    'DarkOrchid',  // fri [4] 9932CC
    'DarkRed',  // sat/su [5] 8B0000
    'gray'  // for async sections [6]
  ]
  dayBrightenedColors: string[] = [
    '#cc1818',
    '#FFB43F',
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