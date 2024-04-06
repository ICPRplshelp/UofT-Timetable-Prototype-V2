import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingChipComponent } from './meeting-chip.component';

describe('MeetingChipComponent', () => {
  let component: MeetingChipComponent;
  let fixture: ComponentFixture<MeetingChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingChipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
