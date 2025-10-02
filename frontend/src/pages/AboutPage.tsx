import React from 'react';
import { MapPin, Mail, Target, Eye } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sobre Nosotros
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Conoce más sobre la Escuela Bíblica Salem y nuestra misión de formar 
            ministros piadosos para el servicio eficaz en la Iglesia.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Visión */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Nuestra Visión</h2>
            </div>
            <blockquote className="text-lg text-gray-700 italic leading-relaxed">
              "Preparar ministros piadosos, para trabajar con más eficacia en el ministerio de la Iglesia."
            </blockquote>
            <p className="text-gray-600 mt-4">
              Nuestra visión nos impulsa a formar líderes espirituales comprometidos 
              con la excelencia en el servicio ministerial, equipándolos con las herramientas 
              necesarias para impactar positivamente sus comunidades.
            </p>
          </div>

          {/* Misión */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Nuestra Misión</h2>
            </div>
            <blockquote className="text-lg text-gray-700 italic leading-relaxed">
              "Ser capacitados para proclamar e inculcar por todos los medios posibles y 
              congruentes valores morales, cívicos y espirituales."
            </blockquote>
            <p className="text-gray-600 mt-4">
              A través de nuestra plataforma digital, buscamos capacitar a nuestros estudiantes 
              para que puedan transmitir valores fundamentales que transformen vidas y 
              fortalezcan el tejido social de nuestras comunidades.
            </p>
          </div>
        </div>

        {/* Información Institucional */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            Información Institucional
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Dirección */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Dirección</h3>
                <p className="text-gray-600">
                  Calle Leticia #209<br />
                  Col. Villas del Roble<br />
                  Reynosa, México
                </p>
              </div>
            </div>

            {/* Contacto */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Contacto</h3>
                <p className="text-gray-600">
                  <a href="mailto:salemescuelabiblica@gmail.com" className="hover:text-blue-600 transition-colors">
                    salemescuelabiblica@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Valores */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            Nuestros Valores
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">E</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Excelencia</h3>
              <p className="text-gray-600">
                Comprometidos con la más alta calidad en la formación espiritual y académica.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">I</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Integridad</h3>
              <p className="text-gray-600">
                Vivimos y enseñamos principios bíblicos sólidos y valores morales inquebrantables.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">S</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Servicio</h3>
              <p className="text-gray-600">
                Formamos siervos comprometidos con el ministerio y el servicio a la comunidad.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
