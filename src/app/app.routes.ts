import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { CuadroComponent } from './cuadro/cuadro';
import { TablaComponent } from './tabla/tabla';

export const routes: Routes = [
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: 'inicio', component: HomeComponent },
  { path: 'cuadros', component: CuadroComponent },
  { path: 'tabla', component: TablaComponent }
];
