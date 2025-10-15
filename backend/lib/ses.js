/**
 * Librería para envío de emails con Amazon SES
 * Maneja notificaciones transaccionales y correos masivos
 */

const AWS = require('aws-sdk');

class SESService {
  constructor() {
    // Configurar AWS SDK
    AWS.config.update({
      region: process.env.AWS_REGION || 'us-east-1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });

    this.ses = new AWS.SES();
    this.sourceEmail = process.env.SES_SOURCE_EMAIL || 'noreply@ebsalem.com';

    console.log('📧 SES Service inicializado con email fuente:', this.sourceEmail);
  }

  /**
   * Enviar email básico
   */
  async sendEmail(params) {
    try {
      const emailParams = {
        Source: this.sourceEmail,
        Destination: {
          ToAddresses: Array.isArray(params.to) ? params.to : [params.to]
        },
        Message: {
          Subject: {
            Data: params.subject,
            Charset: 'UTF-8'
          },
          Body: {}
        }
      };

      // Agregar cuerpo HTML si existe
      if (params.html) {
        emailParams.Message.Body.Html = {
          Data: params.html,
          Charset: 'UTF-8'
        };
      }

      // Agregar cuerpo texto si existe
      if (params.text) {
        emailParams.Message.Body.Text = {
          Data: params.text,
          Charset: 'UTF-8'
        };
      }

      // Agregar CC si existe
      if (params.cc) {
        emailParams.Destination.CcAddresses = Array.isArray(params.cc) ? params.cc : [params.cc];
      }

      // Agregar BCC si existe
      if (params.bcc) {
        emailParams.Destination.BccAddresses = Array.isArray(params.bcc) ? params.bcc : [params.bcc];
      }

      console.log('📤 Enviando email a:', params.to, 'Asunto:', params.subject);

      const result = await this.ses.sendEmail(emailParams).promise();

      console.log('✅ Email enviado exitosamente, ID:', result.MessageId);
      return result;

    } catch (error) {
      console.error('❌ Error enviando email:', error);
      throw new Error(`Error al enviar email: ${error.message}`);
    }
  }

  /**
   * Enviar email de bienvenida a nuevo estudiante
   */
  async sendWelcomeEmail(studentEmail, studentName) {
    const subject = '¡Bienvenido a Escuela Bíblica Salem!';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0404E4; text-align: center;">¡Bienvenido a EBS Online!</h1>
        <p>Hola <strong>${studentName}</strong>,</p>
        <p>¡Nos alegra mucho tenerte con nosotros en la Escuela Bíblica Salem!</p>
        <p>Tu cuenta ha sido creada exitosamente y ya puedes comenzar tu viaje espiritual a través de nuestros cursos en línea.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login"
             style="background-color: #0404E4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Acceder a mi cuenta
          </a>
        </div>
        <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
        <p>¡Que Dios te bendiga!</p>
        <p>Atentamente,<br>El equipo de Escuela Bíblica Salem</p>
      </div>
    `;

    return await this.sendEmail({
      to: studentEmail,
      subject,
      html,
      text: `Hola ${studentName}, ¡Bienvenido a EBS Online! Tu cuenta ha sido creada exitosamente.`
    });
  }

  /**
   * Enviar email de felicitación por completar curso
   */
  async sendCompletionEmail(studentEmail, studentName, courseName, score) {
    const subject = `¡Felicitaciones! Has completado "${courseName}"`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0404E4; text-align: center;">¡Felicitaciones!</h1>
        <p>Hola <strong>${studentName}</strong>,</p>
        <p>¡Enhorabuena! Has completado exitosamente el curso <strong>"${courseName}"</strong> con una calificación de <strong>${score}%</strong>.</p>
        <p>Tu certificado está disponible en tu panel de estudiante. Puedes descargarlo y compartirlo con tu comunidad.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard"
             style="background-color: #0404E4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Ver mi certificado
          </a>
        </div>
        <p>¿Listo para continuar tu formación espiritual? Explora nuestros otros cursos disponibles.</p>
        <p>¡Sigue adelante en tu caminar con Dios!</p>
        <p>Atentamente,<br>El equipo de Escuela Bíblica Salem</p>
      </div>
    `;

    return await this.sendEmail({
      to: studentEmail,
      subject,
      html,
      text: `¡Felicitaciones ${studentName}! Has completado "${courseName}" con ${score}%. Tu certificado está disponible.`
    });
  }

  /**
   * Enviar email de recordatorio
   */
  async sendReminderEmail(studentEmail, studentName, daysInactive) {
    const subject = 'No olvides continuar tu aprendizaje espiritual';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0404E4; text-align: center;">¡Hola de nuevo!</h1>
        <p>Hola <strong>${studentName}</strong>,</p>
        <p>Hace ${daysInactive} días que no vemos actividad en tu cuenta de EBS Online.</p>
        <p>Te recordamos que tienes cursos pendientes por completar. ¡No pierdas el ritmo en tu formación espiritual!</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard"
             style="background-color: #0404E4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Continuar aprendiendo
          </a>
        </div>
        <p>Si tienes alguna dificultad o necesitas ayuda, estamos aquí para apoyarte.</p>
        <p>¡Que Dios te fortalezca!</p>
        <p>Atentamente,<br>El equipo de Escuela Bíblica Salem</p>
      </div>
    `;

    return await this.sendEmail({
      to: studentEmail,
      subject,
      html,
      text: `Hola ${studentName}, hace ${daysInactive} días que no vemos actividad en tu cuenta. ¡Continúa tu aprendizaje espiritual!`
    });
  }

  /**
   * Enviar email personalizado usando plantilla
   */
  async sendTemplatedEmail(templateId, recipientEmail, variables = {}) {
    // En una implementación real, obtendrías la plantilla de la base de datos
    // Por ahora, usamos plantillas hardcodeadas
    const templates = {
      'welcome': {
        subject: '¡Bienvenido a Escuela Bíblica Salem!',
        html: '<p>Hola {{name}}, ¡Bienvenido!</p>'
      },
      'completion': {
        subject: '¡Felicitaciones! Has completado {{course}}',
        html: '<p>¡Felicitaciones {{name}}! Has completado {{course}} con {{score}}%.</p>'
      }
    };

    const template = templates[templateId];
    if (!template) {
      throw new Error(`Plantilla ${templateId} no encontrada`);
    }

    let subject = template.subject;
    let html = template.html;

    // Reemplazar variables
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      subject = subject.replace(regex, value);
      html = html.replace(regex, value);
    });

    return await this.sendEmail({
      to: recipientEmail,
      subject,
      html
    });
  }

  /**
   * Verificar estado de SES
   */
  async checkStatus() {
    try {
      // Intentar enviar un email de prueba a una dirección verificada
      const testEmail = process.env.SES_TEST_EMAIL;
      if (!testEmail) {
        return { status: 'unknown', message: 'No hay email de prueba configurado' };
      }

      await this.sendEmail({
        to: testEmail,
        subject: 'SES Test Email',
        text: 'This is a test email to verify SES configuration.'
      });

      return { status: 'operational', message: 'SES está operativo' };

    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }
}

// Exportar instancia única
const ses = new SESService();

module.exports = {
  sendEmail: ses.sendEmail.bind(ses),
  sendWelcomeEmail: ses.sendWelcomeEmail.bind(ses),
  sendCompletionEmail: ses.sendCompletionEmail.bind(ses),
  sendReminderEmail: ses.sendReminderEmail.bind(ses),
  sendTemplatedEmail: ses.sendTemplatedEmail.bind(ses),
  checkStatus: ses.checkStatus.bind(ses)
};