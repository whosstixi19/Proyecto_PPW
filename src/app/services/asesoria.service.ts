import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, query, where, updateDoc, doc, Timestamp } from '@angular/fire/firestore';
import { Asesoria } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AsesoriaService {
  constructor(private firestore: Firestore) {}

  async crearAsesoria(asesoria: Omit<Asesoria, 'id' | 'fecha'>): Promise<void> {
    const asesoriasRef = collection(this.firestore, 'asesorias');
    await addDoc(asesoriasRef, {
      ...asesoria,
      fecha: Timestamp.now()
    });
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
}
