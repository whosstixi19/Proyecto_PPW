import { Injectable } from '@angular/core';
import { Programador, Asesoria } from '../models/user.model';

// Servicio para simular notificaciones por correo electrónico
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor() {}

  // Simular el envío de un correo al programador cuando se solicita una asesoría
  simularEnvioCorreo(
    programador: Programador,
    asesoria: {
      usuarioNombre: string;
      usuarioEmail: string;
      tema: string;
      descripcion: string;
      fechaSolicitada: string;
      horaSolicitada: string;
      comentario?: string;
    }
  ): Promise<{ success: boolean; emailContent: string }> {
    return new Promise((resolve) => {
      // Simular delay de red (1-2 segundos)
      const delay = Math.random() * 1000 + 1000;

      // Mostrar inicio del proceso en consola
      console.log('\n%c📧 INICIANDO ENVÍO DE CORREO ELECTRÓNICO...', 
        'background: #667eea; color: white; padding: 10px 20px; font-size: 14px; font-weight: bold; border-radius: 5px;');
      console.log('%c⏳ Preparando mensaje...', 'color: #f39c12; font-weight: bold;');

      setTimeout(() => {
        // Generar el contenido del correo
        const emailContent = this.generarContenidoCorreo(programador, asesoria);

        // Mostrar en consola con estilos (simulación)
        console.log('\n%c╔═══════════════════════════════════════════════════════════════╗', 'color: #667eea; font-weight: bold;');
        console.log('%c║           📧 CORREO ELECTRÓNICO ENVIADO CON ÉXITO           ║', 'color: #667eea; font-weight: bold;');
        console.log('%c╚═══════════════════════════════════════════════════════════════╝', 'color: #667eea; font-weight: bold;');
        
        console.log('\n%c📤 DATOS DEL ENVÍO:', 'background: #27ae60; color: white; padding: 5px 10px; font-weight: bold;');
        console.log('%c┌─────────────────────────────────────────────────────────────┐', 'color: #95a5a6;');
        console.log(`%c│ 👤 Destinatario: ${programador.displayName}`, 'color: #2c3e50; font-weight: bold;');
        console.log(`%c│ 📧 Email:        ${programador.email}`, 'color: #2c3e50;');
        console.log(`%c│ 📋 Asunto:       Nueva solicitud de asesoría - ${asesoria.tema}`, 'color: #2c3e50;');
        console.log(`%c│ 👨‍💼 Remitente:    ${asesoria.usuarioNombre}`, 'color: #2c3e50;');
        console.log(`%c│ 📅 Fecha:        ${asesoria.fechaSolicitada}`, 'color: #2c3e50;');
        console.log(`%c│ 🕐 Hora:         ${asesoria.horaSolicitada}`, 'color: #2c3e50;');
        console.log('%c└─────────────────────────────────────────────────────────────┘', 'color: #95a5a6;');
        
        console.log('\n%c📝 CONTENIDO DEL CORREO:', 'background: #3498db; color: white; padding: 5px 10px; font-weight: bold;');
        console.log('%c┌─────────────────────────────────────────────────────────────┐', 'color: #95a5a6;');
        console.log(`%c│ Tema:        ${asesoria.tema}`, 'color: #34495e;');
        console.log(`%c│ Descripción: ${asesoria.descripcion}`, 'color: #34495e;');
        if (asesoria.comentario) {
          console.log(`%c│ Comentario:  ${asesoria.comentario}`, 'color: #34495e;');
        }
        console.log('%c└─────────────────────────────────────────────────────────────┘', 'color: #95a5a6;');
        
        console.log('\n%c✅ ESTADO: Correo enviado exitosamente', 'background: #27ae60; color: white; padding: 8px 15px; font-size: 13px; font-weight: bold; border-radius: 3px;');
        console.log('%c⏱️  Tiempo de envío simulado: ' + (delay / 1000).toFixed(2) + 's', 'color: #7f8c8d;');
        console.log('%c═══════════════════════════════════════════════════════════════\n', 'color: #667eea; font-weight: bold;');

        resolve({
          success: true,
          emailContent: emailContent,
        });
      }, delay);
    });
  }

  // Generar el contenido del correo en formato HTML
  private generarContenidoCorreo(
    programador: Programador,
    asesoria: {
      usuarioNombre: string;
      usuarioEmail: string;
      tema: string;
      descripcion: string;
      fechaSolicitada: string;
      horaSolicitada: string;
      comentario?: string;
    }
  ): string {
    const fecha = new Date(asesoria.fechaSolicitada + 'T00:00:00');
    const fechaFormateada = fecha.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nueva Solicitud de Asesoría</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 24px;">📚 Nueva Solicitud de Asesoría</h1>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
    
    <p style="font-size: 16px; margin-bottom: 20px;">Hola <strong>${programador.displayName}</strong>,</p>
    
    <p style="font-size: 14px; color: #666; margin-bottom: 25px;">
      Has recibido una nueva solicitud de asesoría. A continuación encontrarás los detalles:
    </p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin-bottom: 20px;">
      <h2 style="color: #667eea; font-size: 18px; margin-top: 0;">Información del Estudiante</h2>
      <p style="margin: 8px 0;"><strong>👤 Nombre:</strong> ${asesoria.usuarioNombre}</p>
      <p style="margin: 8px 0;"><strong>📧 Email:</strong> <a href="mailto:${asesoria.usuarioEmail}" style="color: #667eea;">${asesoria.usuarioEmail}</a></p>
    </div>
    
    <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #764ba2; margin-bottom: 20px;">
      <h2 style="color: #764ba2; font-size: 18px; margin-top: 0;">Detalles de la Asesoría</h2>
      <p style="margin: 8px 0;"><strong>📋 Tema:</strong> ${asesoria.tema}</p>
      <p style="margin: 8px 0;"><strong>📝 Descripción:</strong></p>
      <p style="background: #f5f5f5; padding: 12px; border-radius: 5px; margin: 8px 0; font-style: italic;">
        ${asesoria.descripcion}
      </p>
      ${asesoria.comentario ? `
      <p style="margin: 8px 0;"><strong>💬 Comentarios adicionales:</strong></p>
      <p style="background: #f5f5f5; padding: 12px; border-radius: 5px; margin: 8px 0; font-style: italic;">
        ${asesoria.comentario}
      </p>
      ` : ''}
    </div>
    
    <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #27ae60; margin-bottom: 25px;">
      <h2 style="color: #27ae60; font-size: 18px; margin-top: 0;">📅 Fecha y Hora Solicitada</h2>
      <p style="margin: 8px 0; font-size: 16px;"><strong>📆 Fecha:</strong> ${fechaFormateada}</p>
      <p style="margin: 8px 0; font-size: 16px;"><strong>🕐 Hora:</strong> ${asesoria.horaSolicitada}</p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="http://localhost:4200/programador" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 15px 40px; border-radius: 25px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
        Ver Solicitud en la Plataforma
      </a>
    </div>
    
    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 25px 0;">
    
    <p style="font-size: 13px; color: #999; text-align: center; margin: 15px 0;">
      Este es un correo automático generado por el Sistema de Gestión de Asesorías.
      <br>Por favor, no respondas a este correo.
    </p>
    
    <p style="font-size: 12px; color: #bbb; text-align: center; margin-top: 20px;">
      © ${new Date().getFullYear()} Plataforma de Asesorías - Todos los derechos reservados
    </p>
    
  </div>
  
</body>
</html>
    `.trim();
  }

  // Simular envío de WhatsApp
  simularEnvioWhatsApp(
    programador: Programador,
    asesoria: {
      usuarioNombre: string;
      tema: string;
      fechaSolicitada: string;
      horaSolicitada: string;
    }
  ): Promise<{ success: boolean; message: string }> {
    return new Promise((resolve) => {
      const delay = Math.random() * 800 + 500;

      // Mostrar inicio del proceso
      console.log('\n%c💬 INICIANDO ENVÍO DE CORREO...', 
        'background: #25D366; color: white; padding: 10px 20px; font-size: 14px; font-weight: bold; border-radius: 5px;');
      console.log('%c⏳ Conectando con API de CORREO...', 'color: #f39c12; font-weight: bold;');

      setTimeout(() => {
        const mensaje = `
🔔 *Nueva Solicitud de Asesoría*

Hola ${programador.displayName},

${asesoria.usuarioNombre} ha solicitado una asesoría contigo.

 Tema: ${asesoria.tema}
 Fecha: ${asesoria.fechaSolicitada}
 Hora: ${asesoria.horaSolicitada}

        `.trim();

        console.log('\n%c╔═══════════════════════════════════════════════════════════════╗', 'color: #25D366; font-weight: bold;');
        console.log('%c║              💬 CORREO ENVIADO CON ÉXITO                   ║', 'color: #25D366; font-weight: bold;');
        console.log('%c╚═══════════════════════════════════════════════════════════════╝', 'color: #25D366; font-weight: bold;');
        console.log('\n%c📱 DATOS DEL ENVÍO:', 'background: #128C7E; color: white; padding: 5px 10px; font-weight: bold;');
        console.log('%c┌─────────────────────────────────────────────────────────────┐', 'color: #95a5a6;');
        console.log(`%c│ 👤 Destinatario:  ${programador.displayName}`, 'color: #2c3e50; font-weight: bold;');
        console.log(`%c│ 👨‍💼 Remitente:     ${asesoria.usuarioNombre}`, 'color: #2c3e50;');
        console.log(`%c│ 📋 Tipo:          Notificación de Asesoría`, 'color: #2c3e50;');
        console.log('%c└─────────────────────────────────────────────────────────────┘', 'color: #95a5a6;');
        console.log('\n%c💬 CONTENIDO DEL MENSAJE:', 'background: #25D366; color: white; padding: 5px 10px; font-weight: bold;');
        console.log('%c╭─────────────────────────────────────────────────────────────╮', 'color: #25D366;');
        const lines = mensaje.split('\n');
        lines.forEach(line => {
          if (line.trim()) {
            console.log(`%c│ ${line}`, 'color: #2c3e50;');
          }
        });
        console.log('%c╰─────────────────────────────────────────────────────────────╯', 'color: #25D366;');
        
        console.log('%c⏱️  Tiempo de envío simulado: ' + (delay / 1000).toFixed(2) + 's', 'color: #7f8c8d;');
        console.log('%c🔔 El programador recibirá una notificación push en su dispositivo', 'color: #7f8c8d; font-style: italic;');
        console.log('%c═══════════════════════════════════════════════════════════════\n', 'color: #25D366; font-weight: bold;');

        resolve({
          success: true,
          message: mensaje,
        });
      }, delay);
    });
  }
}
