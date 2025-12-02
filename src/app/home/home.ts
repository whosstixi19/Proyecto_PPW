import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { filter, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { Programador } from '../models/user.model';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent implements OnInit {
  programadores: Programador[] = [];
  loading = false; // ← Cambiado a false para no bloquear la vista inicial
  isAuthenticated = false;
  expandedProgramadores: Set<string> = new Set(); // IDs de programadores expandidos

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  async ngOnInit() {
    // Esperar explícitamente a que Auth + Firestore + Rol estén completos
    this.authService.authReady$
      .pipe(
        filter((ready) => ready), // Solo cuando authReady emita true
        take(1), // Ejecutar UNA VEZ y auto-cancelar (evita memory leak)
      )
      .subscribe(async () => {
        console.log('🔵 HomeComponent: authReady$ emitió true, verificando autenticación...');

        if (!this.authService.isAuthenticated()) {
          console.log('❌ No autenticado, redirigiendo a login');
          this.router.navigate(['/login']);
          return;
        }

        // GARANTIZADO: usuario + rol están listos
        console.log('✅ Usuario autenticado, cargando programadores...');
        await this.loadProgramadores();

        // Forzar detección de cambios para renderizar inmediatamente
        this.cdr.detectChanges();
        console.log('🔄 Vista actualizada');
      });
  }

  async loadProgramadores() {
    // Solo mostrar loading si es una recarga manual
    const isManualReload = this.programadores.length > 0;
    if (isManualReload) {
      this.loading = true;
      console.log('🔄 Recarga manual...');
    }

    // getProgramadores usa caché instantáneo de localStorage
    this.programadores = await this.userService.getProgramadores();
    console.log('✅ Programadores cargados:', this.programadores.length);

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
      lunes: 'Lunes',
      martes: 'Martes',
      miercoles: 'Miércoles',
      jueves: 'Jueves',
      viernes: 'Viernes',
      sabado: 'Sábado',
      domingo: 'Domingo',
    };
    return dias[dia] || dia;
  }
}
