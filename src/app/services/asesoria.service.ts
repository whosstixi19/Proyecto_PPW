import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  Timestamp,
  onSnapshot,
} from '@angular/fire/firestore';
import { Asesoria } from '../models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AsesoriaService {
  constructor(private firestore: Firestore) {}

  async crearAsesoria(asesoria: Omit<Asesoria, 'id' | 'fecha'>): Promise<Asesoria> {
    const asesoriasRef = collection(this.firestore, 'asesorias');
    const docRef = await addDoc(asesoriasRef, {
      ...asesoria,
      fecha: Timestamp.now(),
    });

    return {
      id: docRef.id,
      ...asesoria,
      fecha: new Date(),
    } as Asesoria;
  }

  async getAsesoriasPendientes(programadorUid: string): Promise<Asesoria[]> {
    const asesoriasRef = collection(this.firestore, 'asesorias');
    const q = query(
      asesoriasRef,
      where('programadorUid', '==', programadorUid),
      where('estado', '==', 'pendiente'),
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Asesoria[];
  }

  async getAsesoriasUsuario(usuarioUid: string): Promise<Asesoria[]> {
    const asesoriasRef = collection(this.firestore, 'asesorias');
    const q = query(asesoriasRef, where('usuarioUid', '==', usuarioUid));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Asesoria[];
  }

  async responderAsesoria(
    asesoriaId: string,
    estado: 'aprobada' | 'rechazada',
    respuesta: string,
  ): Promise<void> {
    const asesoriaRef = doc(this.firestore, 'asesorias', asesoriaId);
    await updateDoc(asesoriaRef, {
      estado,
      respuesta,
      fechaRespuesta: Timestamp.now(),
    });
  }

  getAsesoriasPendientesRealtime(programadorUid: string): Observable<Asesoria[]> {
    return new Observable((observer) => {
      const asesoriasRef = collection(this.firestore, 'asesorias');
      const q = query(
        asesoriasRef,
        where('programadorUid', '==', programadorUid),
        where('estado', '==', 'pendiente'),
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const asesorias = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Asesoria[];
        observer.next(asesorias);
      });

      return () => unsubscribe();
    });
  }

  getAsesoriasUsuarioRealtime(usuarioUid: string): Observable<Asesoria[]> {
    return new Observable((observer) => {
      const asesoriasRef = collection(this.firestore, 'asesorias');
      const q = query(asesoriasRef, where('usuarioUid', '==', usuarioUid));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const asesorias = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Asesoria[];
        observer.next(asesorias);
      });

      return () => unsubscribe();
    });
  }

  // Obtener asesorías respondidas (aprobadas o rechazadas) del usuario
  getAsesoriasRespondidasRealtime(usuarioUid: string): Observable<Asesoria[]> {
    return new Observable((observer) => {
      const asesoriasRef = collection(this.firestore, 'asesorias');
      const q = query(
        asesoriasRef,
        where('usuarioUid', '==', usuarioUid),
        where('estado', 'in', ['aprobada', 'rechazada'])
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const asesorias = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Asesoria[];
        observer.next(asesorias);
      });

      return () => unsubscribe();
    });
  }

  // Placeholder para notificaciones externas (email, WhatsApp, etc.)
  async enviarNotificacionExterna(
    asesoria: Asesoria,
    tipo: 'solicitud' | 'respuesta',
  ): Promise<void> {
    // Integración pendiente con servicios externos
  }

  // Verificar si un horario está disponible (no está ocupado por otra asesoría aprobada)
  async verificarDisponibilidadHorario(
    programadorUid: string,
    fecha: string,
    hora: string,
  ): Promise<boolean> {
    try {
      const asesoriasRef = collection(this.firestore, 'asesorias');
      const q = query(
        asesoriasRef,
        where('programadorUid', '==', programadorUid),
        where('fechaSolicitada', '==', fecha),
        where('horaSolicitada', '==', hora),
        where('estado', 'in', ['pendiente', 'aprobada'])
      );
      const snapshot = await getDocs(q);
      
      // Si no hay documentos, el horario está disponible
      return snapshot.empty;
    } catch (error) {
      console.error('Error verificando disponibilidad:', error);
      return false;
    }
  }

  // Obtener horarios ocupados para una fecha específica
  async getHorariosOcupados(programadorUid: string, fecha: string): Promise<string[]> {
    try {
      const asesoriasRef = collection(this.firestore, 'asesorias');
      const q = query(
        asesoriasRef,
        where('programadorUid', '==', programadorUid),
        where('fechaSolicitada', '==', fecha),
        where('estado', 'in', ['pendiente', 'aprobada'])
      );
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => (doc.data() as Asesoria).horaSolicitada);
    } catch (error) {
      console.error('Error obteniendo horarios ocupados:', error);
      return [];
    }
  }
}
