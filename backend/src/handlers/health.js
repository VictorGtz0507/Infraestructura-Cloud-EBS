/**
 * Lambda de Health Check para EBS Online Platform
 * Versión Windows - CommonJS
 */

exports.handler = async (event) => {
  console.log('🔍 Health Check Event:', JSON.stringify(event, null, 2));

  try {
    const method = event.httpMethod;
    const body = event.body ? JSON.parse(event.body) : null;
    const queryParams = event.queryStringParameters || {};

    // Datos de ejemplo de cursos
    const mockCourses = [
      { id: 1, name: 'Fundamentos Bíblicos', level: 'Básico' },
      { id: 2, name: 'Estudio de los Evangelios', level: 'Intermedio' },
      { id: 3, name: 'Teología Sistemática', level: 'Avanzado' }
    ];

    // Respuesta personalizada
    const responseData = {
      status: 'healthy',
      service: 'EBS Online Platform',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      method: method,
      platform: 'Windows',
      features: {
        courses: mockCourses.length,
        students: 0,
        exams: 0
      },
      endpoints: {
        health: 'GET/POST /health',
        courses: 'GET/POST /courses',
        'course-by-id': 'GET /courses/{id}'
      }
    };

    // Si es POST, incluir el body recibido
    if (method === 'POST' && body) {
      responseData.receivedData = body;
    }

    // Si hay query parameters, incluirlos
    if (Object.keys(queryParams).length > 0) {
      responseData.queryParameters = queryParams;
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      },
      body: JSON.stringify(responseData, null, 2)
    };

  } catch (error) {
    console.error('❌ Error en Health Check:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        status: 'error',
        message: 'Internal server error',
        error: error.message
      })
    };
  }
};