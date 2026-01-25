import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeRvComponent } from './demande-rv.component';

describe('DemandeRvComponent', () => {
  let component: DemandeRvComponent;
  let fixture: ComponentFixture<DemandeRvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemandeRvComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemandeRvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
