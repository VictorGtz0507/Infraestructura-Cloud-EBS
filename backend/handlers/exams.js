const db = require('../lib/database');
const sns = require('../lib/sns');

/**
 * Lambda para procesar exámenes enviados por estudiantes
 * Calcula calificaciones y publica eventos a SNS
 */
exports.handler = async (event) => {
  console.log('📝 Exam Submission Event:', JSON.stringify(event, null, 2));

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

    const examData = JSON.parse(event.body);

    // Validaciones
    if (!examData.studentId || !examData.courseId || !examData.answers) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          error: 'studentId, courseId y answers son obligatorios'
        })
      };
    }

    // Obtener las respuestas correctas del cuestionario
    const quiz = db.getById('quizzes', examData.quizId);
    if (!quiz) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          error: 'Cuestionario no encontrado'
        })
      };
    }

    // Calcular calificación
    let correctAnswers = 0;
    const totalQuestions = quiz.questions.length;

    quiz.questions.forEach((question, index) => {
      if (examData.answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const passed = score >= quiz.passingScore;

    // Obtener información del estudiante
    const student = db.getById('users', examData.studentId);
    if (!student) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          error: 'Estudiante no encontrado'
        })
      };
    }

    // Registrar el resultado del examen
    const examResult = db.create('exam_results', {
      studentId: examData.studentId,
      courseId: examData.courseId,
      quizId: examData.quizId,
      score: score,
      correctAnswers: correctAnswers,
      totalQuestions: totalQuestions,
      passed: passed,
      submittedAt: new Date().toISOString(),
      attemptNumber: examData.attemptNumber || 1
    });

    // Actualizar progreso del estudiante
    const progress = db.getById('progress', `${examData.studentId}_${examData.courseId}`) || {
      studentId: examData.studentId,
      courseId: examData.courseId,
      completedLessons: 0,
      totalLessons: 10, // Esto debería venir de la configuración del curso
      examAttempts: 0,
      passedExams: 0,
      currentScore: 0
    };

    progress.examAttempts = (progress.examAttempts || 0) + 1;
    if (passed) {
      progress.passedExams = (progress.passedExams || 0) + 1;
    }
    progress.currentScore = score;

    db.update('progress', `${examData.studentId}_${examData.courseId}`, progress);

    // Publicar evento a SNS
    const snsMessage = {
      studentId: examData.studentId,
      studentName: student.name,
      studentEmail: student.email,
      courseId: examData.courseId,
      courseName: quiz.courseName,
      score: score,
      passed: passed,
      submittedAt: new Date().toISOString(),
      attemptNumber: examData.attemptNumber || 1
    };

    await sns.publish('course-completed-topic', snsMessage);

    console.log('✅ Examen procesado exitosamente:', examResult);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      },
      body: JSON.stringify({
        success: true,
        message: 'Examen procesado exitosamente',
        data: {
          examResult,
          score,
          passed,
          correctAnswers,
          totalQuestions
        }
      }, null, 2)
    };

  } catch (error) {
    console.error('❌ Error procesando examen:', error);

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