import { Component, Input, OnInit } from '@angular/core';
import { DropInfo } from '../drop-rate-viewer.service';

@Component({
  selector: 'app-drop-counter',
  templateUrl: './drop-counter.component.html',
  styleUrls: ['./drop-counter.component.scss']
})
export class DropCounterComponent implements OnInit {


  /*
    COLORSCHEME:
    0-5: green
  */

  // colors
  grey="#919e9d";
  blue='#0DFB57';
  green='#6FCF0E';
  yellow='#d99a09';
  orange='#f26d13'
  red='#e01610'
  darkRed='#b80600';
  black='#FFFFFF';
  white='#FFFFFF';

  /**
 * Formats a number as a percentage with no decimal places, always rounding up.
 * @param value - The number to format as a percentage (between 0 and 1).
 * @returns The formatted percentage as a string.
 */
formatPercentage(value: number): string {
  if (value < 0 || value > 1) {
      throw new Error("Value must be between 0 and 1");
  }
  
  const percentage = Math.ceil(value * 100);
  return `${percentage}%`;
}

  getTextColor(): string {
    const num = this.getDropPercent();

    if (isNaN(num) || this.dropInfo.o === 0){
      return this.white;
    }

    if (num < 0.10) return this.black;
    else if (num < 0.20) return this.black;
    else if (num < 0.30) return this.white;
    else if (num < 0.4) return this.white;
    else if (num < 3) return this.white;
    else return this.white;
  }

  getColor(): string {
    const num = this.getDropPercent();
    if (isNaN(num) || this.dropInfo.o === 0){
      return this.grey;
    }

    if (num < 0.10) return this.green;
    else if (num < 0.20) return this.yellow;
    else if (num < 0.30) return this.orange;
    else if (num < 0.4) return this.red;
    else if (num < 3) return this.darkRed;
    else return this.grey;
  }

  


  @Input() dropInfo: DropInfo = {d: 0, o: 0};

  getDropPercent(): number {
    if(this.dropInfo.o === 0){
      return 300;
    }
    return this.dropInfo.d / this.dropInfo.o;
  }

  constructor() { }

  ngOnInit(): void {
  }

}


