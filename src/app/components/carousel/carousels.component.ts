import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  CarouselCaptionComponent,
  CarouselComponent,
  CarouselControlComponent,
  CarouselIndicatorsComponent,
  CarouselInnerComponent,
  CarouselItemComponent,
  ThemeDirective
} from '@coreui/angular';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousels.component.html',
  styleUrls: ['./carousels.component.css'],
  standalone: true,
  imports: [ThemeDirective, CarouselComponent, CarouselIndicatorsComponent, CarouselInnerComponent, NgFor, CarouselItemComponent, CarouselCaptionComponent, CarouselControlComponent, RouterLink, CarouselComponents, CarouselComponents, CarouselComponents]
})
export class CarouselComponents implements OnInit {

  slides: any[] = new Array(3).fill({ id: -1, src: '', title: '', subtitle: '' });

  ngOnInit(): void {
    this.slides[0] = {
      id: 0,
      src: './assets/images/idrd.jpeg',
      title: 'Nuestros aliados',
      subtitle: 'Contamos con el apoyo de distintas instituciones'
    };
    this.slides[1] = {
      id: 1,
      src: '../assets/images/nomada.jpg',
      title: 'Creado para nomadas digitales',
      subtitle: 'Encuentra tu equilibrio entre trabajo y bienestar mientras exploras el mundo.'
    };
    this.slides[2] = {
      id: 2,
      src: './assets/images/prueba.jpg',
      title: 'Third slide',
      subtitle: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.'
    };
  }

  ngAfterViewInit(): void {
    this.changeCarouselControlsStyle();
  }

  changeCarouselControlsStyle() {
    const controls = document.querySelectorAll('.carousel-control');
    controls.forEach((control: any) => {
      control.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      control.style.borderRadius = '50%';
      control.style.width = '50px';
      control.style.height = '50px';
      control.style.display = 'flex';
      control.style.justifyContent = 'center';
      control.style.alignItems = 'center';
      control.style.zIndex = '10';
      control.style.position = 'absolute';
      control.style.top = '50%';
      control.style.transform = 'translateY(-50%)';

      if (control.getAttribute('direction') === 'prev') {
        control.style.left = '50px';
      } else if (control.getAttribute('direction') === 'next') {
        control.style.right = '50px';
      }
    });
  }
}
