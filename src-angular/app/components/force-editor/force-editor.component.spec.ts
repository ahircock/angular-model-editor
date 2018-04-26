import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForceEditorComponent } from './force-editor.component';

describe('ForceEditorComponent', () => {
  let component: ForceEditorComponent;
  let fixture: ComponentFixture<ForceEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForceEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForceEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
