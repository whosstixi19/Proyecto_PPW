import { Injectable } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider, signOut, user, User } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Usuario, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User | null>;
  currentUser: Usuario | null = null;

  constructor(
    private auth: Auth,
    private firestore: Firestore
  ) {
    this.user$ = user(this.auth);
    
    // Suscribirse a cambios de autenticación
    this.user$.subscribe(async (firebaseUser) => {
      if (firebaseUser) {
        await this.loadUserData(firebaseUser.uid);
      } else {
        this.currentUser = null;
      }
    });
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
          createdAt: new Date()
        };
        
        await setDoc(doc(this.firestore, 'usuarios', result.user.uid), newUser);
        this.currentUser = newUser;
        return newUser;
      } else {
        this.currentUser = userDoc.data() as Usuario;
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
      }
    } catch (error) {
      console.error('Error cargando datos del usuario:', error);
    }
  }

  // Cerrar sesión
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.currentUser = null;
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
