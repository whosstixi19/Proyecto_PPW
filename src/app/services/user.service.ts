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
  where,
} from '@angular/fire/firestore';
import { Programador, Proyecto, HorarioDisponible } from '../models/user.model';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private firestore: Firestore,
    private cacheService: CacheService,
  ) {}

  // Obtener todos los usuarios (para admin)
  async getAllUsuarios(): Promise<any[]> {
    try {
      const usersRef = collection(this.firestore, 'usuarios');
      const snapshot = await getDocs(usersRef);
      const usuarios = snapshot.docs.map((doc) => ({
        ...doc.data(),
        uid: doc.id,
      }));

      console.log('📊 Total usuarios encontrados:', usuarios.length);
      return usuarios;
    } catch (error) {
      console.error('❌ Error obteniendo usuarios:', error);
      return [];
    }
  }

  // Actualizar rol de usuario
  async updateUserRole(uid: string, role: 'admin' | 'programador' | 'usuario'): Promise<boolean> {
    try {
      const docRef = doc(this.firestore, 'usuarios', uid);
      await updateDoc(docRef, { role });
      this.cacheService.invalidate(); // Invalidar caché
      console.log('✅ Rol actualizado:', uid, '->', role);
      return true;
    } catch (error) {
      console.error('❌ Error actualizando rol:', error);
      return false;
    }
  }

  // Obtener todos los programadores
  async getProgramadores(): Promise<Programador[]> {
    // Intentar obtener desde caché primero - INSTANTÁNEO
    const cached = this.cacheService.getProgramadores();
    if (cached && cached.length > 0) {
      console.log('⚡ Caché encontrado:', cached.length, 'programadores');

      // Actualizar en segundo plano SIN BLOQUEAR
      this.refreshProgramadores().catch((err) =>
        console.error('Error actualizando en background:', err),
      );

      return cached;
    }

    console.log('📡 Primera carga desde Firestore...');
    // Si no hay caché, cargar desde Firestore Y ESPERAR
    return await this.refreshProgramadores();
  }

  // Refrescar programadores desde Firestore
  private async refreshProgramadores(): Promise<Programador[]> {
    try {
      const q = query(collection(this.firestore, 'usuarios'), where('role', '==', 'programador'));
      const querySnapshot = await getDocs(q);
      const programadores = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        uid: doc.id,
      })) as Programador[];

      // Guardar en caché
      this.cacheService.setProgramadores(programadores);

      console.log('✅ Updated from Firestore:', programadores.length);
      return programadores;
    } catch (error) {
      console.error('❌ Error obteniendo programadores:', error);
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
        this.cacheService.invalidate(); // Invalidar caché
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

      const index = programador.proyectos.findIndex((p) => p.id === proyecto.id);
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

      const proyectos = programador.proyectos.filter((p) => p.id !== proyectoId);

      const docRef = doc(this.firestore, 'usuarios', programadorId);
      await updateDoc(docRef, { proyectos });
      return true;
    } catch (error) {
      console.error('Error eliminando proyecto:', error);
      return false;
    }
  }

  // Actualizar horarios de disponibilidad
  async updateHorarios(programadorId: string, horarios: HorarioDisponible[]): Promise<boolean> {
    try {
      const docRef = doc(this.firestore, 'usuarios', programadorId);
      await updateDoc(docRef, { horariosDisponibles: horarios });
      return true;
    } catch (error) {
      console.error('Error actualizando horarios:', error);
      return false;
    }
  }
}
