import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditDataComponent } from './add-edit-data.component';

describe('AddEditDataComponent', () => {
  let component: AddEditDataComponent;
  let fixture: ComponentFixture<AddEditDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
