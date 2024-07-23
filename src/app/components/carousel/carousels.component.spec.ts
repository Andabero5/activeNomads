import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselComponents } from './carousels.component';

describe('CarouselComponent', () => {
  let component: CarouselComponents;
  let fixture: ComponentFixture<CarouselComponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarouselComponents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarouselComponents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
