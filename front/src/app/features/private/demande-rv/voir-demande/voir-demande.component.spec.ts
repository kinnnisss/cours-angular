import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoirDemandeComponent } from './voir-demande.component';

describe('VoirDemandeComponent', () => {
  let component: VoirDemandeComponent;
  let fixture: ComponentFixture<VoirDemandeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoirDemandeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoirDemandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
