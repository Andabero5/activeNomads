import { Routes } from '@angular/router';
import {CarouselComponents} from "./components/carousel/carousels.component";
import {NosotrosComponent} from "./components/nosotros/nosotros.component";
import {AffiliateFormComponent} from "./affiliate/affiliate-form/affiliate-form.component";
import {SignupComponent} from "./affiliate/signup/signup.component";

export const routes: Routes = [
  { path: '', component: CarouselComponents },
  { path: 'nosotros', component: NosotrosComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'affiliate-form', component: AffiliateFormComponent }
];
