import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleLogout = () => {
    logout();
  };

 return (
 <>
   <style>{`
     /* New Burger Menu Styles */
     #menu-toggle:not(:checked), #menu-toggle:checked {
       display: none;
     }

     label {
       padding: 20px 30px;
       position: fixed;
       top: 0;
       left: 0;
       z-index: 1000;
       cursor: pointer;
     }

     label:before {
         top: 25px;
         left: 20px;
     }
     .menu-middle-bar {
         top: 35px;
         left: 20px;
     }
     label:after {
         top: 45px;
         left: 20px;
     }

     .menu-middle-bar, label:before, label:after {
       content: " ";
       position: fixed;
       width: 30px;
       height: 4px;
       background-color: white;
       border-radius: 2px;
       transition: .5s ease;
     }

     #menu {
       position: fixed;
       top: 65px;
       left: 20px;
       width: 0px;
       transition: .2s ease;
       z-index: 999;
       background-color: white;
       border-radius: 8px;
       box-shadow: 0 2px 5px rgba(0,0,0,0.26);
       padding: 0;
       margin: 0;
       list-style: none;
     }

     #menu li {
       line-height: 0.5;
       pointer-events: none;
       opacity: 0;
       font-family: 'Crimson Pro', serif;
       font-size: 14pt;
       color: #0404E4; /* primary-600 */
       text-decoration: none;
       padding: 8px 15px;
     }

     #menu li a {
       color: inherit;
       text-decoration: none;
     }

     #menu li a:focus {
       color: #0303B3; /* primary-700 */
       font-weight: 700;
       transition: .2s linear;
     }

     #menu-toggle:checked + label:before {
       top: 35px;
       transform: rotate(45deg);
     }

     #menu-toggle:checked + label .menu-middle-bar {
       opacity: 0;
     }

     #menu-toggle:checked + label:after {
       top: 35px;
       transform: rotate(-45deg);
     }

     #menu-toggle:checked + label + #menu {
       top: 65px;
       left: 20px;
       width: 180px;
       height: auto;
       transition: .3s ease .2s;
       z-index: 1001; /* Ensure menu is on top */
     }

     #menu-toggle:checked + label + #menu li {
       pointer-events: all;
       line-height: 2;
       opacity: 1;
       z-index: 1002;
       transition: .2s ease .3s;
     }
   `}</style>
   <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left: Hamburger Menu */}
            <div className="flex items-center relative">
              <input type="checkbox" id="menu-toggle" />
              <label htmlFor="menu-toggle">
                <div className="menu-middle-bar"></div>
              </label>
              <ul id="menu">
                <li><Link to="/cursos">Mis Cursos</Link></li>
                <li><Link to="/calendario">Calendario</Link></li>
                <li><Link to="/tareas">Tareas</Link></li>
                <li><Link to="/calificaciones">Calificaciones</Link></li>
              </ul>
            </div>

            {/* Center: Welcome Text */}
            <div className="flex-1 text-center">
              <h1 className="text-white font-bold text-lg">
                Bienvenido, {user.name}
              </h1>
            </div>

            {/* Right: Bell Icon and Logo */}
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-md text-white hover:bg-primary-700 transition-colors">
                <Bell className="h-5 w-5" />
              </button>
              <a href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <img src="/logo.png" alt="Escuela Bíblica Salem" className="h-8 w-8 filter brightness-0 invert" />
                <div className="text-white text-sm font-medium">
                  ESCUELA BÍBLICA<br />SALEM
                </div>
              </a>
            </div>
          </div>
        </div>

      </header>

      {/* Main Content */}
      <main className="relative">
        {/* Background Image Section */}
        <div
          className="h-96 bg-cover bg-center relative"
          style={{
            backgroundImage: 'url(/banne.jpeg)',
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center text-white px-4">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Jesus 101
              </h1>
              <h2 className="text-xl md:text-2xl font-semibold mb-2">
                Faustino el Profe
              </h2>
              <p className="text-lg max-w-2xl mx-auto">
                Esta es tu clase sobre Jesus 1, donde veras del primer jesus para luego ver al jesus 2
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Sections */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Cursos Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Cursos</h3>
              <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center">
                <p className="text-gray-500">Contenido de cursos aparecerá aquí</p>
              </div>
            </div>

            {/* Tareas Pendientes Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Tareas Pendientes</h3>
              <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center">
                <p className="text-gray-500">Tareas pendientes aparecerán aquí</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
    </>
  );
};