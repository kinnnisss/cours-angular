import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesInformationsComponent } from './mes-informations.component';

describe('MesInformationsComponent', () => {
  let component: MesInformationsComponent;
  let fixture: ComponentFixture<MesInformationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesInformationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MesInformationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
