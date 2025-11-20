import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { AsesoriaService } from '../services/asesoria.service';
import { Programador, Asesoria } from '../models/user.model';

@Component({
  selector: 'app-asesorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './asesorias.html',
  styleUrls: ['./asesorias.scss']
})
export class AsesoriasComponent implements OnInit {
  programadores: Programador[] = [];
  misAsesorias: Asesoria[] = [];
  showModal = false;
  selectedProgramador: Programador | null = null;
  loading = false;
  enviando = false;

  formData = {
    tema: '',
    descripcion: ''
  };

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private asesoriaService: AsesoriaService,
    private router: Router
  ) {}

  async ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    await Promise.all([
      this.loadProgramadores(),
      this.loadMisAsesorias()
    ]);
  }

  async loadProgramadores() {
    this.programadores = await this.userService.getProgramadores();
  }

  async loadMisAsesorias() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.misAsesorias = await this.asesoriaService.getAsesoriasUsuario(user.uid);
    }
  }

  openModal(programador: Programador) {
    this.selectedProgramador = programador;
    this.showModal = true;
    this.resetForm();
  }

  closeModal() {
    this.showModal = false;
    this.selectedProgramador = null;
    this.resetForm();
  }

  resetForm() {
    this.formData = {
      tema: '',
      descripcion: ''
    };
  }

  async solicitarAsesoria() {
    if (!this.selectedProgramador) return;
    
    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.enviando = true;
    try {
      await this.asesoriaService.crearAsesoria({
        usuarioUid: user.uid,
        usuarioNombre: user.displayName || 'Usuario',
        usuarioEmail: user.email || '',
        programadorUid: this.selectedProgramador.uid,
        programadorNombre: this.selectedProgramador.displayName,
        tema: this.formData.tema,
        descripcion: this.formData.descripcion,
        estado: 'pendiente'
      });

      await this.loadMisAsesorias();
      this.closeModal();
      alert('¡Solicitud enviada! El programador te responderá pronto.');
    } catch (error) {
      console.error('Error al solicitar asesoría:', error);
      alert('Error al enviar la solicitud');
    } finally {
      this.enviando = false;
    }
  }

  getEstadoColor(estado: string): string {
    switch(estado) {
      case 'pendiente': return '#f39c12';
      case 'aprobada': return '#27ae60';
      case 'rechazada': return '#e74c3c';
      default: return '#95a5a6';
    }
  }

  getEstadoTexto(estado: string): string {
    switch(estado) {
      case 'pendiente': return 'Pendiente';
      case 'aprobada': return 'Aprobada';
      case 'rechazada': return 'Rechazada';
      default: return estado;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
