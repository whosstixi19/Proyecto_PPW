import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { CuadroComponent } from './cuadro/cuadro';
import { TablaComponent } from './tabla/tabla';
import { LoginComponent } from './login/login';
import { AdminComponent } from './admin/admin';
import { authGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'inicio', component: HomeComponent, canActivate: [authGuard] },
  { path: 'portafolios', component: HomeComponent, canActivate: [authGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [adminGuard] },
  { path: 'cuadros', component: CuadroComponent },
  { path: 'tabla', component: TablaComponent }
];
