import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DatosTabla {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
}

@Component({
  selector: 'app-tabla',
  imports: [CommonModule],
  templateUrl: './tabla.html',
  styleUrl: './tabla.scss'
})
export class TablaComponent {
  titulo: string = 'Inventario de Productos';
  
  // Datos de ejemplo
  datos: DatosTabla[] = [
    { id: 1, nombre: 'Producto A', categoria: 'Electrónica', precio: 299.99, stock: 15 },
    { id: 2, nombre: 'Producto B', categoria: 'Ropa', precio: 49.99, stock: 42 },
    { id: 3, nombre: 'Producto C', categoria: 'Alimentos', precio: 12.50, stock: 100 },
    { id: 4, nombre: 'Producto D', categoria: 'Electrónica', precio: 899.99, stock: 5 },
    { id: 5, nombre: 'Producto E', categoria: 'Deportes', precio: 159.99, stock: 28 }
  ];

  // Función para formatear precio
  formatearPrecio(precio: number): string {
    return `$${precio.toFixed(2)}`;
  }

  // Función para determinar clase de stock
  claseStock(stock: number): string {
    if (stock < 10) return 'stock-bajo';
    if (stock < 30) return 'stock-medio';
    return 'stock-alto';
  }
}
