/**
 * Librería de autenticación con Amazon Cognito
 * Maneja verificación de tokens JWT y obtención de información de usuarios
 */

const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');

// Cache para las claves públicas de Cognito
let cognitoKeys = null;
let keysLastFetched = null;
const KEYS_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 horas

class AuthService {
  constructor() {
    this.region = process.env.AWS_REGION || 'us-east-1';
    this.userPoolId = process.env.COGNITO_USER_POOL_ID;
    this.clientId = process.env.COGNITO_CLIENT_ID;

    if (!this.userPoolId) {
      console.warn('⚠️ COGNITO_USER_POOL_ID no configurado, usando modo simulado');
    }
  }

  /**
   * Obtener claves públicas de Cognito (con cache)
   */
  async getCognitoKeys() {
    const now = Date.now();

    if (cognitoKeys && keysLastFetched && (now - keysLastFetched) < KEYS_CACHE_DURATION) {
      return cognitoKeys;
    }

    try {
      const response = await fetch(`https://cognito-idp.${this.region}.amazonaws.com/${this.userPoolId}/.well-known/jwks.json`);

      if (!response.ok) {
        throw new Error(`Error obteniendo claves: ${response.status}`);
      }

      const jwks = await response.json();
      cognitoKeys = jwks.keys.reduce((acc, key) => {
        acc[key.kid] = jwkToPem(key);
        return acc;
      }, {});

      keysLastFetched = now;
      console.log('🔑 Claves de Cognito obtenidas y cacheadas');
      return cognitoKeys;

    } catch (error) {
      console.error('❌ Error obteniendo claves de Cognito:', error);

      // Fallback para desarrollo
      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 Usando claves simuladas para desarrollo');
        return {};
      }

      throw error;
    }
  }

  /**
   * Verificar token JWT de Cognito
   */
  async verifyToken(token) {
    try {
      if (!token) {
        throw new Error('Token no proporcionado');
      }

      // Decodificar header para obtener kid
      const decodedHeader = jwt.decode(token, { complete: true });
      if (!decodedHeader || !decodedHeader.header.kid) {
        throw new Error('Token inválido: falta kid');
      }

      // Obtener clave pública
      const keys = await this.getCognitoKeys();
      const pem = keys[decodedHeader.header.kid];

      if (!pem) {
        throw new Error('Clave pública no encontrada');
      }

      // Verificar token
      const decoded = jwt.verify(token, pem, {
        issuer: `https://cognito-idp.${this.region}.amazonaws.com/${this.userPoolId}`,
        audience: this.clientId
      });

      console.log('✅ Token verificado exitosamente');
      return decoded;

    } catch (error) {
      console.error('❌ Error verificando token:', error);

      // Para desarrollo, aceptar tokens simulados
      if (process.env.NODE_ENV === 'development' && token === 'dev-token') {
        console.log('🔧 Token de desarrollo aceptado');
        return {
          sub: 'dev-user-id',
          email: 'dev@example.com',
          'cognito:groups': ['student']
        };
      }

      throw error;
    }
  }

  /**
   * Obtener información del usuario desde Cognito
   */
  async getUserInfo(token) {
    try {
      const decoded = await this.verifyToken(token);

      // Extraer información relevante
      const userInfo = {
        id: decoded.sub,
        email: decoded.email,
        emailVerified: decoded.email_verified,
        groups: decoded['cognito:groups'] || [],
        username: decoded['cognito:username'],
        givenName: decoded.given_name,
        familyName: decoded.family_name,
        role: this.mapGroupsToRole(decoded['cognito:groups'] || [])
      };

      console.log('👤 Información de usuario obtenida:', userInfo);
      return userInfo;

    } catch (error) {
      console.error('❌ Error obteniendo información de usuario:', error);
      throw error;
    }
  }

  /**
   * Mapear grupos de Cognito a roles de la aplicación
   */
  mapGroupsToRole(groups) {
    if (groups.includes('admin')) return 'admin';
    if (groups.includes('teacher')) return 'teacher';
    if (groups.includes('student')) return 'student';
    return 'student'; // Default
  }

  /**
   * Verificar si el usuario tiene un rol específico
   */
  hasRole(token, requiredRole) {
    try {
      const decoded = jwt.decode(token);
      const groups = decoded['cognito:groups'] || [];
      const userRole = this.mapGroupsToRole(groups);

      const roleHierarchy = {
        'admin': 3,
        'teacher': 2,
        'student': 1
      };

      return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
    } catch (error) {
      console.error('❌ Error verificando rol:', error);
      return false;
    }
  }

  /**
   * Generar token de desarrollo (solo para testing)
   */
  generateDevToken(userData = {}) {
    const defaultData = {
      sub: 'dev-user-id',
      email: 'dev@example.com',
      given_name: 'Usuario',
      family_name: 'Desarrollo',
      'cognito:username': 'devuser',
      'cognito:groups': ['student'],
      email_verified: true
    };

    const payload = { ...defaultData, ...userData };
    return jwt.sign(payload, 'dev-secret-key', { expiresIn: '24h' });
  }
}

// Exportar instancia única
const auth = new AuthService();

module.exports = {
  verifyToken: auth.verifyToken.bind(auth),
  getUserInfo: auth.getUserInfo.bind(auth),
  hasRole: auth.hasRole.bind(auth),
  generateDevToken: auth.generateDevToken.bind(auth)
};