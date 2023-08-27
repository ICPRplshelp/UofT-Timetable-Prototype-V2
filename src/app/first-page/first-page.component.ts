import { Component, HostListener, OnInit } from '@angular/core';
import { UtilitiesService } from '../shared/utilities.service';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { SelectedCoursesService } from '../selected-courses.service';
import { ExporterService } from '../shared/exporter.service';


@Component({
  selector: 'app-first-page',
  templateUrl: './first-page.component.html',
  styleUrls: ['./first-page.component.scss']
})
export class FirstPageComponent implements OnInit {

  displayCourseList: boolean = true;
  buttonOptions: string[] = ['F', 'S'];

  toggleDisplayCourseList(): void {
    this.constants.displayCourseList = !this.constants.displayCourseList;
    console.log(this.buttonOptions);
  }

  exportCourses(): void {
    this.expServ.exportCourses();
  }


  onToggleChange(event: MatButtonToggleChange) {
    console.log('Selected value:', event.value);
    // Perform actions based on the selected value
  }
  constructor(public constants: UtilitiesService,
    public expServ: ExporterService
    ) { }

  ngOnInit(): void {
    this.isSmallScreen = window.innerWidth < this.constants.smallScreenThreshold; // Adjust the value as per your definition of a small screen

  }

  isSmallScreen: boolean = false;

  @HostListener('window:resize')
  checkScreenSize() {
    this.isSmallScreen = window.innerWidth < this.constants.smallScreenThreshold; // Adjust the value as per your definition of a small screen
  }

}
