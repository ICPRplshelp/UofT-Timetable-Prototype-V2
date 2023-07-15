import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Course} from "../shared/course-interfaces";
import {UtilitiesService} from "../shared/utilities.service";

@Component({
  selector: 'app-dialog-holder',
  templateUrl: './dialog-holder.component.html',
  styleUrls: ['./dialog-holder.component.scss']
})
export class DialogHolderComponent implements OnInit {

  storedCourses: Course[] = [];
  smallScreen: boolean = false;
  constructor(
    private dialogRef: MatDialogRef<DialogHolderComponent>,
    @Inject(MAT_DIALOG_DATA) data: { courses: Course[] , smallScreen: boolean},
    public util: UtilitiesService
  ) {
    this.storedCourses = data.courses;
    this.smallScreen = data.smallScreen;
    // console.log("Small screen?", data.smallScreen);
  }

  ngOnInit(): void {
  }

}
