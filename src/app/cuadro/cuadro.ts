import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cuadro',
  imports: [CommonModule],
  templateUrl: './cuadro.html',
  styleUrl: './cuadro.scss'
})
export class CuadroComponent {
  @Input() titulo: string = 'Título del Cuadro';
  @Input() contenido: string = 'Contenido del cuadro de ejemplo';
  @Input() color: string = 'primario';
  @Input() icono: string = '📦';
}
