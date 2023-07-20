import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConflictTimetableCellComponent } from './conflict-timetable-cell.component';

describe('ConflictTimetableCellComponent', () => {
  let component: ConflictTimetableCellComponent;
  let fixture: ComponentFixture<ConflictTimetableCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConflictTimetableCellComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConflictTimetableCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
