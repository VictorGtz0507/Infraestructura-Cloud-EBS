/**
 * Librería para generación de certificados PDF
 * Crea certificados personalizados usando datos del estudiante y curso
 */

const PDFDocument = require('pdfkit');

class PDFGenerator {
  constructor() {
    console.log('📄 PDF Generator inicializado');
  }

  /**
   * Generar certificado PDF
   */
  async generateCertificate(certificateData) {
    return new Promise((resolve, reject) => {
      try {
        // Crear nuevo documento PDF
        const doc = new PDFDocument({
          size: 'A4',
          layout: 'landscape',
          margin: 50
        });

        // Buffer para almacenar el PDF
        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(buffers);
          resolve(pdfBuffer);
        });

        // Fuentes y colores
        const primaryColor = '#0404E4'; // Azul primario
        const secondaryColor = '#666666';

        // Título principal
        doc.fontSize(36)
           .fillColor(primaryColor)
           .font('Helvetica-Bold')
           .text('ESCUELA BÍBLICA SALEM', 0, 100, { align: 'center' });

        // Subtítulo
        doc.fontSize(24)
           .fillColor(secondaryColor)
           .font('Helvetica')
           .text('Certificado de Finalización', 0, 150, { align: 'center' });

        // Línea decorativa
        doc.moveTo(150, 200)
           .lineTo(doc.page.width - 150, 200)
           .lineWidth(3)
           .strokeColor(primaryColor)
           .stroke();

        // Texto del certificado
        doc.fontSize(18)
           .fillColor('#000000')
           .font('Helvetica')
           .text('Se certifica que', 0, 250, { align: 'center' });

        // Nombre del estudiante
        doc.fontSize(32)
           .fillColor(primaryColor)
           .font('Helvetica-Bold')
           .text(certificateData.studentName, 0, 290, { align: 'center' });

        // Texto de completación
        doc.fontSize(16)
           .fillColor('#000000')
           .font('Helvetica')
           .text(`ha completado satisfactoriamente el curso de`, 0, 350, { align: 'center' });

        // Nombre del curso
        doc.fontSize(24)
           .fillColor(primaryColor)
           .font('Helvetica-Bold')
           .text(`"${certificateData.courseName}"`, 0, 380, { align: 'center' });

        // Calificación y fecha
        doc.fontSize(14)
           .fillColor(secondaryColor)
           .font('Helvetica')
           .text(`Con una calificación de ${certificateData.score}%`, 0, 430, { align: 'center' });

        doc.fontSize(14)
           .fillColor(secondaryColor)
           .font('Helvetica')
           .text(`Fecha de finalización: ${certificateData.completionDate}`, 0, 450, { align: 'center' });

        // ID del certificado
        doc.fontSize(10)
           .fillColor('#999999')
           .font('Helvetica')
           .text(`ID del Certificado: ${certificateData.certificateId}`, 0, 500, { align: 'center' });

        // Firma (simulada)
        doc.fontSize(12)
           .fillColor('#000000')
           .font('Helvetica')
           .text('Director Académico', 150, 520);

        doc.moveTo(150, 540)
           .lineTo(250, 540)
           .lineWidth(1)
           .strokeColor('#000000')
           .stroke();

        // Fecha de emisión
        doc.fontSize(10)
           .fillColor('#666666')
           .font('Helvetica')
           .text(`Emitido el ${new Date().toLocaleDateString('es-ES')}`, 0, 570, { align: 'center' });

        // Footer
        doc.fontSize(8)
           .fillColor('#999999')
           .font('Helvetica')
           .text('Este certificado es válido y ha sido generado por el sistema de Escuela Bíblica Salem', 0, doc.page.height - 80, {
             align: 'center',
             width: doc.page.width - 100
           });

        // Finalizar documento
        doc.end();

        console.log('✅ Certificado PDF generado para:', certificateData.studentName);

      } catch (error) {
        console.error('❌ Error generando certificado PDF:', error);
        reject(error);
      }
    });
  }

  /**
   * Generar reporte de progreso del estudiante
   */
  async generateProgressReport(studentData, courses) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margin: 50
        });

        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(buffers);
          resolve(pdfBuffer);
        });

        const primaryColor = '#0404E4';

        // Header
        doc.fontSize(24)
           .fillColor(primaryColor)
           .font('Helvetica-Bold')
           .text('Reporte de Progreso', 0, 50, { align: 'center' });

        doc.fontSize(16)
           .fillColor('#000000')
           .font('Helvetica')
           .text(`Estudiante: ${studentData.name}`, 50, 100);

        doc.fontSize(12)
           .fillColor('#666666')
           .text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 50, 120);

        // Tabla de cursos
        let yPosition = 160;

        doc.fontSize(14)
           .fillColor(primaryColor)
           .font('Helvetica-Bold')
           .text('Cursos Inscritos:', 50, yPosition);

        yPosition += 30;

        courses.forEach((course, index) => {
          doc.fontSize(12)
             .fillColor('#000000')
             .font('Helvetica-Bold')
             .text(`${index + 1}. ${course.name}`, 50, yPosition);

          doc.fontSize(10)
             .fillColor('#666666')
             .font('Helvetica')
             .text(`Progreso: ${course.progress}% | Estado: ${course.status}`, 70, yPosition + 15);

          yPosition += 40;
        });

        doc.end();

        console.log('✅ Reporte de progreso generado para:', studentData.name);

      } catch (error) {
        console.error('❌ Error generando reporte de progreso:', error);
        reject(error);
      }
    });
  }

  /**
   * Generar certificado de instructor
   */
  async generateInstructorCertificate(instructorData, courseData) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          layout: 'landscape',
          margin: 50
        });

        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(buffers);
          resolve(pdfBuffer);
        });

        const primaryColor = '#0404E4';

        // Diseño similar al certificado de estudiante pero para instructores
        doc.fontSize(36)
           .fillColor(primaryColor)
           .font('Helvetica-Bold')
           .text('ESCUELA BÍBLICA SALEM', 0, 100, { align: 'center' });

        doc.fontSize(24)
           .fillColor('#666666')
           .font('Helvetica')
           .text('Certificado de Instructor', 0, 150, { align: 'center' });

        // Contenido específico para instructores
        doc.fontSize(18)
           .fillColor('#000000')
           .font('Helvetica')
           .text('Se reconoce que', 0, 250, { align: 'center' });

        doc.fontSize(32)
           .fillColor(primaryColor)
           .font('Helvetica-Bold')
           .text(instructorData.name, 0, 290, { align: 'center' });

        doc.fontSize(16)
           .fillColor('#000000')
           .font('Helvetica')
           .text('ha servido como instructor del curso', 0, 350, { align: 'center' });

        doc.fontSize(24)
           .fillColor(primaryColor)
           .font('Helvetica-Bold')
           .text(`"${courseData.name}"`, 0, 380, { align: 'center' });

        doc.end();

        console.log('✅ Certificado de instructor generado para:', instructorData.name);

      } catch (error) {
        console.error('❌ Error generando certificado de instructor:', error);
        reject(error);
      }
    });
  }
}

// Exportar instancia única
const pdfGenerator = new PDFGenerator();

module.exports = {
  generateCertificate: pdfGenerator.generateCertificate.bind(pdfGenerator),
  generateProgressReport: pdfGenerator.generateProgressReport.bind(pdfGenerator),
  generateInstructorCertificate: pdfGenerator.generateInstructorCertificate.bind(pdfGenerator)
};