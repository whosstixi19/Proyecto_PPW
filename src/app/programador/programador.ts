import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { AsesoriaService } from '../services/asesoria.service';
import { Programador, Proyecto, Asesoria } from '../models/user.model';

@Component({
  selector: 'app-programador',
  imports: [CommonModule, FormsModule],
  templateUrl: './programador.html',
  styleUrl: './programador.scss'
})
export class ProgramadorComponent implements OnInit {
  programador: Programador | null = null;
  proyectos: Proyecto[] = [];
  asesoriasPendientes: Asesoria[] = [];
  showModal = false;
  showAsesoriaModal = false;
  selectedProyecto: Proyecto | null = null;
  selectedAsesoria: Asesoria | null = null;
  loading = false;
  respondiendo = false;
  respuestaForm = {
    accion: 'aprobar' as 'aprobar' | 'rechazar',
    respuesta: ''
  };

  // Formulario de proyecto
  formData: Partial<Proyecto> = {
    nombre: '',
    descripcion: '',
    tipo: 'academico',
    participacion: [],
    tecnologias: [],
    repositorio: '',
    demo: '',
    imagenes: []
  };

  // Para manejar inputs de arrays
  tecnologiaInput = '';
  imagenInput = '';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private asesoriaService: AsesoriaService,
    private router: Router
  ) {}

  async ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser || currentUser.role !== 'programador') {
      this.router.navigate(['/login']);
      return;
    }

    await Promise.all([
      this.loadProgramador(),
      this.loadAsesorias()
    ]);
  }

  async loadProgramador() {
    this.loading = true;
    const currentUser = this.authService.getCurrentUser();
    
    if (currentUser) {
      const prog = await this.userService.getProgramador(currentUser.uid);
      if (prog) {
        this.programador = prog;
        this.proyectos = prog.proyectos || [];
      }
    }
    
    this.loading = false;
  }

  async loadAsesorias() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.asesoriasPendientes = await this.asesoriaService.getAsesoriasPendientes(currentUser.uid);
    }
  }

  openModal(proyecto?: Proyecto) {
    if (proyecto) {
      this.selectedProyecto = proyecto;
      this.formData = { ...proyecto };
    } else {
      this.selectedProyecto = null;
      this.resetForm();
    }
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.resetForm();
  }

  resetForm() {
    this.formData = {
      nombre: '',
      descripcion: '',
      tipo: 'academico',
      participacion: [],
      tecnologias: [],
      repositorio: '',
      demo: '',
      imagenes: []
    };
    this.tecnologiaInput = '';
    this.imagenInput = '';
  }

  toggleParticipacion(tipo: 'frontend' | 'backend' | 'base-datos') {
    if (!this.formData.participacion) {
      this.formData.participacion = [];
    }
    
    const index = this.formData.participacion.indexOf(tipo);
    if (index > -1) {
      this.formData.participacion.splice(index, 1);
    } else {
      this.formData.participacion.push(tipo);
    }
  }

  agregarTecnologia() {
    if (this.tecnologiaInput.trim()) {
      if (!this.formData.tecnologias) {
        this.formData.tecnologias = [];
      }
      this.formData.tecnologias.push(this.tecnologiaInput.trim());
      this.tecnologiaInput = '';
    }
  }

  eliminarTecnologia(index: number) {
    this.formData.tecnologias?.splice(index, 1);
  }

  agregarImagen() {
    if (this.imagenInput.trim()) {
      if (!this.formData.imagenes) {
        this.formData.imagenes = [];
      }
      this.formData.imagenes.push(this.imagenInput.trim());
      this.imagenInput = '';
    }
  }

  eliminarImagen(index: number) {
    this.formData.imagenes?.splice(index, 1);
  }

  async guardarProyecto() {
    if (!this.formData.nombre || !this.formData.descripcion || !this.programador) {
      alert('Nombre y descripción son requeridos');
      return;
    }

    this.loading = true;

    const proyectoData: Proyecto = {
      id: this.selectedProyecto?.id,
      nombre: this.formData.nombre!,
      descripcion: this.formData.descripcion!,
      tipo: this.formData.tipo!,
      participacion: this.formData.participacion || [],
      tecnologias: this.formData.tecnologias || [],
      repositorio: this.formData.repositorio,
      demo: this.formData.demo,
      imagenes: this.formData.imagenes || [],
      fechaCreacion: this.selectedProyecto?.fechaCreacion || new Date()
    };

    let success = false;

    if (this.selectedProyecto) {
      // Actualizar proyecto existente
      success = await this.userService.updateProyecto(this.programador.uid, proyectoData);
    } else {
      // Agregar nuevo proyecto
      success = await this.userService.addProyecto(this.programador.uid, proyectoData);
    }

    if (success) {
      await this.loadProgramador();
      this.closeModal();
    } else {
      alert('Error guardando proyecto');
    }

    this.loading = false;
  }

  async eliminarProyecto(proyectoId: string) {
    if (!confirm('¿Estás seguro de eliminar este proyecto?')) {
      return;
    }

    if (!this.programador) return;

    this.loading = true;
    const success = await this.userService.deleteProyecto(this.programador.uid, proyectoId);

    if (success) {
      await this.loadProgramador();
    } else {
      alert('Error eliminando proyecto');
    }

    this.loading = false;
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Gestión de Asesorías
  openAsesoriaModal(asesoria: Asesoria) {
    this.selectedAsesoria = asesoria;
    this.respuestaForm = {
      accion: 'aprobar',
      respuesta: ''
    };
    this.showAsesoriaModal = true;
  }

  closeAsesoriaModal() {
    this.showAsesoriaModal = false;
    this.selectedAsesoria = null;
  }

  async responderAsesoria() {
    if (!this.selectedAsesoria || !this.respuestaForm.respuesta.trim()) {
      alert('Por favor escribe una respuesta');
      return;
    }

    this.respondiendo = true;
    const estado = this.respuestaForm.accion === 'aprobar' ? 'aprobada' : 'rechazada';

    try {
      await this.asesoriaService.responderAsesoria(
        this.selectedAsesoria.id!,
        estado,
        this.respuestaForm.respuesta
      );

      await this.loadAsesorias();
      this.closeAsesoriaModal();
      alert('Respuesta enviada correctamente');
    } catch (error) {
      console.error('Error respondiendo asesoría:', error);
      alert('Error al enviar la respuesta');
    } finally {
      this.respondiendo = false;
    }
  }
}
