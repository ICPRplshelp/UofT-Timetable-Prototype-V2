import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropCounterComponent } from './drop-counter.component';

describe('DropCounterComponent', () => {
  let component: DropCounterComponent;
  let fixture: ComponentFixture<DropCounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropCounterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DropCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
