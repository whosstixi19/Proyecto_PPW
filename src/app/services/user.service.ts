import { Injectable } from '@angular/core';
import { 
  Firestore, 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc,
  query,
  where 
} from '@angular/fire/firestore';
import { Programador, Proyecto } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  constructor(private firestore: Firestore) {}

  // Obtener todos los programadores
  async getProgramadores(): Promise<Programador[]> {
    try {
      const q = query(
        collection(this.firestore, 'usuarios'),
        where('role', '==', 'programador')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        uid: doc.id
      })) as Programador[];
    } catch (error) {
      console.error('Error obteniendo programadores:', error);
      return [];
    }
  }

  // Obtener un programador por ID
  async getProgramador(uid: string): Promise<Programador | null> {
    try {
      const docRef = doc(this.firestore, 'usuarios', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { ...docSnap.data(), uid: docSnap.id } as Programador;
      }
      return null;
    } catch (error) {
      console.error('Error obteniendo programador:', error);
      return null;
    }
  }

  // Crear/Actualizar programador (solo admin)
  async saveProgramador(programador: Partial<Programador>): Promise<boolean> {
    try {
      if (programador.uid) {
        // Actualizar
        const docRef = doc(this.firestore, 'usuarios', programador.uid);
        await updateDoc(docRef, { ...programador });
      } else {
        // Crear nuevo (requiere uid de Firebase Auth primero)
        console.error('Se requiere uid para crear usuario');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error guardando programador:', error);
      return false;
    }
  }

  // Eliminar programador
  async deleteProgramador(uid: string): Promise<boolean> {
    try {
      await deleteDoc(doc(this.firestore, 'usuarios', uid));
      return true;
    } catch (error) {
      console.error('Error eliminando programador:', error);
      return false;
    }
  }

  // Agregar proyecto a un programador
  async addProyecto(programadorId: string, proyecto: Proyecto): Promise<boolean> {
    try {
      const programador = await this.getProgramador(programadorId);
      if (!programador) return false;

      const proyectos = programador.proyectos || [];
      proyecto.id = `${Date.now()}`;
      proyectos.push(proyecto);

      const docRef = doc(this.firestore, 'usuarios', programadorId);
      await updateDoc(docRef, { proyectos });
      return true;
    } catch (error) {
      console.error('Error agregando proyecto:', error);
      return false;
    }
  }

  // Actualizar proyecto
  async updateProyecto(programadorId: string, proyecto: Proyecto): Promise<boolean> {
    try {
      const programador = await this.getProgramador(programadorId);
      if (!programador || !programador.proyectos) return false;

      const index = programador.proyectos.findIndex(p => p.id === proyecto.id);
      if (index === -1) return false;

      programador.proyectos[index] = proyecto;

      const docRef = doc(this.firestore, 'usuarios', programadorId);
      await updateDoc(docRef, { proyectos: programador.proyectos });
      return true;
    } catch (error) {
      console.error('Error actualizando proyecto:', error);
      return false;
    }
  }

  // Eliminar proyecto
  async deleteProyecto(programadorId: string, proyectoId: string): Promise<boolean> {
    try {
      const programador = await this.getProgramador(programadorId);
      if (!programador || !programador.proyectos) return false;

      const proyectos = programador.proyectos.filter(p => p.id !== proyectoId);

      const docRef = doc(this.firestore, 'usuarios', programadorId);
      await updateDoc(docRef, { proyectos });
      return true;
    } catch (error) {
      console.error('Error eliminando proyecto:', error);
      return false;
    }
  }
}
