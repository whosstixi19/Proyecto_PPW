import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { AsesoriaService } from '../services/asesoria.service';
import { Programador, Proyecto, Asesoria, Ausencia, HorarioDisponible } from '../models/user.model';

// Componente de perfil del programador - Gestión de proyectos, asesorías, ausencias y horarios
@Component({
  selector: 'app-programador',
  imports: [CommonModule, FormsModule],
  templateUrl: './programador.html',
  styleUrl: './programador.scss',
})
export class ProgramadorComponent implements OnInit, OnDestroy {
  // Datos del programador y sus proyectos
  programador: Programador | null = null;
  proyectos: Proyecto[] = [];
  
  // Asesorías pendientes de responder
  asesoriasPendientes: Asesoria[] = [];
  
  // Control de modales y estados
  showModal = false;
  showRechazarModal = false;
  mostrarAusenciaModal = false;
  mostrarHorariosModal = false;
  mostrarNotificaciones = false;
  
  // Elementos seleccionados en modales
  selectedProyecto: Proyecto | null = null;
  selectedAsesoria: Asesoria | null = null;
  selectedAusencia: Ausencia | null = null;
  selectedHorario: HorarioDisponible | null = null;
  
  loading = false;
  respondiendo = false;
  motivoRechazo = '';
  
  // Indica si el usuario actual es dueño del perfil (puede editar)
  isOwner = false;
  
  // Horas disponibles para configurar ausencias y horarios
  horasDisponibles: string[] = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];
  
  // Días de la semana para horarios
  diasSemana: Array<{value: string, label: string}> = [
    { value: 'lunes', label: 'Lunes' },
    { value: 'martes', label: 'Martes' },
    { value: 'miercoles', label: 'Miércoles' },
    { value: 'jueves', label: 'Jueves' },
    { value: 'viernes', label: 'Viernes' },
    { value: 'sabado', label: 'Sábado' },
    { value: 'domingo', label: 'Domingo' },
  ];

  // Formulario para gestionar ausencias
  ausenciaForm: Partial<Ausencia> = {
    fecha: '',
    horaInicio: '',
    horaFin: '',
    motivo: '',
  };
  
  // Formulario para gestionar horarios de disponibilidad
  horarioForm: Partial<HorarioDisponible> = {
    dia: 'lunes',
    horaInicio: '08:00',
    horaFin: '09:00',
    modalidad: 'virtual',
    activo: true,
  };

  // Suscripción a asesorías en tiempo real
  private asesoriasSubscription?: Subscription;

  // Formulario para agregar/editar proyectos
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

  // Inputs temporales para agregar tecnologías e imágenes
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

  // Escuchar asesorías pendientes en tiempo real
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

  // Cargar datos del programador actual (su propio perfil)
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

  // Cargar perfil público de otro programador (modo vista)
  async loadProgramadorPublico(uid: string) {
    this.loading = true;
    const prog = await this.userService.getProgramador(uid);
    
    if (prog) {
      this.programador = prog;
      this.proyectos = prog.proyectos || [];
    } else {
      // Redirigir si no existe el programador
      this.router.navigate(['/portafolios']);
    }

    this.loading = false;
    this.cdr.detectChanges();
  }

  getCurrentUser() {
    return this.authService.getCurrentUser();
  }

  // Abrir modal para agregar o editar proyecto
  openModal(proyecto?: Proyecto) {
    if (proyecto) {
      // Modo edición: cargar datos existentes
      this.selectedProyecto = proyecto;
      this.formData = { ...proyecto };
    } else {
      // Modo creación: formulario vacío
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

  // Eliminar un proyecto del portafolio
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

  // Alternar panel de notificaciones
  toggleNotificaciones() {
    this.mostrarNotificaciones = !this.mostrarNotificaciones;
  }

  // Aprobar una solicitud de asesoría
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

      // Simulación de notificaciones al usuario
      console.log('📧 ============ SIMULACIÓN DE NOTIFICACIONES ============');
      console.log('✅ Respuesta de APROBACIÓN enviada al usuario');
      console.log('📨 Correo electrónico redactado y enviado a:', asesoria.usuarioEmail);
      console.log('💬 Mensaje de WhatsApp enviado al usuario:', asesoria.usuarioNombre);
      console.log('========================================================');

      alert('Asesoría aprobada correctamente');
    } catch (error) {
      console.error('Error aprobando asesoría:', error);
      alert('Error al aprobar la asesoría');
    } finally {
      this.loading = false;
    }
  }

  // Abrir modal para rechazar asesoría con motivo
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

  // Rechazar una solicitud de asesoría
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

      // Simulación de notificaciones al usuario
      console.log('📧 ============ SIMULACIÓN DE NOTIFICACIONES ============');
      console.log('❌ Respuesta de RECHAZO enviada al usuario');
      console.log('📨 Correo electrónico redactado y enviado a:', this.selectedAsesoria.usuarioEmail);
      console.log('💬 Mensaje de WhatsApp enviado al usuario:', this.selectedAsesoria.usuarioNombre);
      console.log('📝 Motivo:', this.motivoRechazo);
      console.log('========================================================');
      
      this.closeRechazarModal();
      alert('Asesoría rechazada. Se ha notificado al usuario.');
    } catch (error) {
      console.error('Error rechazando asesoría:', error);
      alert('Error al rechazar la asesoría');
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

  // ========== GESTIÓN DE AUSENCIAS ==========

  // Abrir modal para agregar o editar ausencia
  openAusenciaModal(ausencia?: Ausencia) {
    if (!this.isOwner) {
      alert('No tienes permisos para gestionar ausencias en este perfil');
      return;
    }

    if (ausencia) {
      // Modo edición
      this.selectedAusencia = ausencia;
      this.ausenciaForm = { ...ausencia };
    } else {
      // Modo creación
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

  // Guardar ausencia (crear o actualizar)
  async guardarAusencia() {
    if (!this.programador || !this.isOwner) {
      alert('No tienes permisos para realizar esta acción');
      return;
    }

    if (!this.ausenciaForm.fecha || !this.ausenciaForm.horaInicio || !this.ausenciaForm.horaFin) {
      alert('Fecha, hora de inicio y hora de fin son requeridos');
      return;
    }

    // Validar que la hora de fin sea posterior a la de inicio
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

  // Eliminar una ausencia registrada
  async eliminarAusencia(ausenciaId: string) {
    if (!this.programador || !this.isOwner) {
      alert('No tienes permisos para realizar esta acción');
      return;
    }

    if (!confirm('¿Estás seguro de eliminar esta ausencia?')) {
      return;
    }

    this.loading = true;

    // Filtrar la ausencia a eliminar
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

  // Fecha mínima para ausencias (hoy)
  get minFechaAusencia(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  // ========== GESTIÓN DE HORARIOS DE DISPONIBILIDAD ==========

  // Abrir modal para agregar o editar horario de disponibilidad
  openHorariosModal(horario?: HorarioDisponible) {
    if (!this.isOwner) {
      alert('No tienes permisos para gestionar horarios en este perfil');
      return;
    }

    if (horario) {
      // Modo edición
      this.selectedHorario = horario;
      this.horarioForm = { ...horario };
    } else {
      // Modo creación
      this.selectedHorario = null;
      this.resetHorarioForm();
    }
    this.mostrarHorariosModal = true;
  }

  closeHorariosModal() {
    this.mostrarHorariosModal = false;
    this.resetHorarioForm();
  }

  resetHorarioForm() {
    this.horarioForm = {
      dia: 'lunes',
      horaInicio: '08:00',
      horaFin: '09:00',
      modalidad: 'virtual',
      activo: true,
    };
  }

  // Guardar horario de disponibilidad (crear o actualizar)
  async guardarHorario() {
    if (!this.programador || !this.isOwner) {
      alert('No tienes permisos para realizar esta acción');
      return;
    }

    if (!this.horarioForm.dia || !this.horarioForm.horaInicio || !this.horarioForm.horaFin || !this.horarioForm.modalidad) {
      alert('Todos los campos son requeridos');
      return;
    }

    // Validar que la hora de fin sea posterior a la de inicio
    const horaInicio = parseInt(this.horarioForm.horaInicio!.split(':')[0]);
    const horaFin = parseInt(this.horarioForm.horaFin!.split(':')[0]);

    if (horaFin <= horaInicio) {
      alert('La hora de fin debe ser posterior a la hora de inicio');
      return;
    }

    this.loading = true;

    const horarioData: HorarioDisponible = {
      dia: this.horarioForm.dia as any,
      horaInicio: this.horarioForm.horaInicio!,
      horaFin: this.horarioForm.horaFin!,
      modalidad: this.horarioForm.modalidad as any,
      activo: this.horarioForm.activo ?? true,
    };

    let horarios = this.programador.horariosDisponibles || [];

    if (this.selectedHorario) {
      // Editar horario existente
      const index = horarios.findIndex(h => 
        h.dia === this.selectedHorario!.dia && 
        h.horaInicio === this.selectedHorario!.horaInicio
      );
      if (index > -1) {
        horarios[index] = horarioData;
      }
    } else {
      // Verificar que no exista conflicto con horarios existentes
      const conflicto = horarios.find(h => 
        h.dia === horarioData.dia && 
        this.hayConflictoHorario(h, horarioData)
      );

      if (conflicto) {
        alert(`Ya existe un horario configurado para ${horarioData.dia} que se solapa con el horario seleccionado`);
        this.loading = false;
        return;
      }

      horarios.push(horarioData);
    }

    const success = await this.userService.updateHorarios(this.programador.uid, horarios);

    if (success) {
      await this.loadProgramador();
      this.closeHorariosModal();
      alert('Horario guardado correctamente');
    } else {
      alert('Error al guardar el horario');
    }

    this.loading = false;
  }

  // Eliminar un horario de disponibilidad
  async eliminarHorario(dia: string, horaInicio: string) {
    if (!this.programador || !this.isOwner) {
      alert('No tienes permisos para realizar esta acción');
      return;
    }

    if (!confirm(`¿Estás seguro de eliminar el horario del ${dia}?`)) {
      return;
    }

    this.loading = true;

    // Filtrar el horario a eliminar
    const horarios = (this.programador.horariosDisponibles || []).filter(h => 
      !(h.dia === dia && h.horaInicio === horaInicio)
    );
    
    const success = await this.userService.updateHorarios(this.programador.uid, horarios);

    if (success) {
      await this.loadProgramador();
      alert('Horario eliminado correctamente');
    } else {
      alert('Error al eliminar el horario');
    }

    this.loading = false;
  }

  // Verificar si dos horarios tienen conflicto (se solapan)
  private hayConflictoHorario(h1: HorarioDisponible, h2: HorarioDisponible): boolean {
    const inicio1 = parseInt(h1.horaInicio.split(':')[0]);
    const fin1 = parseInt(h1.horaFin.split(':')[0]);
    const inicio2 = parseInt(h2.horaInicio.split(':')[0]);
    const fin2 = parseInt(h2.horaFin.split(':')[0]);

    return (inicio1 < fin2 && fin1 > inicio2);
  }
}
