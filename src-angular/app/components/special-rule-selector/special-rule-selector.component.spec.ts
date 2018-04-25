import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialRuleSelectorComponent } from './special-rule-selector.component';

describe('SpecialRuleSelectorComponent', () => {
  let component: SpecialRuleSelectorComponent;
  let fixture: ComponentFixture<SpecialRuleSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialRuleSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialRuleSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
