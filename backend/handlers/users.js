/**
 * Lambda para gestión de usuarios de EBS Online
 * Versión con Base de Datos Compartida - CRUD Completo
 */

const db = require('../lib/database');

/**
 * Validar formato de email
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Obtener todos los usuarios
 */
exports.getUsers = async (event) => {
  console.log('👥 Get Users Event:', JSON.stringify(event, null, 2));

  try {
    const queryParams = event.queryStringParameters || {};

    // Usar la base de datos compartida para buscar usuarios
    const filteredUsers = db.find('users', queryParams);

    console.log('👥 Usuarios encontrados:', filteredUsers.length);
    console.log('👥 Filtros aplicados:', queryParams);

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
          users: filteredUsers,
          total: filteredUsers.length,
          filters: queryParams,
          stats: db.getStats()
        }
      }, null, 2)
    };

  } catch (error) {
    console.error('❌ Error obteniendo usuarios:', error);

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
 * Obtener usuario por ID
 */
exports.getUserById = async (event) => {
  console.log('🎯 Get User By ID Event:', JSON.stringify(event, null, 2));

  try {
    const userId = parseInt(event.pathParameters.id);

    if (isNaN(userId)) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          error: 'ID de usuario inválido'
        })
      };
    }

    const user = db.getById('users', userId);

    if (!user) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          error: 'Usuario no encontrado'
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
        data: user
      }, null, 2)
    };

  } catch (error) {
    console.error('❌ Error obteniendo usuario:', error);

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
 * Crear un nuevo usuario
 */
exports.createUser = async (event) => {
  console.log('🆕 Create User Event recibido');

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

    const userData = JSON.parse(event.body);

    // Validaciones
    if (!userData.name || !userData.name.trim()) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          error: 'El nombre es obligatorio'
        })
      };
    }

    if (!userData.email || !isValidEmail(userData.email)) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          error: 'Email válido es obligatorio'
        })
      };
    }

    // Verificar si el email ya existe
    const existingUsers = db.find('users', { email: userData.email });
    if (existingUsers.length > 0) {
      return {
        statusCode: 409,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          error: 'El email ya está registrado'
        })
      };
    }

    // Crear nuevo usuario usando la base de datos compartida
    const newUser = db.create('users', {
      name: userData.name.trim(),
      email: userData.email.toLowerCase().trim(),
      password: userData.password, // In production, this should be hashed
      role: userData.role || 'student',
      status: userData.status || 'active',
      phone: userData.phone || null,
      address: userData.address || null,
      birthDate: userData.birthDate || null,
      enrollmentDate: userData.enrollmentDate || new Date().toISOString().split('T')[0],
      lastLogin: null,
      profileImage: userData.profileImage || null
    });

    console.log('✅ Usuario creado exitosamente:', newUser);

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
        message: 'Usuario creado exitosamente',
        data: newUser
      }, null, 2)
    };

  } catch (error) {
    console.error('❌ Error creando usuario:', error);

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
 * Actualizar un usuario existente
 */
exports.updateUser = async (event) => {
  console.log('🔄 Update User Event:', JSON.stringify(event, null, 2));

  try {
    const userId = parseInt(event.pathParameters.id);

    if (isNaN(userId)) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          error: 'ID de usuario inválido'
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

    // Verificar que el usuario existe
    const existingUser = db.getById('users', userId);
    if (!existingUser) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          error: 'Usuario no encontrado'
        })
      };
    }

    // Validaciones para campos que se están actualizando
    if (updateData.name !== undefined && (!updateData.name || !updateData.name.trim())) {
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

    if (updateData.email !== undefined) {
      if (!updateData.email || !isValidEmail(updateData.email)) {
        return {
          statusCode: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({
            success: false,
            error: 'Email válido es requerido'
          })
        };
      }

      // Verificar si el email ya existe en otro usuario
      const usersWithEmail = db.find('users', { email: updateData.email.toLowerCase().trim() });
      if (usersWithEmail.length > 0 && usersWithEmail[0].id !== userId) {
        return {
          statusCode: 409,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({
            success: false,
            error: 'El email ya está registrado por otro usuario'
          })
        };
      }

      // Normalizar email
      updateData.email = updateData.email.toLowerCase().trim();
    }

    // Actualizar el usuario
    const updatedUser = db.update('users', userId, updateData);

    if (!updatedUser) {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          error: 'Error al actualizar el usuario'
        })
      };
    }

    console.log('✅ Usuario actualizado exitosamente:', updatedUser);

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
        message: 'Usuario actualizado exitosamente',
        data: updatedUser
      }, null, 2)
    };

  } catch (error) {
    console.error('❌ Error actualizando usuario:', error);

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
 * Eliminar un usuario
 */
exports.deleteUser = async (event) => {
  console.log('🗑️ Delete User Event:', JSON.stringify(event, null, 2));

  try {
    const userId = parseInt(event.pathParameters.id);

    if (isNaN(userId)) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          error: 'ID de usuario inválido'
        })
      };
    }

    // Verificar que el usuario existe
    const existingUser = db.getById('users', userId);
    if (!existingUser) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          error: 'Usuario no encontrado'
        })
      };
    }

    // Eliminar el usuario
    const deleted = db.delete('users', userId);

    if (!deleted) {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          error: 'Error al eliminar el usuario'
        })
      };
    }

    console.log('✅ Usuario eliminado exitosamente, ID:', userId);

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
        message: 'Usuario eliminado exitosamente',
        data: { id: userId }
      }, null, 2)
    };

  } catch (error) {
    console.error('❌ Error eliminando usuario:', error);

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