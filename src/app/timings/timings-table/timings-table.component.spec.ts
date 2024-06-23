import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimingsTableComponent } from './timings-table.component';

describe('TimingsTableComponent', () => {
  let component: TimingsTableComponent;
  let fixture: ComponentFixture<TimingsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimingsTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimingsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
