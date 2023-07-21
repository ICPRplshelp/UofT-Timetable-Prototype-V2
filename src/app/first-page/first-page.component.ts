import { Component, OnInit } from '@angular/core';
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
    this.displayCourseList = !this.displayCourseList;
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
  }

}
