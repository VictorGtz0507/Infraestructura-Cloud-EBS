import React from 'react';
import { BookOpen, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <img src="/logo.png" alt="Escuela Bíblica Salem" className="h-8 w-8" />
              <span className="ml-2 text-xl font-bold">Escuela Bíblica Salem</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Preparando ministros piadosos para trabajar con más eficacia en el ministerio de la Iglesia.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center text-gray-300">
                <Mail className="h-4 w-4 mr-2" />
                <span className="text-sm">salemescuelabiblica@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li><Link to="/courses" className="text-gray-300 hover:text-white transition-colors">Cursos</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">Acerca de</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contacto</Link></li>
              <li><Link to="/help" className="text-gray-300 hover:text-white transition-colors">Ayuda</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Soporte</h3>
            <ul className="space-y-2">
              <li><Link to="/faq" className="text-gray-300 hover:text-white transition-colors">Preguntas Frecuentes</Link></li>
              <li><Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacidad</Link></li>
              <li><Link to="/terms" className="text-gray-300 hover:text-white transition-colors">Términos</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">&copy; 2025 Escuela Bíblica Salem. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};