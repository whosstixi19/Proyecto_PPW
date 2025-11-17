import { Routes } from '@angular/router';
import { CuadroComponent } from './cuadro/cuadro';
import { TablaComponent } from './tabla/tabla';

export const routes: Routes = [
  { path: '', redirectTo: '/cuadros', pathMatch: 'full' },
  { path: 'cuadros', component: CuadroComponent },
  { path: 'tabla', component: TablaComponent }
];
