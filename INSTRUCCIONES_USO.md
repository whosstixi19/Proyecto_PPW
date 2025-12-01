# 📖 Guía de Uso - Sistema de Portafolios y Asesorías

## ✅ Problemas Solucionados

### 1. **Persistencia de Sesión** 
- ✅ La sesión ahora se mantiene al recargar la página
- ✅ Firebase Auth carga el estado de autenticación automáticamente
- ✅ Los guards esperan a que la autenticación esté lista antes de redirigir

### 2. **Navegación Sin Perder Sesión**
- ✅ Todos los botones ahora usan Angular Router (no recargan la página)
- ✅ Botón "🏠 Inicio" agregado en todas las vistas
- ✅ Navegación fluida sin pérdida de datos

### 3. **Actualización de Roles**
- ✅ Sistema mejorado para cambiar roles de usuarios
- ✅ Los cambios se reflejan inmediatamente después de re-login
- ✅ Panel admin muestra todos los usuarios registrados

### 4. **Gestión de Programadores**
- ✅ Sistema rediseñado: primero se crea usuario, luego se cambia rol
- ✅ Modal de "Gestionar Usuarios" para cambiar roles fácilmente
- ✅ Logs de consola para depuración

---

## 🚀 Cómo Usar el Sistema

### **Paso 1: Crear Usuarios**
1. Los usuarios deben hacer **Login con Google** primero
2. Al hacer login por primera vez, se crean automáticamente con rol `usuario`
3. Esto genera su `uid` único en Firebase

### **Paso 2: Convertir Usuario a Programador (Admin)**
1. Inicia sesión como **Admin**
2. Haz clic en el botón **"👥 Gestionar Usuarios"**
3. Verás una lista de TODOS los usuarios registrados
4. Cambia el rol del usuario deseado a **"Programador"**
5. El cambio se guarda automáticamente

### **Paso 3: Editar Datos del Programador (Admin)**
1. Después de cambiar el rol a programador
2. Haz clic en **"✏️ Editar"** en la tarjeta del programador
3. Completa:
   - Especialidad (ej: "Full Stack Developer")
   - Descripción (breve bio)
   - Redes sociales (GitHub, LinkedIn, Portfolio)
4. Guarda los cambios

### **Paso 4: Configurar Horarios (Admin)**
1. En la tarjeta del programador, haz clic en **"📅 Horarios"**
2. Selecciona los días disponibles
3. Define horas de inicio y fin para cada día
4. Activa/desactiva días según disponibilidad
5. Guarda los horarios

### **Paso 5: Programador Agrega Proyectos**
1. El programador inicia sesión
2. En "Mi Portafolio" hace clic en **"+ Agregar Proyecto"**
3. Completa:
   - Nombre del proyecto
   - Descripción
   - Tipo (Académico / Laboral)
   - Participación (Frontend, Backend, Base de Datos)
   - Tecnologías utilizadas
   - Links (Repositorio, Demo)
   - Imágenes
4. Guarda el proyecto

### **Paso 6: Usuarios Solicitan Asesorías**
1. Usuario inicia sesión
2. Ve todos los programadores en "Inicio"
3. Hace clic en **"Solicitar Asesoría"**
4. Selecciona:
   - Fecha (solo fechas futuras)
   - Hora (se muestran solo horas disponibles del programador)
   - Tema y descripción
   - Comentario opcional
5. Envía la solicitud

### **Paso 7: Programador Responde**
1. El programador ve solicitudes pendientes en tiempo real
2. Hace clic en una solicitud para ver detalles
3. Aprueba o rechaza con un mensaje
4. El usuario recibe la respuesta en tiempo real

---

## 🔧 Depuración y Logs

### **Consola del Navegador (F12)**
Ahora verás mensajes útiles como:

```
✅ Usuario cargado: Juan Pérez Rol: programador
📊 Programadores encontrados: 3
🔄 Cargando programadores...
✅ Programadores cargados en HomeComponent: 3
✅ Programadores cargados en Admin: 3
📋 Todos los usuarios: [Array de usuarios]
✅ Rol actualizado: abc123xyz -> programador
🔔 Notificación Externa Simulada:
📧 Email enviado a: María López
📱 WhatsApp enviado a: María López
```

### **Si No Ves Programadores**
1. Abre consola (F12)
2. Busca el mensaje: `📊 Programadores encontrados: X`
3. Si muestra `0`:
   - Verifica que hay usuarios con rol `programador` en Firestore
   - Usa el modal "Gestionar Usuarios" para cambiar roles
   - Recarga la página después de cambiar roles

4. Si muestra `❌ Error obteniendo programadores`:
   - Verifica la conexión a Firebase
   - Revisa las reglas de seguridad de Firestore
   - Verifica que el proyecto esté desplegado correctamente

---

## 📱 Flujo Completo de Notificaciones (Tiempo Real)

### **Solicitud de Asesoría**
1. Usuario llena formulario → Envía
2. 🔥 Se guarda en Firestore
3. 📧 Simulación: "Email enviado a programador@email.com"
4. ⚡ Programador ve la solicitud APARECER automáticamente (sin refrescar)

### **Respuesta del Programador**
1. Programador responde → Aprueba/Rechaza
2. 🔥 Se actualiza en Firestore
3. 📧 Simulación: "Email enviado a usuario@email.com"
4. ⚡ Usuario ve la respuesta APARECER automáticamente (sin refrescar)

---

## 🎨 Navegación

### **Para Admin:**
- 🏠 Inicio → Ver todos los portafolios
- 👥 Gestionar Usuarios → Cambiar roles
- ✏️ Editar Programador → Actualizar datos
- 📅 Horarios → Configurar disponibilidad

### **Para Programador:**
- 🏠 Inicio → Ver portafolios de otros
- Mi Portafolio → Gestionar proyectos propios
- Ver solicitudes pendientes en tiempo real

### **Para Usuario:**
- 🏠 Inicio → Explorar programadores
- Ver Portafolios → Buscar programadores
- Solicitar Asesoría → Crear solicitud
- Mis Solicitudes → Ver estado en tiempo real

---

## 🐛 Solución de Problemas Comunes

### **"Siempre me redirige a login"**
- ✅ **SOLUCIONADO**: Espera a que Firebase Auth cargue (ahora es automático)
- Si persiste: Borra caché del navegador y vuelve a iniciar sesión

### **"Los programadores no aparecen"**
- Abre consola y verifica los logs
- Asegúrate de haber cambiado roles a usuarios existentes
- NO intentes crear programadores desde cero (usar "Gestionar Usuarios")

### **"El rol no se actualiza después de cambiarlo"**
- Cierra sesión completamente
- Vuelve a iniciar sesión con Google
- Verifica en consola: `Usuario cargado: Nombre Rol: nuevo_rol`

### **"Las notificaciones no son en tiempo real"**
- Revisa la consola de errores
- Verifica que Firestore tenga reglas de lectura configuradas
- Los componentes ahora usan `onSnapshot` para actualizaciones automáticas

---

## 📝 Notas Importantes

1. **No crear programadores desde cero**: El botón "Editar Programador" solo sirve para actualizar datos de usuarios existentes que YA tienen rol programador

2. **Orden correcto**: Login → Cambiar rol → Editar datos → Agregar proyectos

3. **Horarios requeridos**: Los usuarios solo pueden solicitar asesorías en horarios configurados por el admin

4. **Simulación de notificaciones**: Los emails/WhatsApp se muestran en consola. Para implementar envío real, integrar APIs de SendGrid/Twilio

5. **Reglas de Firestore**: Asegúrate de que tu archivo `firestore.rules` permita lectura/escritura según roles

---

## 🔐 Recomendaciones de Seguridad

```javascript
// firestore.rules sugeridas
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /usuarios/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId 
                   || get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.role == 'admin';
    }
    
    match /asesorias/{asesoriaId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null 
                    && (request.auth.uid == resource.data.programadorUid 
                        || request.auth.uid == resource.data.usuarioUid);
    }
  }
}
```

---

¡Tu sistema ahora está completamente funcional con persistencia de sesión, gestión de roles mejorada, y notificaciones en tiempo real! 🎉
