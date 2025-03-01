import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenamepassComponent } from './renamepass.component';

describe('RenamepassComponent', () => {
  let component: RenamepassComponent;
  let fixture: ComponentFixture<RenamepassComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RenamepassComponent]
    });
    fixture = TestBed.createComponent(RenamepassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
