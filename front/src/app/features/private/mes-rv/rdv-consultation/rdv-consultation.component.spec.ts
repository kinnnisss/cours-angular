import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RdvConsultationComponent } from './rdv-consultation.component';

describe('RdvConsultationComponent', () => {
  let component: RdvConsultationComponent;
  let fixture: ComponentFixture<RdvConsultationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RdvConsultationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RdvConsultationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
