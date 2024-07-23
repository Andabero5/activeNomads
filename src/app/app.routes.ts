import { Routes } from '@angular/router';
import {CarouselComponents} from "./components/carousel/carousels.component";
import {NosotrosComponent} from "./components/nosotros/nosotros.component";

export const routes: Routes = [
  { path: '', component: CarouselComponents },
  { path: 'nosotros', component: NosotrosComponent }
];
