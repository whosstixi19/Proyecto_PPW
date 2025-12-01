import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { Programador, Proyecto, HorarioDisponible } from '../models/user.model';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
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
      portfolio: ''
    }
  };

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  async ngOnInit() {
    // Verificar que sea admin
    if (!this.authService.hasRole('admin')) {
      this.router.navigate(['/login']);
      return;
    }

    await Promise.all([
      this.loadProgramadores(),
      this.loadAllUsuarios()
    ]);
  }

  async loadAllUsuarios() {
    this.todosUsuarios = await this.userService.getAllUsuarios();
    console.log('📋 Todos los usuarios:', this.todosUsuarios);
  }

  async loadProgramadores() {
    // Solo mostrar loading si es una recarga manual
    const isManualReload = this.programadores.length > 0;
    if (isManualReload) {
      this.loading = true;
    }
    
    console.log('🔄 Recargando programadores (Admin)...');
    this.programadores = await this.userService.getProgramadores();
    console.log('✅ Programadores recargados (Admin):', this.programadores.length);
    
    this.loading = false;
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
          portfolio: programador.redesSociales?.portfolio || ''
        }
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
        portfolio: ''
      }
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
      proyectos: this.selectedProgramador?.proyectos || []
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
      await Promise.all([
        this.loadAllUsuarios(),
        this.loadProgramadores()
      ]);
      alert('Rol actualizado correctamente');
    } else {
      alert('Error actualizando rol');
    }
    
    this.loading = false;
  }

  // Gestión de Horarios
  openHorariosModal(programador: Programador) {
    this.selectedProgramador = programador;
    
    // Inicializar horarios con los existentes o crear vacíos
    if (programador.horariosDisponibles && programador.horariosDisponibles.length > 0) {
      this.horariosFormData = programador.horariosDisponibles.map(h => ({ ...h }));
    } else {
      this.horariosFormData = this.diasSemana.map(dia => ({
        dia: dia as any,
        horaInicio: '09:00',
        horaFin: '17:00',
        activo: false
      }));
    }
    
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
    
    const horariosActivos = this.horariosFormData.filter(h => h.activo);
    
    const success = await this.userService.updateHorarios(
      this.selectedProgramador.uid,
      horariosActivos
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
}
