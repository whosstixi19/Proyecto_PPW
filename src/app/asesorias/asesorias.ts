import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { AsesoriaService } from '../services/asesoria.service';
import { NotificationService } from '../services/notification.service';
import { Programador, Asesoria } from '../models/user.model';

// Componente para solicitar asesorías y ver mis asesorías
@Component({
  selector: 'app-asesorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './asesorias.html',
  styleUrls: ['./asesorias.scss'],
})
export class AsesoriasComponent implements OnInit, OnDestroy {
  // Lista de programadores disponibles para solicitar asesoría
  programadores: Programador[] = [];
  // Mis asesorías solicitadas (pendientes, aprobadas, rechazadas)
  misAsesorias: Asesoria[] = [];
  
  // Control de modales y vistas
  showModal = false;
  mostrarMisAsesorias = false;
  selectedProgramador: Programador | null = null;
  loading = false;
  enviando = false;
  
  // Control de simulación de notificaciones
  mostrarSimulacion = false;
  etapaNotificacion: 'enviando' | 'email' | 'whatsapp' | 'completado' | '' = '';
  contenidoEmail = '';
  contenidoWhatsApp = '';

  // Datos del formulario de solicitud
  formData = {
    tema: '',
    descripcion: '',
    comentario: '',
    fecha: '',
    hora: '',
  };

  // Horas disponibles según horario del programador y ausencias
  horasDisponibles: string[] = [];
  minFecha: string = new Date().toISOString().split('T')[0];

  // Suscripción a cambios en tiempo real
  private asesoriasSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private asesoriaService: AsesoriaService,
    private notificationService: NotificationService,
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
        const user = this.authService.getCurrentUser();
        if (!user) {
          this.router.navigate(['/login']);
          return;
        }

        // Cargar programadores disponibles
        await this.loadProgramadores();
        // Escuchar actualizaciones de mis asesorías en tiempo real
        this.subscribeToMisAsesorias();
        
        // Verificar si se debe mostrar la vista de "Mis Asesorías"
        this.route.queryParams.pipe(take(1)).subscribe(params => {
          if (params['view'] === 'mis-asesorias') {
            this.mostrarMisAsesorias = true;
          }
        });
        
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy() {
    if (this.asesoriasSubscription) {
      this.asesoriasSubscription.unsubscribe();
    }
  }

  // Cargar lista de programadores desde Firestore
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

  // Suscribirse a mis asesorías en tiempo real
  subscribeToMisAsesorias() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.asesoriasSubscription = this.asesoriaService
        .getAsesoriasUsuarioRealtime(user.uid)
        .subscribe((asesorias) => {
          this.misAsesorias = asesorias;
        });
    }
  }

  // Abrir modal para solicitar asesoría con un programador específico
  async openModal(programador: Programador) {
    // Recargar programador para obtener ausencias actualizadas
    const programadorActualizado = await this.userService.getProgramador(programador.uid);
    
    if (programadorActualizado) {
      this.selectedProgramador = programadorActualizado;
    } else {
      this.selectedProgramador = programador;
    }
    
    this.showModal = true;
    this.resetForm();
    this.cdr.detectChanges();
  }

  closeModal() {
    this.showModal = false;
    this.selectedProgramador = null;
    this.resetForm();
  }

  resetForm() {
    this.formData = {
      tema: '',
      descripcion: '',
      comentario: '',
      fecha: '',
      hora: '',
    };
    this.horasDisponibles = [];
  }

  // Calcular horarios disponibles cuando el usuario selecciona una fecha
  async onFechaChange() {
    if (!this.formData.fecha || !this.selectedProgramador) {
      this.horasDisponibles = [];
      return;
    }

    // Obtener el día de la semana de la fecha seleccionada
    const [year, month, day] = this.formData.fecha.split('-').map(Number);
    const fecha = new Date(year, month - 1, day);

    const diasSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    const diaSemana = diasSemana[fecha.getDay()];

    // Buscar el horario configurado para ese día
    const horarioDelDia = this.selectedProgramador.horariosDisponibles?.find(
      (h) => h.activo && h.dia === diaSemana,
    );

    if (horarioDelDia) {
      // Generar todas las horas según el horario del programador
      const todasLasHoras = this.generarHoras(horarioDelDia.horaInicio, horarioDelDia.horaFin);
      
      // Obtener horarios ya ocupados por otras asesorías
      const horariosOcupados = await this.asesoriaService.getHorariosOcupados(
        this.selectedProgramador.uid,
        this.formData.fecha
      );
      
      // Obtener ausencias del programador para ese día
      const ausenciasDelDia = this.selectedProgramador.ausencias?.filter(
        a => a.fecha === this.formData.fecha
      ) || [];
      
      // Filtrar solo las horas realmente disponibles
      this.horasDisponibles = todasLasHoras.filter(hora => {
        // Excluir horarios ocupados por asesorías
        if (horariosOcupados.includes(hora)) {
          return false;
        }
        
        // Excluir horarios dentro de ausencias del programador
        for (const ausencia of ausenciasDelDia) {
          if (hora >= ausencia.horaInicio && hora < ausencia.horaFin) {
            return false;
          }
        }
        
        return true;
      });
    } else {
      this.horasDisponibles = [];
    }
    
    // Limpiar hora seleccionada si ya no está disponible
    if (this.formData.hora && !this.horasDisponibles.includes(this.formData.hora)) {
      this.formData.hora = '';
    }
    
    this.cdr.detectChanges();
  }

  // Generar array de horas en intervalos de 30 minutos
  generarHoras(inicio: string, fin: string): string[] {
    const horas: string[] = [];
    const [horaInicio, minInicio] = inicio.split(':').map(Number);
    const [horaFin, minFin] = fin.split(':').map(Number);

    let horaActual = horaInicio;
    let minActual = minInicio;

    while (horaActual < horaFin || (horaActual === horaFin && minActual < minFin)) {
      const horaStr = String(horaActual).padStart(2, '0');
      const minStr = String(minActual).padStart(2, '0');
      horas.push(`${horaStr}:${minStr}`);

      minActual += 30; // Intervalos de 30 minutos
      if (minActual >= 60) {
        minActual = 0;
        horaActual++;
      }
    }

    return horas;
  }

  // Enviar solicitud de asesoría al programador
  async solicitarAsesoria() {
    if (!this.selectedProgramador) return;

    const user = this.authService.getCurrentUser();
    if (!user) return;

    if (!this.formData.fecha || !this.formData.hora) {
      alert('Por favor selecciona fecha y hora');
      return;
    }

    this.enviando = true;
    this.mostrarSimulacion = true;
    this.etapaNotificacion = 'enviando';
    
    // Log de inicio del proceso
    console.clear();
    console.log('%c╔════════════════════════════════════════════════════════════════╗', 'color: #667eea; font-weight: bold; font-size: 16px;');
    console.log('%c║   🎓 SISTEMA DE GESTIÓN DE ASESORÍAS - SIMULACIÓN DE ENVÍO   ║', 'color: #667eea; font-weight: bold; font-size: 16px;');
    console.log('%c╚════════════════════════════════════════════════════════════════╝', 'color: #667eea; font-weight: bold; font-size: 16px;');
    console.log('\n%c🚀 PROCESO INICIADO', 'background: #667eea; color: white; padding: 10px 20px; font-size: 14px; font-weight: bold; border-radius: 5px;');
    console.log('%cFecha y hora: ' + new Date().toLocaleString('es-ES'), 'color: #7f8c8d; font-style: italic;');
    
    try {
      // Etapa 1: Guardar en Firestore
      console.log('\n%c📝 ETAPA 1/4: GUARDANDO SOLICITUD EN BASE DE DATOS', 'background: #3498db; color: white; padding: 8px 15px; font-weight: bold; border-radius: 3px;');
      console.log('%c⏳ Conectando con Firebase Firestore...', 'color: #f39c12; font-weight: bold;');
      
      const asesoria = await this.asesoriaService.crearAsesoria({
        usuarioUid: user.uid,
        usuarioNombre: user.displayName || 'Usuario',
        usuarioEmail: user.email || '',
        programadorUid: this.selectedProgramador.uid,
        programadorNombre: this.selectedProgramador.displayName,
        tema: this.formData.tema,
        descripcion: this.formData.descripcion,
        comentario: this.formData.comentario,
        fechaSolicitada: this.formData.fecha,
        horaSolicitada: this.formData.hora,
        estado: 'pendiente',
      });

      console.log('%c✅ Solicitud guardada exitosamente', 'color: #27ae60; font-weight: bold; font-size: 13px;');
      console.log('%c┌─────────────────────────────────────────────────────────────┐', 'color: #95a5a6;');
      console.log(`%c│ 🆔 ID Asesoría:   ${asesoria.id}`, 'color: #2c3e50;');
      console.log(`%c│ 👤 Estudiante:    ${user.displayName}`, 'color: #2c3e50;');
      console.log(`%c│ 👨‍💻 Programador:   ${this.selectedProgramador.displayName}`, 'color: #2c3e50;');
      console.log(`%c│ 📋 Tema:          ${this.formData.tema}`, 'color: #2c3e50;');
      console.log(`%c│ 📅 Fecha:         ${this.formData.fecha}`, 'color: #2c3e50;');
      console.log(`%c│ 🕐 Hora:          ${this.formData.hora}`, 'color: #2c3e50;');
      console.log(`%c│ 📊 Estado:        Pendiente`, 'color: #f39c12;');
      console.log('%c└─────────────────────────────────────────────────────────────┘', 'color: #95a5a6;');

      // Etapa 2: Enviar correo electrónico
      console.log('\n%c📧 ETAPA 2/4: ENVIANDO CORREO ELECTRÓNICO', 'background: #667eea; color: white; padding: 8px 15px; font-weight: bold; border-radius: 3px;');
      this.etapaNotificacion = 'email';
      
      const resultadoEmail = await this.notificationService.simularEnvioCorreo(
        this.selectedProgramador,
        {
          usuarioNombre: user.displayName || 'Usuario',
          usuarioEmail: user.email || '',
          tema: this.formData.tema,
          descripcion: this.formData.descripcion,
          comentario: this.formData.comentario,
          fechaSolicitada: this.formData.fecha,
          horaSolicitada: this.formData.hora,
        }
      );
      this.contenidoEmail = resultadoEmail.emailContent;
      
      // Esperar un momento para que el usuario vea la notificación
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Etapa 3: Enviar WhatsApp
      console.log('\n%c💬 ETAPA 3/4: ENVIANDO NOTIFICACIÓN VÍA WHATSAPP', 'background: #25D366; color: white; padding: 8px 15px; font-weight: bold; border-radius: 3px;');
      this.etapaNotificacion = 'whatsapp';
      
      const resultadoWhatsApp = await this.notificationService.simularEnvioWhatsApp(
        this.selectedProgramador,
        {
          usuarioNombre: user.displayName || 'Usuario',
          tema: this.formData.tema,
          fechaSolicitada: this.formData.fecha,
          horaSolicitada: this.formData.hora,
        }
      );
      this.contenidoWhatsApp = resultadoWhatsApp.message;
      
      // Esperar un momento antes de mostrar completado
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Etapa 4: Completado
      console.log('\n%c🎉 ETAPA 4/4: PROCESO COMPLETADO', 'background: #27ae60; color: white; padding: 8px 15px; font-weight: bold; border-radius: 3px;');
      this.etapaNotificacion = 'completado';
      
      console.log('\n%c╔════════════════════════════════════════════════════════════════╗', 'color: #27ae60; font-weight: bold; font-size: 14px;');
      console.log('%c║                    ✅ RESUMEN DEL PROCESO                      ║', 'color: #27ae60; font-weight: bold; font-size: 14px;');
      console.log('%c╚════════════════════════════════════════════════════════════════╝', 'color: #27ae60; font-weight: bold; font-size: 14px;');
      console.log('\n%c✓ Solicitud guardada en Firestore', 'color: #27ae60; font-weight: bold;');
      console.log('%c✓ Correo electrónico enviado al programador', 'color: #27ae60; font-weight: bold;');
      console.log('%c✓ Notificación WhatsApp enviada', 'color: #27ae60; font-weight: bold;');
      console.log('\n%c📊 ESTADÍSTICAS:', 'background: #34495e; color: white; padding: 5px 10px; font-weight: bold;');
      console.log('%c• Total de notificaciones enviadas: 2 (Email + WhatsApp)', 'color: #2c3e50;');
      console.log('%c• Canales utilizados: Correo electrónico, WhatsApp', 'color: #2c3e50;');
      console.log('%c• Estado de la solicitud: Pendiente de aprobación', 'color: #2c3e50;');
      console.log('\n%c💡 PRÓXIMOS PASOS:', 'background: #f39c12; color: white; padding: 5px 10px; font-weight: bold;');
      console.log('%c1. El programador recibirá las notificaciones', 'color: #2c3e50;');
      console.log('%c2. Revisará los detalles de la solicitud', 'color: #2c3e50;');
      console.log('%c3. Aprobará o rechazará la asesoría', 'color: #2c3e50;');
      console.log('%c4. Recibirás una respuesta por correo', 'color: #2c3e50;');
      console.log('\n%c' + '═'.repeat(64), 'color: #27ae60; font-weight: bold;');
      console.log('%c🎓 Gracias por usar el Sistema de Gestión de Asesorías', 'color: #667eea; font-weight: bold; text-align: center;');
      console.log('%c' + '═'.repeat(64) + '\n', 'color: #27ae60; font-weight: bold;');
      
      // Esperar 2 segundos y cerrar
      setTimeout(() => {
        this.closeModal();
        this.cerrarSimulacion();
      }, 2000);
      
    } catch (error) {
      console.error('%c❌ ERROR EN EL PROCESO', 'background: #e74c3c; color: white; padding: 8px 15px; font-weight: bold; border-radius: 3px;');
      console.error('%c' + error, 'color: #e74c3c;');
      alert('Error al enviar la solicitud');
      this.cerrarSimulacion();
    } finally {
      this.enviando = false;
    }
  }
  
  // Cerrar modal de simulación
  cerrarSimulacion() {
    this.mostrarSimulacion = false;
    this.etapaNotificacion = '';
    this.contenidoEmail = '';
    this.contenidoWhatsApp = '';
  }

  // Obtener color del badge según estado de asesoría
  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'pendiente':
        return '#f39c12';
      case 'aprobada':
        return '#27ae60';
      case 'rechazada':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  }

  // Convertir estado interno a texto legible
  getEstadoTexto(estado: string): string {
    switch (estado) {
      case 'pendiente':
        return 'Pendiente';
      case 'aprobada':
        return 'Aprobada';
      case 'rechazada':
        return 'Rechazada';
      default:
        return estado;
    }
  }

  // Convertir día interno a nombre legible
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

  // Métodos de navegación
  goToInicio() {
    this.router.navigate(['/inicio']);
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  goToPortafolios() {
    this.router.navigate(['/portafolios']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Alternar vista entre solicitar y mis asesorías
  toggleMisAsesorias() {
    this.mostrarMisAsesorias = !this.mostrarMisAsesorias;
  }

  volverASolicitar() {
    this.mostrarMisAsesorias = false;
  }
}
