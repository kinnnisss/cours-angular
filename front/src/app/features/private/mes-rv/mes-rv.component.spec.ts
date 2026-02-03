import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MesRvComponent } from './mes-rv.component';

describe('MesRvComponent', () => {
  let component: MesRvComponent;
  let fixture: ComponentFixture<MesRvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesRvComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MesRvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
