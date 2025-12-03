import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { filter, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { Programador, Proyecto, HorarioDisponible } from '../models/user.model';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class AdminComponent implements OnInit {
  programadores: Programador[] = [];
  todosUsuarios: any[] = [];
  selectedProgramador: Programador | null = null;
  showEditModal = false;
  showHorariosModal = false;
  showUsuariosModal = false;
  loading = false; // ← Cambiado a false

  diasSemana = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];

  horariosFormData: HorarioDisponible[] = [];

  // Formulario
  formData: Partial<Programador> = {
    displayName: '',
    email: '',
    especialidad: '',
    descripcion: '',
    photoURL: '',
    redesSociales: {
      github: '',
      linkedin: '',
      portfolio: '',
    },
  };

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  async ngOnInit() {
    this.authService.authReady$
      .pipe(
        filter((ready) => ready),
        take(1),
      )
      .subscribe(async () => {
        if (!this.authService.hasRole('admin')) {
          this.router.navigate(['/portafolios']);
          return;
        }

        await Promise.all([this.loadProgramadores(), this.loadAllUsuarios()]);
        this.cdr.detectChanges();
      });
  }

  async loadAllUsuarios() {
    this.todosUsuarios = await this.userService.getAllUsuarios();
  }

  async loadProgramadores() {
    const isManualReload = this.programadores.length > 0;
    if (isManualReload) {
      this.loading = true;
    }

    this.programadores = await this.userService.getProgramadores();
    this.loading = false;
  }

  getCurrentUser() {
    return this.authService.getCurrentUser();
  }

  openEditModal(programador?: Programador) {
    if (programador) {
      this.selectedProgramador = programador;
      this.formData = {
        uid: programador.uid,
        displayName: programador.displayName,
        email: programador.email,
        especialidad: programador.especialidad || '',
        descripcion: programador.descripcion || '',
        photoURL: programador.photoURL || '',
        redesSociales: {
          github: programador.redesSociales?.github || '',
          linkedin: programador.redesSociales?.linkedin || '',
          portfolio: programador.redesSociales?.portfolio || '',
        },
      };
    } else {
      this.selectedProgramador = null;
      this.resetForm();
    }
    this.showEditModal = true;
  }

  closeModal() {
    this.showEditModal = false;
    this.resetForm();
  }

  resetForm() {
    this.formData = {
      displayName: '',
      email: '',
      especialidad: '',
      descripcion: '',
      photoURL: '',
      redesSociales: {
        github: '',
        linkedin: '',
        portfolio: '',
      },
    };
  }

  async saveProgramador() {
    if (!this.formData.displayName || !this.formData.email) {
      alert('Nombre y email son requeridos');
      return;
    }

    this.loading = true;

    const dataToSave: Partial<Programador> = {
      ...this.formData,
      role: 'programador',
      proyectos: this.selectedProgramador?.proyectos || [],
    };

    const success = await this.userService.saveProgramador(dataToSave);

    if (success) {
      await this.loadProgramadores();
      this.closeModal();
    } else {
      alert('Error guardando programador');
    }

    this.loading = false;
  }

  async deleteProgramador(uid: string) {
    if (!confirm('¿Estás seguro de eliminar este programador?')) {
      return;
    }

    this.loading = true;
    const success = await this.userService.deleteProgramador(uid);

    if (success) {
      await this.loadProgramadores();
    } else {
      alert('Error eliminando programador');
    }

    this.loading = false;
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToInicio() {
    this.router.navigate(['/inicio']);
  }

  // Gestión de Usuarios y Roles
  openUsuariosModal() {
    this.showUsuariosModal = true;
  }

  closeUsuariosModal() {
    this.showUsuariosModal = false;
  }

  async cambiarRol(usuario: any, nuevoRol: 'admin' | 'programador' | 'usuario') {
    if (!confirm(`¿Cambiar rol de ${usuario.displayName} a ${nuevoRol}?`)) {
      return;
    }

    this.loading = true;
    const success = await this.userService.updateUserRole(usuario.uid, nuevoRol);

    if (success) {
      await Promise.all([this.loadAllUsuarios(), this.loadProgramadores()]);
      alert('Rol actualizado correctamente');
    } else {
      alert('Error actualizando rol');
    }

    this.loading = false;
  }

  // Gestión de Horarios
  openHorariosModal(programador: Programador) {
    this.selectedProgramador = programador;

    // SIEMPRE inicializar con todos los días de la semana
    this.horariosFormData = this.diasSemana.map((dia) => {
      // Buscar si este día ya tiene configuración
      const horarioExistente = programador.horariosDisponibles?.find((h) => h.dia === dia);

      if (horarioExistente) {
        // Si existe, usar los datos guardados
        return { ...horarioExistente };
      } else {
        // Si no existe, crear uno nuevo desactivado
        return {
          dia: dia as any,
          horaInicio: '09:00',
          horaFin: '17:00',
          activo: false,
        };
      }
    });

    this.showHorariosModal = true;
  }

  closeHorariosModal() {
    this.showHorariosModal = false;
    this.selectedProgramador = null;
  }

  toggleHorario(index: number) {
    this.horariosFormData[index].activo = !this.horariosFormData[index].activo;
  }

  async saveHorarios() {
    if (!this.selectedProgramador) return;

    this.loading = true;

    const horariosActivos = this.horariosFormData.filter((h) => h.activo);

    const success = await this.userService.updateHorarios(
      this.selectedProgramador.uid,
      horariosActivos,
    );

    if (success) {
      await this.loadProgramadores();
      this.closeHorariosModal();
      alert('Horarios actualizados correctamente');
    } else {
      alert('Error actualizando horarios');
    }

    this.loading = false;
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
