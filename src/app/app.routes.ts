import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { LoginComponent } from './login/login';
import { AdminComponent } from './admin/admin';
import { ProgramadorComponent } from './programador/programador';
import { AsesoriasComponent } from './asesorias/asesorias';
import { authGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'inicio', component: HomeComponent, canActivate: [authGuard] },
  { path: 'portafolios', component: HomeComponent, canActivate: [authGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [adminGuard] },
  { path: 'mi-portafolio', component: ProgramadorComponent, canActivate: [authGuard] },
  { path: 'asesorias', component: AsesoriasComponent, canActivate: [authGuard] },
];
