import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { Programador } from '../models/user.model';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent implements OnInit {
  programadores: Programador[] = [];
  loading = false; // ← Cambiado a false para no bloquear la vista inicial
  isAuthenticated = false;
  expandedProgramadores: Set<string> = new Set(); // IDs de programadores expandidos

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.isAuthenticated = this.authService.isAuthenticated();
    
    if (!this.isAuthenticated) {
      this.router.navigate(['/login']);
      return;
    }

    // Cargar programadores sin bloquear la vista
    this.loadProgramadores();
  }

  async loadProgramadores() {
    // Solo mostrar loading si es una recarga manual
    const isManualReload = this.programadores.length > 0;
    if (isManualReload) {
      this.loading = true;
    }
    
    console.log('🔄 Recargando programadores...');
    this.programadores = await this.userService.getProgramadores();
    console.log('✅ Programadores recargados:', this.programadores.length);
    
    this.loading = false;
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }

  getCurrentUser() {
    return this.authService.getCurrentUser();
  }

  isAdmin() {
    return this.authService.hasRole('admin');
  }

  isProgramador() {
    return this.authService.hasRole('programador');
  }

  goToAdmin() {
    this.router.navigate(['/admin']);
  }

  goToProgramador() {
    this.router.navigate(['/programador']);
  }

  goToAsesorias() {
    this.router.navigate(['/asesorias']);
  }

  toggleProgramador(uid: string) {
    if (this.expandedProgramadores.has(uid)) {
      this.expandedProgramadores.delete(uid);
    } else {
      this.expandedProgramadores.add(uid);
    }
  }

  isProgramadorExpanded(uid: string): boolean {
    return this.expandedProgramadores.has(uid);
  }

  getDiaNombre(dia: string): string {
    const dias: { [key: string]: string } = {
      'lunes': 'Lunes',
      'martes': 'Martes',
      'miercoles': 'Miércoles',
      'jueves': 'Jueves',
      'viernes': 'Viernes',
      'sabado': 'Sábado',
      'domingo': 'Domingo'
    };
    return dias[dia] || dia;
  }
}
