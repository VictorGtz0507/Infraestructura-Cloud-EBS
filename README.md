## Frontend

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)

## Base de Datos

![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)

## Backend y Servicios en la Nube (AWS)

![AWS Lambda](https://img.shields.io/badge/AWS%20Lambda-FF9900?style=for-the-badge&logo=aws-lambda&logoColor=white) ![Amazon API Gateway](https://img.shields.io/badge/Amazon%20API%20Gateway-FF4F8B?style=for-the-badge&logo=amazon-api-gateway&logoColor=white) ![Amazon SNS](https://img.shields.io/badge/Amazon%20SNS-E55B91?style=for-the-badge&logo=amazon-sns&logoColor=white) ![Amazon S3](https://img.shields.io/badge/Amazon%20S3-569A31?style=for-the-badge&logo=amazon-s3&logoColor=white) ![Amazon RDS](https://img.shields.io/badge/Amazon%20RDS-527FFF?style=for-the-badge&logo=amazon-rds&logoColor=white) ![Amazon Cognito](https://img.shields.io/badge/Amazon%20Cognito-DD344C?style=for-the-badge&logo=amazon-cognito&logoColor=white) ![Amazon SES](https://img.shields.io/badge/Amazon%20SES-3E8D91?style=for-the-badge&logo=amazon-ses&logoColor=white) ![Amazon Route 53](https://img.shields.io/badge/Amazon%20Route%2053-8C4FFF?style=for-the-badge&logo=amazon-route-53&logoColor=white) ![AWS WAF](https://img.shields.io/badge/AWS%20WAF-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white) ![AWS Amplify](https://img.shields.io/badge/AWS%20Amplify-FF9900?style=for-the-badge&logo=aws-amplify&logoColor=white) ![AWS Shield](https://img.shields.io/badge/AWS%20Shield-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)

## Herramientas de Desarrollo y Pruebas

![AWS SAM](https://img.shields.io/badge/AWS%20SAM-F29100?style=for-the-badge&logo=aws-sam&logoColor=white) ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white) ![LocalStack](https://img.shields.io/badge/LocalStack-4A90E2?style=for-the-badge&logo=localstack&logoColor=white) ![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white) ![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white) ![AWS CodeCommit](https://img.shields.io/badge/AWS%20CodeCommit-4554BE?style=for-the-badge&logo=aws-codecommit&logoColor=white) ![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white) ![AWS CodePipeline](https://img.shields.io/badge/AWS%20CodePipeline-527FFF?style=for-the-badge&logo=aws-codepipeline&logoColor=white)

## Monitorización y Observabilidad

![Amazon CloudWatch](https://img.shields.io/badge/Amazon%20CloudWatch-FF4F8B?style=for-the-badge&logo=amazon-cloudwatch&logoColor=white) ![AWS X-Ray](https://img.shields.io/badge/AWS%20X--Ray-78359B?style=for-the-badge&logo=aws-x-ray&logoColor=white)

# Plataforma de Cursos Online - Escuela Bíblica Salem

Este repositorio contiene la documentación y el código fuente para la **Plataforma de Cursos Modalidad Online** de la Escuela Bíblica Salem. Es una solución nativa de la nube, diseñada para ser robusta, escalable y costo-eficiente, aprovechando una arquitectura serverless y orientada a eventos en Amazon Web Services (AWS).

## Tabla de Contenidos
- [Sobre el Proyecto](#sobre-el-proyecto)
- [Arquitectura Cloud en AWS](#arquitectura-cloud-en-aws)
  - [Componentes Principales](#componentes-principales)
  - [Diagrama de la Arquitectura](#diagrama-de-la-arquitectura)
- [Flujos de Interacción](#flujos-de-interacción)
- [Desarrollo y Pruebas Locales](#desarrollo-y-pruebas-locales)
  - [Herramientas](#herramientas)
  - [Proceso de Prueba](#proceso-de-prueba)
- [Plan de Desarrollo - Sprints](#plan-de-desarrollo---sprints)

## Sobre el Proyecto

El objetivo principal es diseñar, desarrollar e implementar una plataforma educativa digital para la Escuela Bíblica Salem. Esta plataforma digitaliza los materiales académicos y automatiza procesos clave como la evaluación de estudiantes, el seguimiento del progreso y la emisión de certificados digitales.

El propósito de la arquitectura es:
*   **Optimización de Costos**: Un modelo de pago por uso que minimiza la inversión inicial.
*   **Escalabilidad y Elasticidad**: Capacidad de adaptarse automáticamente a la demanda de usuarios.
*   **Reducción de la Carga Operativa**: El uso de servicios administrados por AWS libera al equipo de la gestión de infraestructura.
*   **Seguridad Integral**: Múltiples capas de seguridad para proteger los datos y el acceso a la plataforma.
*   **Alta Disponibilidad y Resiliencia**: Un diseño desacoplado que mejora la tolerancia a fallos.

## Arquitectura Cloud en AWS

La solución se basa íntegramente en servicios de AWS, siguiendo un enfoque de microservicios y serverless.

### Componentes Principales

*   **Seguridad y Entrega de Contenido**:
    *   **Amazon Route 53**: Sistema de DNS y punto de entrada.
    *   **AWS WAF**: Protege la aplicación contra ataques web comunes (SQLi, XSS).
    *   **AWS Shield Standard**: Protección contra ataques DDoS.
    *   **AWS Amplify Hosting**: Despliegue y alojamiento continuo del frontend en React a través de una CDN global.

*   **Backend y Lógica de Negocio**:
    *   **Amazon API Gateway**: Punto de entrada centralizado y seguro para el backend (API RESTful).
    *   **AWS Lambda**: Núcleo de la computación serverless. Cada función representa un microservicio con una responsabilidad única (gestionar usuarios, calificar exámenes, etc.).
    *   **Amazon SNS**: Actúa como un bus de eventos (Pub/Sub) para desacoplar los microservicios y permitir la comunicación asíncrona.

*   **Datos, Identidad y Soporte**:
    *   **Amazon Cognito**: Gestiona la autenticación de usuarios, incluyendo soporte para MFA.
    *   **Amazon RDS (MySQL)**: Base de datos relacional para almacenar datos estructurados como perfiles de alumnos, cursos y calificaciones.
    *   **Amazon S3**: Almacenamiento de objetos para materiales de estudio (PDFs, videos) y certificados digitales.
    *   **Amazon SES**: Servicio de envío de correos electrónicos transaccionales (notificaciones, recordatorios, etc.).

### Diagrama de la Arquitectura
*(Basado en la descripción del documento)*
![Diagrama Arquitectura](Diagrama.png)

## Flujos de Interacción

1.  **Acceso y Carga de la Aplicación**:
    *   El usuario accede a `cursos.escuelasalem.com`.
    *   Route 53 resuelve el DNS.
    *   AWS WAF inspecciona y filtra la solicitud.
    *   AWS Amplify Hosting sirve la aplicación React al navegador.

2.  **Autenticación Segura**:
    *   El usuario introduce sus credenciales.
    *   La aplicación se comunica con Amazon Cognito para validar al usuario y generar tokens de seguridad (JWT).
    *   La librería de AWS Amplify gestiona automáticamente el ciclo de vida de los tokens.

3.  **Interacción con el Backend (Síncrona y Asíncrona)**:
    *   **Síncrona**: Al enviar un examen, la app React realiza una llamada POST a API Gateway. API Gateway valida el token con Cognito y enruta la solicitud a la Lambda correspondiente. La Lambda procesa el examen, lo guarda en RDS y devuelve una respuesta inmediata.
    *   **Asíncrona**: La Lambda de exámenes publica un evento en un tópico de SNS. Otras Lambdas suscritas (para generar certificados y enviar notificaciones por correo) se activan en segundo plano sin que el usuario tenga que esperar.
## Plan de Desarrollo - Sprints

### Sprint 1A: Infraestructura Cloud Base (02-oct → 15-oct 2025)

| Objetivo | Responsable(s) | Inicio | Entrega | Dependencia | Prioridad | Entregable |
|----------|---------------|--------|---------|-------------|-----------|------------|
| Configurar AWS Amplify Hosting | Víctor + Charly | 02-oct | 05-oct | Ninguna | 🔴 Alta | URL con app dummy desplegada |
| API Gateway + Lambda dummy (/ping) | Bryan + Luis | 02-oct | 07-oct | Ninguna | 🔴 Alta | Endpoint /ping probado en Postman |
| Instancia RDS + Secrets Manager | Bryan + Luis | 06-oct | 10-oct | Independiente | 🔴 Alta | Captura de conexión RDS desde Lambda |
| Configurar User Pool Cognito básico | Bryan + Luis | 11-oct | 15-oct | Depende de Amplify/API | 🔴 Alta | Captura de usuarios en Cognito |

### Sprint 1B – Seguridad y Roles (16-oct → 29-oct 2025)

| Objetivo | Responsable(s) | Inicio | Entrega | Dependencia | Prioridad | Entregable |
|----------|---------------|--------|---------|-------------|-----------|------------|
| UI de login en React (con mocks) | Víctor + Charly | 16-oct | 20-oct | Independiente | 🔴 Alta | Pantalla de login en React |
| Configurar MFA en Cognito | Bryan + Luis | 16-oct | 20-oct | Cognito básico | 🔴 Alta | MFA activado en consola Cognito |
| Definir roles Alumno/Admin/Coordinador | Bryan + Luis | 21-oct | 25-oct | Cognito | 🟠 Media | Tabla de roles documentada |
| Validar roles con JWT en frontend | Víctor + Charly | 26-oct | 29-oct | Roles en Cognito | 🟠 Media | Demo de login diferenciado por rol |

### Sprint 2 – Evaluaciones Core (30-oct → 13-nov 2025)

| Objetivo | Responsable(s) | Inicio | Entrega | Dependencia | Prioridad | Entregable |
|----------|---------------|--------|---------|-------------|-----------|------------|
| Tabla Exams en RDS | Bryan + Luis | 30-oct | 02-nov | RDS (Sprint 1) | 🔴 Alta | Script SQL en repositorio |
| Lambda ExamService (guardar respuestas) | Charly | 03-nov | 06-nov | Tabla Exams | 🔴 Alta | Endpoint POST /exam funcionando |
| UI de cuestionarios (con mocks) | Víctor | 30-oct | 06-nov | Independiente | 🔴 Alta | Captura cuestionario React |
| Lógica de score (80%, 3 intentos) | Bryan | 07-nov | 09-nov | ExamService | 🔴 Alta | Logs en CloudWatch con score |
| Integración UI ↔ Backend (mostrar score) | Víctor + Charly | 10-nov | 13-nov | Score listo | 🔴 Alta | Calificación mostrada en pantalla |

### Sprint 3 – Certificados y Progreso (14-nov → 28-nov 2025)

| Objetivo | Responsable(s) | Inicio | Entrega | Dependencia | Prioridad | Entregable |
|----------|---------------|--------|---------|-------------|-----------|------------|
| Lambda Certificados (PDF en S3) | Bryan + Luis | 14-nov | 18-nov | Exámenes aprobados | 🔴 Alta | Certificado PDF en bucket S3 |
| UI descarga certificado | Víctor | 19-nov | 20-nov | Certificados | 🔴 Alta | Botón de descarga funcionando |
| Barra de progreso en frontend | Víctor | 14-nov | 22-nov | Independiente | 🟠 Media | Captura de barra en UI |
| Backend de cálculo de progreso | Charly | 20-nov | 24-nov | RDS + Score | 🟠 Media | JSON con % completado |
| Comparación de progreso entre alumnos | Charly | 25-nov | 28-nov | Backend de progreso | 🟢 Baja | Demo comparativa en UI |

### Sprint 4 – Notificaciones & Interactividad (29-nov → 13-dic 2025)

| Objetivo | Responsable(s) | Inicio | Entrega | Dependencia | Prioridad | Entregable |
|----------|---------------|--------|---------|-------------|-----------|------------|
| Lambda Notificaciones (SES) | Bryan | 29-nov | 04-dic | Independiente | 🔴 Alta | Correo de prueba recibido |
| UI preferencias de notificación | Víctor | 01-dic | 06-dic | Lambda Notificaciones | 🟠 Media | Pantalla configuraciones |
| Foro de comentarios (backend) | Bryan | 05-dic | 08-dic | Independiente | 🟠 Media | Logs en CloudWatch con comentarios |
| Foro de comentarios (UI) | Víctor | 07-dic | 10-dic | Backend del foro | 🟠 Media | Foro visible en UI |
| Modo concentración UI | Luis | 07-dic | 12-dic | Independiente | 🟢 Baja | Toggle de "apagar luces" |

### Sprint 5 – Integración y Beta (14-dic → 05-ene 2026)

| Objetivo | Responsable(s) | Inicio | Entrega | Dependencia | Prioridad | Entregable |
|----------|---------------|--------|---------|-------------|-----------|------------|
| CI/CD pipeline (GitHub Actions / CodePipeline) | Charly | 14-dic | 20-dic | Infraestructura lista | 🔴 Alta | Pipeline corriendo en repo |
| Pruebas backend integradas | Bryan | 21-dic | 24-dic | CI/CD listo | 🔴 Alta | Reporte QA backend |
| Pruebas frontend end-to-end | Víctor | 26-dic | 29-dic | CI/CD listo | 🔴 Alta | Reporte QA UI |
| Deploy en Staging (Amplify) | Víctor + Charly | 02-ene | 03-ene | CI/CD listo | 🔴 Alta | URL Staging accesible |
| Demo Beta con stakeholders | Todos | 04-ene | 05-ene | Staging desplegado | 🔴 Alta | Acta de feedback firmada |

### Sprint 6 – Producción y Cierre (06-ene → 31-ene 2026)

| Objetivo | Responsable(s) | Inicio | Entrega | Dependencia | Prioridad | Entregable |
|----------|---------------|--------|---------|-------------|-----------|------------|
| Deploy a Producción (Amplify, Gateway, RDS, Lambdas) | Charly + Víctor | 06-ene | 10-ene | Beta validada | 🔴 Alta | URL oficial en producción |
| CloudWatch métricas + alarmas | Bryan + Luis | 11-ene | 15-ene | Producción activa | 🔴 Alta | Dashboard con alarmas |
| Capacitación a usuarios | Charly + Iván | 16-ene | 20-ene | Plataforma estable | 🟠 Media | Evidencia de capacitación |
| Hotfixes / iteraciones rápidas | Todos | 21-ene | 31-ene | Feedback usuarios | 🔴 Alta | Versión final estable |


## Desarrollo y Pruebas Locales

Para agilizar el desarrollo y evitar costos, se utiliza un entorno de emulación local que replica fielmente la arquitectura de AWS.

### Herramientas

*   **AWS SAM CLI**: Para emular localmente API Gateway y las funciones AWS Lambda.
*   **Docker**: Como motor de ejecución para los contenedores de las Lambdas y para levantar una base de datos MySQL local.
*   **LocalStack**: Para emular la comunicación asíncrona a través de Amazon SNS en el entorno local.
*   **Mocks y Variables de Entorno**: Para simular servicios como Amazon Cognito y SES sin realizar llamadas reales a la nube.

### Proceso de Prueba

El desarrollador puede ejecutar todo el sistema de forma local:
1.  **Backend**: Se inician los contenedores de MySQL y LocalStack, y luego se ejecuta `sam local start-api` para levantar el servidor de la API y las Lambdas.
2.  **Frontend**: Se ejecuta el servidor de desarrollo de React (`npm start`), configurado para apuntar a la API local.
3.  **Prueba End-to-End**: El desarrollador interactúa con la aplicación en el navegador. Las acciones generan llamadas al backend local, y es posible depurar tanto el flujo síncrono (respuesta en la interfaz) como el asíncrono (revisando los logs de LocalStack y las Lambdas suscritas).

# 🏛️ Estructura del Proyecto

Este proyecto utiliza una estructura de monorepo, lo que significa que todo el código del frontend, backend e infraestructura reside en un único repositorio. Esto facilita la gestión y la coherencia del desarrollo.

## Diagrama de Directorios

```
/
├── .github/
│   └── workflows/
├── backend/
│   ├── functions/
│   ├── layers/
│   ├── tests/
│   └── template.yaml
├── frontend/
│   ├── public/
│   └── src/
├── docs/
├── scripts/
├── docker-compose.yml
├── samconfig.toml
└── README.md
```

## Descripción de Directorios

**backend/**: Contiene toda la lógica del backend serverless.

- **functions/**: Alberga el código fuente de cada microservicio AWS Lambda de forma individual (ej. users, exams), manteniendo la lógica de negocio modular y organizada.

- **layers/**: Contiene código compartido entre múltiples funciones Lambda (ej. conectores de base de datos) para evitar la duplicación.

- **template.yaml**: Archivo de definición principal de AWS SAM (Serverless Application Model) que declara toda la infraestructura de AWS como código (API Gateway, Lambdas, SNS, RDS, etc.).

**frontend/**: Contiene la aplicación de usuario final desarrollada en React, la cual se despliega y aloja mediante AWS Amplify Hosting.

**.github/workflows/**: Define los pipelines de Integración Continua y Despliegue Continuo (CI/CD) utilizando herramientas como GitHub Actions.

**docker-compose.yml**: Archivo de configuración para levantar el entorno de desarrollo local. Permite emular servicios clave de AWS, como una base de datos MySQL en un contenedor y Amazon SNS a través de LocalStack, facilitando las pruebas end-to-end sin necesidad de desplegar en la nube.

**docs/**: Repositorio para la documentación del proyecto, como especificaciones de la API o diagramas de arquitectura.

**scripts/**: Almacena scripts de utilidad para tareas de desarrollo, como poblar la base de datos con datos de prueba.