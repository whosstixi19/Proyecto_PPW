import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { Programador, Proyecto } from '../models/user.model';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class AdminComponent implements OnInit {
  programadores: Programador[] = [];
  selectedProgramador: Programador | null = null;
  showEditModal = false;
  loading = false;

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

    await this.loadProgramadores();
  }

  async loadProgramadores() {
    this.loading = true;
    this.programadores = await this.userService.getProgramadores();
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
}
