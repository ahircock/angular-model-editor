import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForceTileComponent } from './force-tile.component';

describe('ForceTileComponent', () => {
  let component: ForceTileComponent;
  let fixture: ComponentFixture<ForceTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForceTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForceTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
