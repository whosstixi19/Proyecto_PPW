![UPS Logo](public/UPS.png)

# Sistema de Portafolios y Asesorias

Integrantes: Jose Tixi y Angel Cardenas

## Descripcion del Proyecto

Sistema web desarrollado con Angular para la gestion de portafolios de programadores y solicitudes de asesorias tecnicas. La plataforma permite a los usuarios explorar perfiles de desarrolladores, solicitar asesorias personalizadas y gestionar proyectos academicos y profesionales.

## Caracteristicas Principales

### Roles de Usuario

#### Usuario Regular
- Visualizacion de portafolios de programadores
- Solicitud de asesorias con fecha y hora especifica
- Seguimiento del estado de solicitudes (pendiente, aprobada, rechazada)
- Visualizacion de horarios disponibles por programador

#### Programador
- Gestion de portafolio personal
- Administracion de proyectos (academicos y profesionales)
- Configuracion de horarios de disponibilidad
- Respuesta a solicitudes de asesoria
- Inclusion de redes sociales y tecnologias

#### Administrador
- Gestion completa de usuarios y roles
- Administracion de programadores
- Configuracion de horarios para programadores
- Vista general del sistema

### Funcionalidades Tecnicas

1. Autenticacion con Google OAuth
2. Base de datos en tiempo real con Firebase Firestore
3. Sistema de roles y permisos
4. Gestion de horarios con validacion de disponibilidad
5. Carga de imagenes para proyectos
6. Sistema de cache para optimizacion de carga
7. Interfaz responsive con tema oscuro

## Tecnologias Utilizadas

- Angular 20.3.0
- Firebase (Authentication y Firestore)
- TypeScript
- SCSS
- RxJS

## Estructura del Proyecto

### Componentes Principales

- **Home**: Pagina principal con visualizacion de portafolios
- **Login**: Autenticacion con Google
- **Admin**: Panel de administracion para gestion de usuarios
- **Programador**: Panel personal del programador
- **Asesorias**: Sistema de solicitud y gestion de asesorias

### Servicios

- **AuthService**: Manejo de autenticacion y sesiones
- **UserService**: Operaciones CRUD de usuarios y programadores
- **AsesoriaService**: Gestion de solicitudes de asesoria
- **CacheService**: Optimizacion de carga con localStorage

### Guards

- **authGuard**: Proteccion de rutas autenticadas
- **adminGuard**: Acceso exclusivo para administradores
- **programadorGuard**: Acceso exclusivo para programadores

## Instalacion y Configuracion

### Prerrequisitos

- Node.js (version 18 o superior)
- npm o yarn
- Cuenta de Firebase

### Pasos de Instalacion

1. Clonar el repositorio
```bash
git clone [URL_DEL_REPOSITORIO]
cd Proyecto_CardenasA_TixiJ
```

2. Instalar dependencias
```bash
npm install
```

3. Configurar Firebase
- Crear proyecto en Firebase Console
- Habilitar Authentication (Google)
- Crear base de datos Firestore
- Copiar configuracion en `src/environments/`

4. Ejecutar en modo desarrollo
```bash
npm start
```

5. Compilar para produccion
```bash
npm run build
```

## Despliegue

El proyecto esta configurado para despliegue en Firebase Hosting:

```bash
npm run build
firebase deploy
```

## Modelos de Datos

### Usuario
- uid: string
- email: string
- displayName: string
- photoURL: string (opcional)
- role: 'usuario' | 'programador' | 'admin'
- createdAt: Date

### Programador (extiende Usuario)
- especialidad: string
- descripcion: string
- redesSociales: objeto
- proyectos: array
- horariosDisponibles: array

### Proyecto
- id: string
- nombre: string
- descripcion: string
- tipo: 'academico' | 'profesional'
- participacion: array
- tecnologias: array
- repositorio: string
- demo: string
- imagenes: array

### Asesoria
- id: string
- usuarioId: string
- programadorId: string
- tema: string
- descripcion: string
- fecha: string
- hora: string
- estado: 'pendiente' | 'aprobada' | 'rechazada'
- respuesta: string
- fechaCreacion: Date

## Notas de Desarrollo

- El sistema utiliza Angular standalone components
- Implementa lazy loading para optimizacion
- Usa BehaviorSubject para manejo de estado de autenticacion
- Cache en localStorage para mejora de rendimiento
- Validacion de timezone en seleccion de fechas
- Sistema de guards para proteccion de rutas

## Licencia

Proyecto academico desarrollado para la Universidad Politecnica Salesiana.
