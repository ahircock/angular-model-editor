import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelTileComponent } from './model-tile.component';

describe('ModelTileComponent', () => {
  let component: ModelTileComponent;
  let fixture: ComponentFixture<ModelTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
