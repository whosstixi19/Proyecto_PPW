import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent {
  title = 'Página Software';
  description = 'Encuentra las mejores ofertas de trabajo para desarrolladores.';
}
