import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForceListComponent } from './force-list.component';

describe('ForceListComponent', () => {
  let component: ForceListComponent;
  let fixture: ComponentFixture<ForceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
