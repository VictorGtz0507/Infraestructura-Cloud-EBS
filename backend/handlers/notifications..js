const ses = require('../lib/ses');
const db = require('../lib/database');

/**
 * Lambda para enviar notificaciones por email cuando se completan exámenes
 * Se activa por eventos SNS del tópico course-completed-topic
 */
exports.handler = async (event) => {
  console.log('📧 Notification Event:', JSON.stringify(event, null, 2));

  try {
    // Parsear el mensaje SNS
    let message;
    if (event.Records && event.Records[0]) {
      // Evento desde SNS
      message = JSON.parse(event.Records[0].Sns.Message);
    } else if (event.body) {
      // Evento directo (para testing)
      message = JSON.parse(event.body);
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Mensaje inválido' })
      };
    }

    // Obtener información del estudiante si no viene en el mensaje
    let studentEmail = message.studentEmail;
    let studentName = message.studentName;

    if (!studentEmail || !studentName) {
      const student = db.getById('users', message.studentId);
      if (student) {
        studentEmail = student.email;
        studentName = student.name;
      }
    }

    if (!studentEmail) {
      console.error('❌ No se pudo obtener el email del estudiante');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email del estudiante no disponible' })
      };
    }

    // Determinar el tipo de notificación
    const notificationType = message.passed ? 'completion' : 'attempt';

    // Obtener la plantilla de email correspondiente
    const templates = db.find('email_templates', { type: notificationType });
    const template = templates[0]; // Usar la primera plantilla encontrada

    if (!template) {
      console.error('❌ Plantilla de email no encontrada para tipo:', notificationType);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Plantilla de email no encontrada' })
      };
    }

    // Reemplazar variables en la plantilla
    let emailContent = template.content;
    let emailSubject = template.subject;

    const variables = {
      '{{nombre}}': studentName,
      '{{curso}}': message.courseName,
      '{{calificacion}}': message.score.toString(),
      '{{fecha}}': new Date().toLocaleDateString('es-ES')
    };

    // Reemplazar variables en el contenido
    Object.entries(variables).forEach(([key, value]) => {
      emailContent = emailContent.replace(new RegExp(key, 'g'), value);
      emailSubject = emailSubject.replace(new RegExp(key, 'g'), value);
    });

    // Enviar email usando SES
    const emailParams = {
      to: studentEmail,
      subject: emailSubject,
      html: emailContent,
      text: emailContent.replace(/<[^>]*>/g, '') // Versión texto plano
    };

    await ses.sendEmail(emailParams);

    // Registrar la notificación enviada
    const notificationRecord = db.create('notifications', {
      studentId: message.studentId,
      type: notificationType,
      email: studentEmail,
      subject: emailSubject,
      sentAt: new Date().toISOString(),
      courseId: message.courseId,
      score: message.score,
      passed: message.passed
    });

    console.log('✅ Notificación enviada exitosamente:', notificationRecord);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Notificación enviada exitosamente',
        data: notificationRecord
      })
    };

  } catch (error) {
    console.error('❌ Error enviando notificación:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      })
    };
  }
};