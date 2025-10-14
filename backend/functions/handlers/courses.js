/**
 * Lambda para gestión de cursos de EBS Online
 * Versión con Base de Datos Compartida - CRUD Completo
 */

const db = require('../lib/database');

/**
 * Obtener todos los cursos
 */
exports.getCourses = async (event) => {
  console.log('📚 Get Courses Event:', JSON.stringify(event, null, 2));

  try {
    const queryParams = event.queryStringParameters || {};

    // Usar la nueva base de datos compartida
    const filteredCourses = db.searchCourses(queryParams);

    console.log('📚 Cursos encontrados:', filteredCourses.length);
    console.log('📚 Filtros aplicados:', queryParams);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      },
      body: JSON.stringify({
        success: true,
        data: {
          courses: filteredCourses,
          total: filteredCourses.length,
          filters: queryParams,
          stats: db.getCourseStats()
        }
      }, null, 2)
    };

  } catch (error) {
    console.error('❌ Error obteniendo cursos:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      })
    };
  }
};

/**
 * Obtener curso por ID
 */
exports.getCourseById = async (event) => {
  console.log('🎯 Get Course By ID Event:', JSON.stringify(event, null, 2));

  try {
    const courseId = parseInt(event.pathParameters.id);

    if (isNaN(courseId)) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          error: 'ID de curso inválido'
        })
      };
    }

    const course = db.getById('courses', courseId);

    if (!course) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          error: 'Curso no encontrado'
        })
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      },
      body: JSON.stringify({
        success: true,
        data: course
      }, null, 2)
    };

  } catch (error) {
    console.error('❌ Error obteniendo curso:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      })
    };
  }
};

/**
 * Crear un nuevo curso
 */
exports.createCourse = async (event) => {
  console.log('🆕 Create Course Event recibido');

  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          error: 'Cuerpo de la solicitud vacío'
        })
      };
    }

    const courseData = JSON.parse(event.body);

    // Validaciones
    if (!courseData.name || !courseData.description) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          error: 'Nombre y descripción son obligatorios'
        })
      };
    }

    // Crear nuevo curso usando la base de datos compartida
    const newCourse = db.create('courses', {
      name: courseData.name,
      description: courseData.description,
      level: courseData.level || 'Básico',
      duration: courseData.duration || '4 semanas',
      instructor: courseData.instructor || 'Instructor EBS',
      imageUrl: courseData.imageUrl || '/images/default-course.jpg',
      lessons: courseData.lessons || 0,
      students: 0,
      price: courseData.price || 0,
      rating: 0
    });

    console.log('✅ Curso creado exitosamente:', newCourse);

    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      },
      body: JSON.stringify({
        success: true,
        message: 'Curso creado exitosamente',
        data: newCourse
      }, null, 2)
    };

  } catch (error) {
    console.error('❌ Error creando curso:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      })
    };
  }
};
/**
 * Actualizar un curso existente
 */
exports.updateCourse = async (event) => {
  console.log('🔄 Update Course Event:', JSON.stringify(event, null, 2));

  try {
    const courseId = parseInt(event.pathParameters.id);

    if (isNaN(courseId)) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          error: 'ID de curso inválido'
        })
      };
    }

    if (!event.body) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          error: 'Cuerpo de la solicitud vacío'
        })
      };
    }

    const updateData = JSON.parse(event.body);

    // Verificar que el curso existe
    const existingCourse = db.getById('courses', courseId);
    if (!existingCourse) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          error: 'Curso no encontrado'
        })
      };
    }

    // Validaciones para campos obligatorios si se están actualizando
    if (updateData.name !== undefined && !updateData.name.trim()) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          error: 'El nombre no puede estar vacío'
        })
      };
    }

    if (updateData.description !== undefined && !updateData.description.trim()) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          error: 'La descripción no puede estar vacía'
        })
      };
    }

    // Actualizar el curso
    const updatedCourse = db.update('courses', courseId, updateData);

    if (!updatedCourse) {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          error: 'Error al actualizar el curso'
        })
      };
    }

    console.log('✅ Curso actualizado exitosamente:', updatedCourse);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      },
      body: JSON.stringify({
        success: true,
        message: 'Curso actualizado exitosamente',
        data: updatedCourse
      }, null, 2)
    };

  } catch (error) {
    console.error('❌ Error actualizando curso:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      })
    };
  }
};

/**
 * Eliminar un curso
 */
exports.deleteCourse = async (event) => {
  console.log('🗑️ Delete Course Event:', JSON.stringify(event, null, 2));

  try {
    const courseId = parseInt(event.pathParameters.id);

    if (isNaN(courseId)) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          error: 'ID de curso inválido'
        })
      };
    }

    // Verificar que el curso existe
    const existingCourse = db.getById('courses', courseId);
    if (!existingCourse) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          error: 'Curso no encontrado'
        })
      };
    }

    // Eliminar el curso
    const deleted = db.delete('courses', courseId);

    if (!deleted) {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          error: 'Error al eliminar el curso'
        })
      };
    }

    console.log('✅ Curso eliminado exitosamente, ID:', courseId);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      },
      body: JSON.stringify({
        success: true,
        message: 'Curso eliminado exitosamente',
        data: { id: courseId }
      }, null, 2)
    };

  } catch (error) {
    console.error('❌ Error eliminando curso:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      })
    };
  }
};