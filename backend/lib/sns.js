/**
 * Librería para publicación de eventos con Amazon SNS
 * Maneja comunicación asíncrona entre Lambdas
 */

const AWS = require('aws-sdk');

class SNSService {
  constructor() {
    // Configurar AWS SDK
    AWS.config.update({
      region: process.env.AWS_REGION || 'us-east-1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });

    this.sns = new AWS.SNS();

    // Topics ARN (en producción vendrían de variables de entorno)
    this.topics = {
      'course-completed': process.env.SNS_COURSE_COMPLETED_TOPIC || 'arn:aws:sns:us-east-1:123456789012:course-completed-topic',
      'user-registered': process.env.SNS_USER_REGISTERED_TOPIC || 'arn:aws:sns:us-east-1:123456789012:user-registered-topic',
      'certificate-generated': process.env.SNS_CERTIFICATE_GENERATED_TOPIC || 'arn:aws:sns:us-east-1:123456789012:certificate-generated-topic'
    };

    console.log('📢 SNS Service inicializado');
  }

  /**
   * Publicar mensaje en un topic
   */
  async publish(topicName, message, options = {}) {
    try {
      const topicArn = this.topics[topicName];

      if (!topicArn) {
        throw new Error(`Topic '${topicName}' no encontrado`);
      }

      const params = {
        TopicArn: topicArn,
        Message: JSON.stringify(message),
        MessageAttributes: {
          eventType: {
            DataType: 'String',
            StringValue: options.eventType || topicName
          },
          timestamp: {
            DataType: 'String',
            StringValue: new Date().toISOString()
          }
        },
        ...options.additionalParams
      };

      console.log('📢 Publicando evento en SNS:', topicName, message);

      const result = await this.sns.publish(params).promise();

      console.log('✅ Evento publicado exitosamente, ID:', result.MessageId);
      return result;

    } catch (error) {
      console.error('❌ Error publicando evento en SNS:', error);
      throw new Error(`Error al publicar evento: ${error.message}`);
    }
  }

  /**
   * Publicar evento de curso completado
   */
  async publishCourseCompleted(examResult) {
    const message = {
      eventType: 'course-completed',
      studentId: examResult.studentId,
      courseId: examResult.courseId,
      score: examResult.score,
      passed: examResult.passed,
      submittedAt: examResult.submittedAt,
      attemptNumber: examResult.attemptNumber
    };

    return await this.publish('course-completed', message, {
      eventType: 'course-completed'
    });
  }

  /**
   * Publicar evento de usuario registrado
   */
  async publishUserRegistered(userData) {
    const message = {
      eventType: 'user-registered',
      userId: userData.id,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      registeredAt: userData.createdAt
    };

    return await this.publish('user-registered', message, {
      eventType: 'user-registered'
    });
  }

  /**
   * Publicar evento de certificado generado
   */
  async publishCertificateGenerated(certificateData) {
    const message = {
      eventType: 'certificate-generated',
      certificateId: certificateData.certificateId,
      studentId: certificateData.studentId,
      courseId: certificateData.courseId,
      s3Url: certificateData.s3Url,
      generatedAt: certificateData.issuedAt
    };

    return await this.publish('certificate-generated', message, {
      eventType: 'certificate-generated'
    });
  }

  /**
   * Crear un topic (solo para desarrollo/testing)
   */
  async createTopic(topicName) {
    try {
      const params = {
        Name: topicName
      };

      console.log('🆕 Creando topic SNS:', topicName);

      const result = await this.sns.createTopic(params).promise();

      // Actualizar el ARN en la configuración
      this.topics[topicName] = result.TopicArn;

      console.log('✅ Topic creado exitosamente:', result.TopicArn);
      return result;

    } catch (error) {
      console.error('❌ Error creando topic SNS:', error);
      throw new Error(`Error al crear topic: ${error.message}`);
    }
  }

  /**
   * Listar topics disponibles
   */
  async listTopics() {
    try {
      const result = await this.sns.listTopics().promise();

      const topics = result.Topics.map(topic => {
        const arn = topic.TopicArn;
        const name = arn.split(':').pop();
        return { name, arn };
      });

      console.log('📋 Topics encontrados:', topics.length);
      return topics;

    } catch (error) {
      console.error('❌ Error listando topics:', error);
      throw new Error(`Error al listar topics: ${error.message}`);
    }
  }

  /**
   * Suscribir una Lambda a un topic
   */
  async subscribeLambda(topicName, lambdaArn) {
    try {
      const topicArn = this.topics[topicName];

      if (!topicArn) {
        throw new Error(`Topic '${topicName}' no encontrado`);
      }

      const params = {
        TopicArn: topicArn,
        Protocol: 'lambda',
        Endpoint: lambdaArn
      };

      console.log('🔗 Suscribiendo Lambda a topic:', topicName);

      const result = await this.sns.subscribe(params).promise();

      console.log('✅ Lambda suscrita exitosamente, ID:', result.SubscriptionArn);
      return result;

    } catch (error) {
      console.error('❌ Error suscribiendo Lambda:', error);
      throw new Error(`Error al suscribir Lambda: ${error.message}`);
    }
  }

  /**
   * Verificar estado de SNS
   */
  async checkStatus() {
    try {
      await this.listTopics();
      return { status: 'operational', message: 'SNS está operativo' };

    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }
}

// Exportar instancia única
const sns = new SNSService();

module.exports = {
  publish: sns.publish.bind(sns),
  publishCourseCompleted: sns.publishCourseCompleted.bind(sns),
  publishUserRegistered: sns.publishUserRegistered.bind(sns),
  publishCertificateGenerated: sns.publishCertificateGenerated.bind(sns),
  createTopic: sns.createTopic.bind(sns),
  listTopics: sns.listTopics.bind(sns),
  subscribeLambda: sns.subscribeLambda.bind(sns),
  checkStatus: sns.checkStatus.bind(sns)
};