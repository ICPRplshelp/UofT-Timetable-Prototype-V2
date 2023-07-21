import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileOpenerComponent } from './file-opener.component';

describe('FileOpenerComponent', () => {
  let component: FileOpenerComponent;
  let fixture: ComponentFixture<FileOpenerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileOpenerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileOpenerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
