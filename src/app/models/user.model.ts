// Modelos de datos para la aplicación

export type UserRole = 'admin' | 'programador' | 'usuario';

export interface Usuario {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  createdAt: Date;
}

export interface Programador extends Usuario {
  role: 'programador';
  especialidad: string;
  descripcion: string;
  redesSociales?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    portfolio?: string;
  };
  proyectos?: Proyecto[];
}

export interface Proyecto {
  id?: string;
  nombre: string;
  descripcion: string;
  tipo: 'academico' | 'laboral';
  participacion: ('frontend' | 'backend' | 'base-datos')[];
  tecnologias: string[];
  repositorio?: string;
  demo?: string;
  imagenes?: string[];
  fechaCreacion: Date;
}

export interface Asesoria {
  id?: string;
  usuarioUid: string;
  usuarioNombre: string;
  usuarioEmail: string;
  programadorUid: string;
  programadorNombre: string;
  tema: string;
  descripcion: string;
  estado: 'pendiente' | 'aprobada' | 'rechazada';
  fecha: any; // Firestore Timestamp
  respuesta?: string;
  fechaRespuesta?: any; // Firestore Timestamp
}
