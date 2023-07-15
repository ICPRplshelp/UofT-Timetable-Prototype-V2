import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogHolderComponent } from './dialog-holder.component';

describe('DialogHolderComponent', () => {
  let component: DialogHolderComponent;
  let fixture: ComponentFixture<DialogHolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogHolderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
