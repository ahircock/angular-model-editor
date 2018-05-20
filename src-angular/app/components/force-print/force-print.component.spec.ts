import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForcePrintComponent } from './force-print.component';

describe('ForcePrintComponent', () => {
  let component: ForcePrintComponent;
  let fixture: ComponentFixture<ForcePrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForcePrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForcePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
