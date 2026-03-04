import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RdvOrdonnanceComponent } from './rdv-ordonnance.component';

describe('RdvOrdonnanceComponent', () => {
  let component: RdvOrdonnanceComponent;
  let fixture: ComponentFixture<RdvOrdonnanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RdvOrdonnanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RdvOrdonnanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
