import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportestadoComponent } from './reportestado.component';

describe('ReportestadoComponent', () => {
  let component: ReportestadoComponent;
  let fixture: ComponentFixture<ReportestadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportestadoComponent]
    });
    fixture = TestBed.createComponent(ReportestadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
