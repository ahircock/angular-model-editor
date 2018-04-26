import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialRuleListComponent } from './special-rule-list.component';

describe('SpecialRuleListComponent', () => {
  let component: SpecialRuleListComponent;
  let fixture: ComponentFixture<SpecialRuleListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialRuleListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialRuleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
