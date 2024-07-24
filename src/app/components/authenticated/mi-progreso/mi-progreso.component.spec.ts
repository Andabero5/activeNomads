import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiProgresoComponent } from './mi-progreso.component';

describe('MiProgresoComponent', () => {
  let component: MiProgresoComponent;
  let fixture: ComponentFixture<MiProgresoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiProgresoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiProgresoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
