import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
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
export class AsesoriasComponent implements OnInit, OnDestroy {
  programadores: Programador[] = [];
  misAsesorias: Asesoria[] = [];
  showModal = false;
  selectedProgramador: Programador | null = null;
  loading = false;
  enviando = false;

  formData = {
    tema: '',
    descripcion: '',
    comentario: '',
    fecha: '',
    hora: ''
  };

  horasDisponibles: string[] = [];
  minFecha: string = new Date().toISOString().split('T')[0];
  
  // Subscription for real-time updates
  private asesoriasSubscription?: Subscription;

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

    await this.loadProgramadores();
    this.subscribeToMisAsesorias();
  }

  ngOnDestroy() {
    // Cleanup subscription to prevent memory leaks
    if (this.asesoriasSubscription) {
      this.asesoriasSubscription.unsubscribe();
    }
  }

  async loadProgramadores() {
    this.programadores = await this.userService.getProgramadores();
  }

  subscribeToMisAsesorias() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.asesoriasSubscription = this.asesoriaService
        .getAsesoriasUsuarioRealtime(user.uid)
        .subscribe(asesorias => {
          this.misAsesorias = asesorias;
        });
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
      descripcion: '',
      comentario: '',
      fecha: '',
      hora: ''
    };
    this.horasDisponibles = [];
  }

  onFechaChange() {
    if (!this.formData.fecha || !this.selectedProgramador) {
      this.horasDisponibles = [];
      return;
    }

    const fecha = new Date(this.formData.fecha);
    const diasSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    const diaSemana = diasSemana[fecha.getDay()];

    const horarioDelDia = this.selectedProgramador.horariosDisponibles?.find(h => 
      h.activo && h.dia === diaSemana
    );

    if (horarioDelDia) {
      this.horasDisponibles = this.generarHoras(horarioDelDia.horaInicio, horarioDelDia.horaFin);
    } else {
      this.horasDisponibles = [];
    }
  }

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

  async solicitarAsesoria() {
    if (!this.selectedProgramador) return;
    
    const user = this.authService.getCurrentUser();
    if (!user) return;

    if (!this.formData.fecha || !this.formData.hora) {
      alert('Por favor selecciona fecha y hora');
      return;
    }

    this.enviando = true;
    try {
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
        estado: 'pendiente'
      });

      // External notification simulation
      await this.asesoriaService.enviarNotificacionExterna(
        asesoria,
        'solicitud'
      );

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
