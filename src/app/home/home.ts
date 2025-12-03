import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { AsesoriaService } from '../services/asesoria.service';
import { Programador } from '../models/user.model';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  programadores: Programador[] = [];
  loading = false;
  isAuthenticated = false;
  expandedProgramadores: Set<string> = new Set();
  asesoriasPendientes = 0;
  private asesoriasSubscription?: Subscription;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private asesoriaService: AsesoriaService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  async ngOnInit() {
    // Esperar a que la autenticación esté completa
    this.authService.authReady$
      .pipe(
        filter((ready) => ready),
        take(1),
      )
      .subscribe(async () => {
        if (!this.authService.isAuthenticated()) {
          this.router.navigate(['/login']);
          return;
        }

        await this.loadProgramadores();

        if (this.isProgramador()) {
          this.subscribeToAsesorias();
        }
        
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy() {
    if (this.asesoriasSubscription) {
      this.asesoriasSubscription.unsubscribe();
    }
  }

  subscribeToAsesorias() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.asesoriasSubscription = this.asesoriaService
        .getAsesoriasPendientesRealtime(currentUser.uid)
        .subscribe((asesorias) => {
          this.asesoriasPendientes = asesorias.length;
          this.cdr.detectChanges();
        });
    }
  }

  async loadProgramadores() {
    const isManualReload = this.programadores.length > 0;
    if (isManualReload) {
      this.loading = true;
    }
    
    this.programadores = await this.userService.getProgramadores();
    this.loading = false;
  }  async logout() {
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

  goToProgramadorNotificaciones() {
    this.router.navigate(['/programador'], { queryParams: { view: 'notificaciones' } });
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
