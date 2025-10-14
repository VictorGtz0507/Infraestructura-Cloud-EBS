/**
 * Base de datos en memoria compartida para EBS Online Platform
 * Versión de desarrollo - Los datos persisten durante la sesión del servidor
 */

// Base de datos en memoria (simula una base de datos compartida)
let dataStore = {
  courses: [
    {
      id: 1,
      name: 'Fundamentos Bíblicos',
      description: 'Curso introductorio al estudio de la Biblia',
      level: 'Básico',
      duration: '4 semanas',
      instructor: 'Pastor Juan Pérez',
      imageUrl: '/images/course1.jpg',
      lessons: 12,
      students: 45,
      price: 0,
      rating: 4.8,
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    },
    {
      id: 2,
      name: 'Estudio de los Evangelios',
      description: 'Análisis profundo de Mateo, Marcos, Lucas y Juan',
      level: 'Intermedio',
      duration: '6 semanas',
      instructor: 'Dra. María González',
      imageUrl: '/images/course2.jpg',
      lessons: 18,
      students: 32,
      price: 0,
      rating: 4.9,
      createdAt: '2024-01-20T00:00:00Z',
      updatedAt: '2024-01-20T00:00:00Z'
    },
    {
      id: 3,
      name: 'Teología Sistemática Avanzada',
      description: 'Estudio detallado de las doctrinas cristianas',
      level: 'Avanzado',
      duration: '8 semanas',
      instructor: 'Dr. Carlos Rodríguez',
      imageUrl: '/images/course3.jpg',
      lessons: 24,
      students: 28,
      price: 0,
      rating: 4.7,
      createdAt: '2024-01-25T00:00:00Z',
      updatedAt: '2024-01-25T00:00:00Z'
    }
  ],
  users: [],
  exams: [],
  certificates: [],
  notifications: []
};

// Contador para IDs únicos
let idCounters = {
  courses: 3,
  users: 0,
  exams: 0,
  certificates: 0,
  notifications: 0
};

/**
 * Clase Database - Maneja operaciones CRUD para todas las entidades
 */
class Database {
  constructor() {
    // Inicializar si no existe en el objeto global
    if (!global.ebsDataStore) {
      global.ebsDataStore = JSON.parse(JSON.stringify(dataStore)); // Deep copy
      global.ebsIdCounters = { ...idCounters };
      console.log('🗄️ Base de datos EBS en memoria inicializada');
      console.log('📊 Datos iniciales:', global.ebsDataStore.courses.length, 'cursos');
    }

    // Usar referencias del global object
    this.dataStore = global.ebsDataStore;
    this.idCounters = global.ebsIdCounters;
  }

  // ============ MÉTODOS GENÉRICOS ============

  /**
   * Obtener todos los registros de una colección
   */
  getAll(collection) {
    return [...this.dataStore[collection]];
  }

  /**
   * Obtener un registro por ID
   */
  getById(collection, id) {
    const item = this.dataStore[collection].find(item => item.id === id);
    return item ? { ...item } : null;
  }

  /**
   * Crear un nuevo registro
   */
  create(collection, data) {
    this.idCounters[collection]++;
    const newItem = {
      id: this.idCounters[collection],
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.dataStore[collection].push(newItem);
    console.log(`✅ ${collection.slice(0, -1)} creado con ID: ${newItem.id}`);
    console.log(`📊 Total ${collection}: ${this.dataStore[collection].length}`);
    return { ...newItem };
  }

  /**
   * Actualizar un registro existente
   */
  update(collection, id, data) {
    const index = this.dataStore[collection].findIndex(item => item.id === id);
    if (index === -1) return null;

    const updatedItem = {
      ...this.dataStore[collection][index],
      ...data,
      id: id, // Asegurar que el ID no cambie
      updatedAt: new Date().toISOString()
    };

    this.dataStore[collection][index] = updatedItem;
    console.log(`🔄 ${collection.slice(0, -1)} actualizado con ID: ${id}`);
    return { ...updatedItem };
  }

  /**
   * Eliminar un registro
   */
  delete(collection, id) {
    const index = this.dataStore[collection].findIndex(item => item.id === id);
    if (index === -1) return false;

    this.dataStore[collection].splice(index, 1);
    console.log(`🗑️ ${collection.slice(0, -1)} eliminado con ID: ${id}`);
    return true;
  }

  /**
   * Buscar registros con filtros
   */
  find(collection, filters = {}) {
    let results = [...this.dataStore[collection]];

    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null) {
        results = results.filter(item => {
          const itemValue = item[key];
          const filterValue = filters[key];

          if (typeof itemValue === 'string' && typeof filterValue === 'string') {
            return itemValue.toLowerCase().includes(filterValue.toLowerCase());
          }

          return itemValue == filterValue;
        });
      }
    });

    return results;
  }

  // ============ MÉTODOS ESPECÍFICOS PARA COURSES ============

  /**
   * Buscar cursos con filtros avanzados
   */
  searchCourses(filters = {}) {
    let courses = [...this.dataStore.courses];

    // Filtro por nivel
    if (filters.level) {
      courses = courses.filter(course =>
        course.level.toLowerCase() === filters.level.toLowerCase()
      );
    }

    // Búsqueda por texto
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      courses = courses.filter(course =>
        course.name.toLowerCase().includes(searchTerm) ||
        course.description.toLowerCase().includes(searchTerm) ||
        course.instructor.toLowerCase().includes(searchTerm)
      );
    }

    // Filtro por precio
    if (filters.maxPrice !== undefined) {
      courses = courses.filter(course => course.price <= filters.maxPrice);
    }

    if (filters.minPrice !== undefined) {
      courses = courses.filter(course => course.price >= filters.minPrice);
    }

    return courses;
  }

  /**
   * Obtener estadísticas de cursos
   */
  getCourseStats() {
    const courses = this.dataStore.courses;
    return {
      total: courses.length,
      byLevel: {
        Básico: courses.filter(c => c.level === 'Básico').length,
        Intermedio: courses.filter(c => c.level === 'Intermedio').length,
        Avanzado: courses.filter(c => c.level === 'Avanzado').length
      },
      averageRating: courses.length > 0 ?
        courses.reduce((sum, c) => sum + c.rating, 0) / courses.length : 0,
      totalStudents: courses.reduce((sum, c) => sum + c.students, 0)
    };
  }

  // ============ UTILIDADES ============

  /**
   * Limpiar todos los datos (para testing)
   */
  clearAll() {
    this.dataStore = {
      courses: [],
      users: [],
      exams: [],
      certificates: [],
      notifications: []
    };
    this.idCounters = {
      courses: 0,
      users: 0,
      exams: 0,
      certificates: 0,
      notifications: 0
    };
    global.ebsDataStore = this.dataStore;
    global.ebsIdCounters = this.idCounters;
    console.log('🧹 Base de datos limpiada');
  }

  /**
   * Obtener estado actual de la base de datos
   */
  getStats() {
    return {
      collections: Object.keys(this.dataStore).reduce((acc, key) => {
        acc[key] = this.dataStore[key].length;
        return acc;
      }, {}),
      lastUpdated: new Date().toISOString()
    };
  }
}

// Exportar instancia única
const db = new Database();

module.exports = db;