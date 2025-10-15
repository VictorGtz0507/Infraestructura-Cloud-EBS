const s3 = require('../lib/s3');
const pdf = require('../lib/pdf-generator');
const db = require('../lib/database');

/**
 * Lambda para generar certificados PDF cuando un estudiante aprueba un curso
 * Se activa por eventos SNS del tópico course-completed-topic
 */
exports.handler = async (event) => {
  console.log('🎓 Certificate Generation Event:', JSON.stringify(event, null, 2));

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

    // Solo procesar si el estudiante aprobó
    if (!message.passed) {
      console.log('ℹ️ Estudiante no aprobó, no se genera certificado');
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'No aprobado, certificado no generado' })
      };
    }

    // Obtener información adicional del estudiante si no viene en el mensaje
    let studentName = message.studentName;
    if (!studentName) {
      const student = db.getById('users', message.studentId);
      studentName = student ? student.name : 'Estudiante';
    }

    // Obtener información del curso
    const course = db.getById('courses', message.courseId);
    const courseName = course ? course.name : message.courseName || 'Curso';

    // Generar datos del certificado
    const certificateData = {
      studentName: studentName,
      courseName: courseName,
      completionDate: new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      score: message.score,
      certificateId: `CERT-${message.studentId}-${message.courseId}-${Date.now()}`
    };

    // Generar PDF del certificado
    const pdfBuffer = await pdf.generateCertificate(certificateData);

    // Nombre del archivo en S3
    const fileName = `certificates/${message.studentId}/${certificateData.certificateId}.pdf`;

    // Subir a S3
    const s3Result = await s3.uploadFile(fileName, pdfBuffer, 'application/pdf');

    // Actualizar registro del estudiante con la URL del certificado
    const certificateRecord = db.create('certificates', {
      studentId: message.studentId,
      courseId: message.courseId,
      certificateId: certificateData.certificateId,
      fileName: fileName,
      s3Url: s3Result.Location,
      issuedAt: new Date().toISOString(),
      score: message.score
    });

    console.log('✅ Certificado generado exitosamente:', certificateRecord);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Certificado generado exitosamente',
        data: certificateRecord
      })
    };

  } catch (error) {
    console.error('❌ Error generando certificado:', error);

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