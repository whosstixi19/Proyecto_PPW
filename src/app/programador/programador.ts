import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { AsesoriaService } from '../services/asesoria.service';
import { Programador, Proyecto, Asesoria, Ausencia } from '../models/user.model';

@Component({
  selector: 'app-programador',
  imports: [CommonModule, FormsModule],
  templateUrl: './programador.html',
  styleUrl: './programador.scss',
})
export class ProgramadorComponent implements OnInit, OnDestroy {
  programador: Programador | null = null;
  proyectos: Proyecto[] = [];
  asesoriasPendientes: Asesoria[] = [];
  showModal = false;
  showAsesoriaModal = false;
  showRechazarModal = false;
  mostrarAusenciaModal = false;
  mostrarNotificaciones = false;
  selectedProyecto: Proyecto | null = null;
  selectedAsesoria: Asesoria | null = null;
  selectedAusencia: Ausencia | null = null;
  ausenciaEditando = false;
  loading = false;
  respondiendo = false;
  motivoRechazo = '';
  isOwner = false; // Indica si el usuario actual es el dueño del perfil
  horasDisponibles: string[] = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];
  respuestaForm = {
    accion: 'aprobar' as 'aprobar' | 'rechazar',
    respuesta: '',
  };

  // Formulario de ausencia
  ausenciaForm: Partial<Ausencia> = {
    fecha: '',
    horaInicio: '',
    horaFin: '',
    motivo: '',
  };

  private asesoriasSubscription?: Subscription;

  // Formulario de proyecto
  formData: Partial<Proyecto> = {
    nombre: '',
    descripcion: '',
    tipo: 'academico',
    participacion: [],
    tecnologias: [],
    repositorio: '',
    demo: '',
    imagenes: [],
  };

  tecnologiaInput = '';
  imagenInput = '';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private asesoriaService: AsesoriaService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {}

  async ngOnInit() {
    this.authService.authReady$
      .pipe(
        filter((ready) => ready),
        take(1),
      )
      .subscribe(async () => {
        const currentUser = this.authService.getCurrentUser();

        // Verificar si hay un UID en los query params (vista pública)
        this.route.queryParams.pipe(take(1)).subscribe(async params => {
          const uidParam = params['uid'];
          
          if (uidParam) {
            // Vista pública de perfil de un programador específico
            await this.loadProgramadorPublico(uidParam);
            // El usuario es el dueño solo si su UID coincide con el del perfil
            this.isOwner = currentUser?.uid === uidParam;
            
            // Si es el dueño (programador viendo su propio perfil), suscribirse a asesorías
            if (this.isOwner && currentUser?.role === 'programador') {
              this.subscribeToAsesorias();
              
              // Verificar si se debe mostrar notificaciones
              if (params['view'] === 'notificaciones') {
                this.mostrarNotificaciones = true;
              }
            }
          } else {
            // Sin UID en params: solo programadores pueden ver su propio perfil aquí
            if (!currentUser || currentUser.role !== 'programador') {
              this.router.navigate(['/portafolios']);
              return;
            }

            await this.loadProgramador();
            this.subscribeToAsesorias();
            this.isOwner = true; // Es su propio perfil
            
            // Verificar si se debe mostrar notificaciones
            if (params['view'] === 'notificaciones') {
              this.mostrarNotificaciones = true;
            }
          }
          
          this.cdr.detectChanges();
        });
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
          this.asesoriasPendientes = asesorias;
          this.cdr.detectChanges();
        });
    }
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
    this.cdr.detectChanges();
  }

  async loadProgramadorPublico(uid: string) {
    this.loading = true;
    const prog = await this.userService.getProgramador(uid);
    
    if (prog) {
      this.programador = prog;
      this.proyectos = prog.proyectos || [];
    } else {
      // Si no se encuentra el programador, redirigir a portafolios
      this.router.navigate(['/portafolios']);
    }

    this.loading = false;
    this.cdr.detectChanges();
  }

  async loadData() {
    await this.loadProgramador();
  }

  getCurrentUser() {
    return this.authService.getCurrentUser();
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
      imagenes: [],
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
      // La validación HTML5 del pattern ya se encarga de verificar el formato
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

    // Validar URLs con validación nativa del navegador
    if (this.formData.repositorio && !this.isValidUrl(this.formData.repositorio)) {
      alert('La URL del repositorio no es válida. Debe comenzar con http:// o https://');
      return;
    }

    if (this.formData.demo && !this.isValidUrl(this.formData.demo)) {
      alert('La URL de demo no es válida. Debe comenzar con http:// o https://');
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
      fechaCreacion: this.selectedProyecto?.fechaCreacion || new Date(),
    };

    let success = false;

    if (this.selectedProyecto) {
      success = await this.userService.updateProyecto(this.programador.uid, proyectoData);
    } else {
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

  goToInicio() {
    this.router.navigate(['/inicio']);
  }

  toggleNotificaciones() {
    this.mostrarNotificaciones = !this.mostrarNotificaciones;
  }

  async aprobarAsesoria(asesoria: Asesoria) {
    if (!confirm(`¿Confirmar asesoría con ${asesoria.usuarioNombre}?\nFecha: ${asesoria.fechaSolicitada} - ${asesoria.horaSolicitada}`)) {
      return;
    }

    this.loading = true;
    try {
      await this.asesoriaService.responderAsesoria(
        asesoria.id!,
        'aprobada',
        `Asesoría confirmada para el ${asesoria.fechaSolicitada} a las ${asesoria.horaSolicitada}. ¡Nos vemos!`,
      );

      await this.asesoriaService.enviarNotificacionExterna(asesoria, 'respuesta');
      alert('Asesoría aprobada correctamente');
    } catch (error) {
      console.error('Error aprobando asesoría:', error);
      alert('Error al aprobar la asesoría');
    } finally {
      this.loading = false;
    }
  }

  openRechazarModal(asesoria: Asesoria) {
    this.selectedAsesoria = asesoria;
    this.motivoRechazo = '';
    this.showRechazarModal = true;
  }

  closeRechazarModal() {
    this.showRechazarModal = false;
    this.selectedAsesoria = null;
    this.motivoRechazo = '';
  }

  async rechazarAsesoria() {
    if (!this.selectedAsesoria || !this.motivoRechazo.trim()) {
      alert('Por favor proporciona un motivo para el rechazo');
      return;
    }

    this.respondiendo = true;
    try {
      await this.asesoriaService.responderAsesoria(
        this.selectedAsesoria.id!,
        'rechazada',
        this.motivoRechazo,
      );

      await this.asesoriaService.enviarNotificacionExterna(this.selectedAsesoria, 'respuesta');
      
      this.closeRechazarModal();
      alert('Asesoría rechazada. Se ha notificado al usuario.');
    } catch (error) {
      console.error('Error rechazando asesoría:', error);
      alert('Error al rechazar la asesoría');
    } finally {
      this.respondiendo = false;
    }
  }

  openAsesoriaModal(asesoria: Asesoria) {
    this.selectedAsesoria = asesoria;
    this.respuestaForm = {
      accion: 'aprobar',
      respuesta: '',
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
        this.respuestaForm.respuesta,
      );

      await this.asesoriaService.enviarNotificacionExterna(this.selectedAsesoria, 'respuesta');

      this.closeAsesoriaModal();
      alert('Respuesta enviada correctamente');
    } catch (error) {
      console.error('Error respondiendo asesoría:', error);
      alert('Error al enviar la respuesta');
    } finally {
      this.respondiendo = false;
    }
  }

  getDiaNombre(dia: number | string): string {
    if (typeof dia === 'string') {
      const diasMap: { [key: string]: string } = {
        lunes: 'Lunes',
        martes: 'Martes',
        miercoles: 'Miércoles',
        jueves: 'Jueves',
        viernes: 'Viernes',
        sabado: 'Sábado',
        domingo: 'Domingo',
      };
      return diasMap[dia.toLowerCase()] || dia;
    }
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return dias[dia] || '';
  }

  isValidUrl(url: string): boolean {
    if (!url || url.trim() === '') {
      return true;
    }
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  }

  // ========== MÉTODOS PARA GESTIONAR AUSENCIAS ==========

  openAusenciaModal(ausencia?: Ausencia) {
    if (!this.isOwner) {
      alert('No tienes permisos para gestionar ausencias en este perfil');
      return;
    }

    if (ausencia) {
      this.selectedAusencia = ausencia;
      this.ausenciaForm = { ...ausencia };
    } else {
      this.selectedAusencia = null;
      this.resetAusenciaForm();
    }
    this.mostrarAusenciaModal = true;
  }

  closeAusenciaModal() {
    this.mostrarAusenciaModal = false;
    this.resetAusenciaForm();
  }

  resetAusenciaForm() {
    this.ausenciaForm = {
      fecha: '',
      horaInicio: '',
      horaFin: '',
      motivo: '',
    };
  }

  async guardarAusencia() {
    if (!this.programador || !this.isOwner) {
      alert('No tienes permisos para realizar esta acción');
      return;
    }

    if (!this.ausenciaForm.fecha || !this.ausenciaForm.horaInicio || !this.ausenciaForm.horaFin) {
      alert('Fecha, hora de inicio y hora de fin son requeridos');
      return;
    }

    // Validar que la hora de fin sea mayor a la hora de inicio
    if (this.ausenciaForm.horaInicio! >= this.ausenciaForm.horaFin!) {
      alert('La hora de fin debe ser posterior a la hora de inicio');
      return;
    }

    this.loading = true;

    const ausenciaData: Ausencia = {
      id: this.selectedAusencia?.id || Date.now().toString(),
      fecha: this.ausenciaForm.fecha!,
      horaInicio: this.ausenciaForm.horaInicio!,
      horaFin: this.ausenciaForm.horaFin!,
      motivo: this.ausenciaForm.motivo,
    };

    let ausencias = this.programador.ausencias || [];

    if (this.selectedAusencia) {
      // Editar ausencia existente
      const index = ausencias.findIndex(a => a.id === this.selectedAusencia!.id);
      if (index > -1) {
        ausencias[index] = ausenciaData;
      }
    } else {
      // Agregar nueva ausencia
      ausencias.push(ausenciaData);
    }

    const success = await this.userService.updateProgramadorAusencias(this.programador.uid, ausencias);

    if (success) {
      await this.loadProgramador();
      this.closeAusenciaModal();
      alert('Ausencia guardada correctamente');
    } else {
      alert('Error al guardar la ausencia');
    }

    this.loading = false;
  }

  async eliminarAusencia(ausenciaId: string) {
    if (!this.programador || !this.isOwner) {
      alert('No tienes permisos para realizar esta acción');
      return;
    }

    if (!confirm('¿Estás seguro de eliminar esta ausencia?')) {
      return;
    }

    this.loading = true;

    const ausencias = (this.programador.ausencias || []).filter(a => a.id !== ausenciaId);
    const success = await this.userService.updateProgramadorAusencias(this.programador.uid, ausencias);

    if (success) {
      await this.loadProgramador();
      alert('Ausencia eliminada correctamente');
    } else {
      alert('Error al eliminar la ausencia');
    }

    this.loading = false;
  }

  get minFechaAusencia(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
}
