import { Routes } from '@angular/router';
import {CarouselComponents} from "./components/carousel/carousels.component";
import {NosotrosComponent} from "./components/nosotros/nosotros.component";
import {AffiliateFormComponent} from "./affiliate/affiliate-form/affiliate-form.component";
import {SignupComponent} from "./affiliate/signup/signup.component";
import {MisDatosComponent} from "./components/authenticated/mis-datos/mis-datos.component";
import {GimnasiosComponent} from "./components/authenticated/gimnasios/gimnasios.component";
import {EventosComponent} from "./components/authenticated/eventos/eventos.component";
import {MiProgresoComponent} from "./components/authenticated/mi-progreso/mi-progreso.component";
import {AuthGuard} from "./services/auth.guard";
import {SigninComponent} from "./affiliate/signin/signin.component";

export const routes: Routes = [
  { path: '', component: CarouselComponents },
  { path: 'nosotros', component: NosotrosComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'affiliate-form', component: AffiliateFormComponent },


  { path: 'mi-progreso', component: MiProgresoComponent, canActivate: [AuthGuard] },
  { path: 'eventos', component: EventosComponent, canActivate: [AuthGuard] },
  { path: 'gimnasios', component: GimnasiosComponent, canActivate: [AuthGuard] },
  { path: 'mis-datos', component: MisDatosComponent, canActivate: [AuthGuard] }
];
