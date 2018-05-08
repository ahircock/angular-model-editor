import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForceDetailsComponent } from './force-details.component';

describe('ForceDetailsComponent', () => {
  let component: ForceDetailsComponent;
  let fixture: ComponentFixture<ForceDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForceDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
