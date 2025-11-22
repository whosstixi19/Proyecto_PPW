import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, query, where, updateDoc, doc, Timestamp, onSnapshot } from '@angular/fire/firestore';
import { Asesoria } from '../models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AsesoriaService {
  constructor(private firestore: Firestore) {}

  async crearAsesoria(asesoria: Omit<Asesoria, 'id' | 'fecha'>): Promise<Asesoria> {
    const asesoriasRef = collection(this.firestore, 'asesorias');
    const docRef = await addDoc(asesoriasRef, {
      ...asesoria,
      fecha: Timestamp.now()
    });
    
    return {
      id: docRef.id,
      ...asesoria,
      fecha: new Date()
    } as Asesoria;
  }

  async getAsesoriasPendientes(programadorUid: string): Promise<Asesoria[]> {
    const asesoriasRef = collection(this.firestore, 'asesorias');
    const q = query(asesoriasRef, where('programadorUid', '==', programadorUid), where('estado', '==', 'pendiente'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Asesoria[];
  }

  async getAsesoriasUsuario(usuarioUid: string): Promise<Asesoria[]> {
    const asesoriasRef = collection(this.firestore, 'asesorias');
    const q = query(asesoriasRef, where('usuarioUid', '==', usuarioUid));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Asesoria[];
  }

  async responderAsesoria(asesoriaId: string, estado: 'aprobada' | 'rechazada', respuesta: string): Promise<void> {
    const asesoriaRef = doc(this.firestore, 'asesorias', asesoriaId);
    await updateDoc(asesoriaRef, {
      estado,
      respuesta,
      fechaRespuesta: Timestamp.now()
    });
  }

  // Observables en tiempo real
  getAsesoriasPendientesRealtime(programadorUid: string): Observable<Asesoria[]> {
    return new Observable(observer => {
      const asesoriasRef = collection(this.firestore, 'asesorias');
      const q = query(asesoriasRef, where('programadorUid', '==', programadorUid), where('estado', '==', 'pendiente'));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const asesorias = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Asesoria[];
        observer.next(asesorias);
      });

      return () => unsubscribe();
    });
  }

  getAsesoriasUsuarioRealtime(usuarioUid: string): Observable<Asesoria[]> {
    return new Observable(observer => {
      const asesoriasRef = collection(this.firestore, 'asesorias');
      const q = query(asesoriasRef, where('usuarioUid', '==', usuarioUid));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const asesorias = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Asesoria[];
        observer.next(asesorias);
      });

      return () => unsubscribe();
    });
  }

  // Simulación de envío de notificaciones externas
  async enviarNotificacionExterna(asesoria: Asesoria, tipo: 'solicitud' | 'respuesta'): Promise<void> {
    console.log('🔔 Notificación Externa Simulada:');
    
    if (tipo === 'solicitud') {
      // Simular envío al programador
      console.log('📧 Email enviado a:', asesoria.programadorNombre);
      console.log('📱 WhatsApp enviado a:', asesoria.programadorNombre);
      console.log('Mensaje: Nueva solicitud de asesoría de', asesoria.usuarioNombre);
      console.log('Tema:', asesoria.tema);
      console.log('Fecha:', asesoria.fechaSolicitada, 'Hora:', asesoria.horaSolicitada);
    } else {
      // Simular envío al usuario
      console.log('📧 Email enviado a:', asesoria.usuarioEmail);
      console.log('📱 WhatsApp simulado para:', asesoria.usuarioNombre);
      console.log('Mensaje: Tu solicitud fue', asesoria.estado);
      console.log('Respuesta:', asesoria.respuesta);
    }

    // Aquí iría la integración real con APIs de email/WhatsApp
    // Ejemplo: await this.emailService.send(...)
    // Ejemplo: await this.whatsappService.send(...)
  }
}
