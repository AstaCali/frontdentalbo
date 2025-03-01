import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacienteuserComponent } from './pacienteuser.component';

describe('PacienteuserComponent', () => {
  let component: PacienteuserComponent;
  let fixture: ComponentFixture<PacienteuserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PacienteuserComponent]
    });
    fixture = TestBed.createComponent(PacienteuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
