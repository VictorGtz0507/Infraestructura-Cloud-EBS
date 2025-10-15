/**
 * Librería para operaciones con Amazon S3
 * Maneja subida y descarga de archivos (certificados, materiales de cursos, etc.)
 */

const AWS = require('aws-sdk');

class S3Service {
  constructor() {
    // Configurar AWS SDK
    AWS.config.update({
      region: process.env.AWS_REGION || 'us-east-1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });

    this.s3 = new AWS.S3();
    this.bucketName = process.env.S3_BUCKET_NAME || 'ebs-online-platform-bucket';

    console.log('🪣 S3 Service inicializado con bucket:', this.bucketName);
  }

  /**
   * Subir archivo a S3
   */
  async uploadFile(key, buffer, contentType = 'application/octet-stream', options = {}) {
    try {
      const params = {
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        ACL: options.public ? 'public-read' : 'private',
        Metadata: options.metadata || {},
        ...options.additionalParams
      };

      console.log('📤 Subiendo archivo a S3:', key);

      const result = await this.s3.upload(params).promise();

      console.log('✅ Archivo subido exitosamente:', result.Location);
      return result;

    } catch (error) {
      console.error('❌ Error subiendo archivo a S3:', error);
      throw new Error(`Error al subir archivo: ${error.message}`);
    }
  }

  /**
   * Descargar archivo desde S3
   */
  async getFile(key) {
    try {
      const params = {
        Bucket: this.bucketName,
        Key: key
      };

      console.log('📥 Descargando archivo desde S3:', key);

      const result = await this.s3.getObject(params).promise();

      console.log('✅ Archivo descargado exitosamente');
      return {
        buffer: result.Body,
        contentType: result.ContentType,
        metadata: result.Metadata,
        lastModified: result.LastModified
      };

    } catch (error) {
      console.error('❌ Error descargando archivo desde S3:', error);

      if (error.code === 'NoSuchKey') {
        throw new Error('Archivo no encontrado');
      }

      throw new Error(`Error al descargar archivo: ${error.message}`);
    }
  }

  /**
   * Generar URL firmada para acceso temporal
   */
  async getSignedUrl(key, expiresIn = 3600) {
    try {
      const params = {
        Bucket: this.bucketName,
        Key: key,
        Expires: expiresIn
      };

      const signedUrl = await this.s3.getSignedUrlPromise('getObject', params);
      console.log('🔗 URL firmada generada para:', key);
      return signedUrl;

    } catch (error) {
      console.error('❌ Error generando URL firmada:', error);
      throw new Error(`Error generando URL: ${error.message}`);
    }
  }

  /**
   * Eliminar archivo de S3
   */
  async deleteFile(key) {
    try {
      const params = {
        Bucket: this.bucketName,
        Key: key
      };

      console.log('🗑️ Eliminando archivo de S3:', key);

      await this.s3.deleteObject(params).promise();

      console.log('✅ Archivo eliminado exitosamente');
      return true;

    } catch (error) {
      console.error('❌ Error eliminando archivo de S3:', error);
      throw new Error(`Error al eliminar archivo: ${error.message}`);
    }
  }

  /**
   * Listar archivos en un prefijo
   */
  async listFiles(prefix = '', maxKeys = 1000) {
    try {
      const params = {
        Bucket: this.bucketName,
        Prefix: prefix,
        MaxKeys: maxKeys
      };

      console.log('📋 Listando archivos en S3 con prefijo:', prefix);

      const result = await this.s3.listObjectsV2(params).promise();

      const files = result.Contents.map(obj => ({
        key: obj.Key,
        size: obj.Size,
        lastModified: obj.LastModified,
        etag: obj.ETag
      }));

      console.log(`✅ ${files.length} archivos encontrados`);
      return files;

    } catch (error) {
      console.error('❌ Error listando archivos en S3:', error);
      throw new Error(`Error al listar archivos: ${error.message}`);
    }
  }

  /**
   * Copiar archivo dentro de S3
   */
  async copyFile(sourceKey, destinationKey) {
    try {
      const params = {
        Bucket: this.bucketName,
        CopySource: `${this.bucketName}/${sourceKey}`,
        Key: destinationKey
      };

      console.log('📋 Copiando archivo en S3:', sourceKey, '→', destinationKey);

      const result = await this.s3.copyObject(params).promise();

      console.log('✅ Archivo copiado exitosamente');
      return result;

    } catch (error) {
      console.error('❌ Error copiando archivo en S3:', error);
      throw new Error(`Error al copiar archivo: ${error.message}`);
    }
  }

  /**
   * Subir certificado PDF (método específico)
   */
  async uploadCertificate(certificateId, pdfBuffer, studentId) {
    const key = `certificates/${studentId}/${certificateId}.pdf`;

    return await this.uploadFile(key, pdfBuffer, 'application/pdf', {
      public: false,
      metadata: {
        certificateId,
        studentId,
        uploadedAt: new Date().toISOString()
      }
    });
  }

  /**
   * Subir material de curso
   */
  async uploadCourseMaterial(courseId, fileName, fileBuffer, contentType) {
    const key = `courses/${courseId}/materials/${fileName}`;

    return await this.uploadFile(key, fileBuffer, contentType, {
      public: false,
      metadata: {
        courseId,
        fileName,
        uploadedAt: new Date().toISOString()
      }
    });
  }
}

// Exportar instancia única
const s3 = new S3Service();

module.exports = {
  uploadFile: s3.uploadFile.bind(s3),
  getFile: s3.getFile.bind(s3),
  getSignedUrl: s3.getSignedUrl.bind(s3),
  deleteFile: s3.deleteFile.bind(s3),
  listFiles: s3.listFiles.bind(s3),
  copyFile: s3.copyFile.bind(s3),
  uploadCertificate: s3.uploadCertificate.bind(s3),
  uploadCourseMaterial: s3.uploadCourseMaterial.bind(s3)
};