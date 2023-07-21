import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CourseListComponent } from './course-list/course-list.component';
import { FormsModule } from '@angular/forms';
import {MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS} from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table'  
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';

import {MatInputModule} from '@angular/material/input';
import { TimingsComponent } from './timings/timings.component';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import { DialogHolderComponent } from './dialog-holder/dialog-holder.component';
import { TimetableComponent } from './timetable/timetable.component';
import { TimetableCellComponent } from './timetable/timetable-cell/timetable-cell.component';
import { ConflictTimetableCellComponent } from './timetable/conflict-timetable-cell/conflict-timetable-cell.component';
import { FirstPageComponent } from './first-page/first-page.component';
import { FileOpenerComponent } from './shared/file-opener/file-opener.component';


@NgModule({
  declarations: [
    AppComponent,
    CourseListComponent,
    TimingsComponent,
    DialogHolderComponent,
    TimetableComponent,
    TimetableCellComponent,
    ConflictTimetableCellComponent,
    FirstPageComponent,
    FileOpenerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    AppRoutingModule,
    MatTooltipModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatButtonModule,
    MatButtonModule,
    MatButtonToggleModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
