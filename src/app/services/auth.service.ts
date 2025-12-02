import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  user,
  User,
  onAuthStateChanged,
} from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import { Usuario, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<User | null>;
  currentUser: Usuario | null = null;
  private authReady = new BehaviorSubject<boolean>(false);
  authReady$ = this.authReady.asObservable();

  constructor(
    private auth: Auth,
    private firestore: Firestore,
  ) {
    this.user$ = user(this.auth);

    // Intentar cargar usuario desde caché primero
    this.loadFromCache();

    // Esperar a que Firebase Auth se inicialice completamente
    onAuthStateChanged(this.auth, async (firebaseUser) => {
      if (firebaseUser) {
        // CRÍTICO: Solo emitir authReady DESPUÉS de tener Auth + Firestore + Rol
        await this.loadUserData(firebaseUser.uid);
        this.authReady.next(true);
        console.log(
          '🟢 Auth + Firestore completos. Usuario:',
          this.currentUser?.displayName,
          'Rol:',
          this.currentUser?.role,
        );
      } else {
        this.currentUser = null;
        this.clearCache();
        this.authReady.next(true); // No autenticado, pero "ready" para permitir redirección
        console.log('🔴 No hay usuario autenticado');
      }
    });
  }

  // Cargar usuario desde localStorage (caché)
  private loadFromCache(): void {
    try {
      const cachedUser = localStorage.getItem('currentUser');
      if (cachedUser) {
        this.currentUser = JSON.parse(cachedUser);
        console.log(
          '⚡ Caché cargado:',
          this.currentUser?.displayName,
          'Rol:',
          this.currentUser?.role,
        );
        // NO emitir authReady aquí - debe esperar onAuthStateChanged para validar
        // El caché solo acelera isAuthenticated() y hasRole() pero NO bypasea la verificación
      }
    } catch (error) {
      console.error('Error cargando caché:', error);
    }
  }

  // Guardar usuario en localStorage (caché)
  private saveToCache(user: Usuario): void {
    try {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } catch (error) {
      console.error('Error guardando caché:', error);
    }
  }

  // Limpiar caché
  private clearCache(): void {
    localStorage.removeItem('currentUser');
  }

  // Login con Google
  async loginWithGoogle(): Promise<Usuario | null> {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);

      // Verificar si el usuario ya existe en Firestore
      const userDoc = await getDoc(doc(this.firestore, 'usuarios', result.user.uid));

      if (!userDoc.exists()) {
        // Crear nuevo usuario con rol 'usuario' por defecto
        const newUser: Usuario = {
          uid: result.user.uid,
          email: result.user.email!,
          displayName: result.user.displayName || 'Usuario',
          photoURL: result.user.photoURL || undefined,
          role: 'usuario',
          createdAt: new Date(),
        };

        await setDoc(doc(this.firestore, 'usuarios', result.user.uid), newUser);
        this.currentUser = newUser;
        this.saveToCache(newUser);
        return newUser;
      } else {
        this.currentUser = userDoc.data() as Usuario;
        this.saveToCache(this.currentUser);
        return this.currentUser;
      }
    } catch (error) {
      console.error('Error en login:', error);
      return null;
    }
  }

  // Cargar datos del usuario desde Firestore
  async loadUserData(uid: string): Promise<void> {
    try {
      const userDoc = await getDoc(doc(this.firestore, 'usuarios', uid));
      if (userDoc.exists()) {
        this.currentUser = userDoc.data() as Usuario;
        this.saveToCache(this.currentUser); // Guardar en caché
        console.log(
          '✅ Usuario cargado:',
          this.currentUser.displayName,
          'Rol:',
          this.currentUser.role,
        );
      }
    } catch (error) {
      console.error('❌ Error cargando datos del usuario:', error);
    }
  }

  // Cerrar sesión
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.currentUser = null;
      this.clearCache();
    } catch (error) {
      console.error('Error en logout:', error);
    }
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  // Verificar rol
  hasRole(role: UserRole): boolean {
    return this.currentUser?.role === role;
  }

  // Obtener usuario actual
  getCurrentUser(): Usuario | null {
    return this.currentUser;
  }
}
