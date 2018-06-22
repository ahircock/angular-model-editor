import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialRuleEditorComponent } from './special-rule-editor.component';

describe('SpecialRuleEditorComponent', () => {
  let component: SpecialRuleEditorComponent;
  let fixture: ComponentFixture<SpecialRuleEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialRuleEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialRuleEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
