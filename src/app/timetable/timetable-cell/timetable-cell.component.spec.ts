import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimetableCellComponent } from './timetable-cell.component';

describe('TimetableCellComponent', () => {
  let component: TimetableCellComponent;
  let fixture: ComponentFixture<TimetableCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimetableCellComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimetableCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
