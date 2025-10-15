import { API, Auth } from 'aws-amplify';

class APIService {
  private async getAuthToken(): Promise<string> {
    try {
      const session = await Auth.currentSession();
      return session.getIdToken().getJwtToken();
    } catch (error) {
      throw new Error('No authenticated user');
    }
  }

  // Courses API
  async getCourses(filters?: any) {
    const token = await this.getAuthToken();
    return API.get('EBSAPI', '/courses', {
      headers: {
        Authorization: token
      },
      queryStringParameters: filters
    });
  }

  async createCourse(courseData: any) {
    const token = await this.getAuthToken();
    return API.post('EBSAPI', '/courses', {
      headers: {
        Authorization: token,
        'Content-Type': 'application/json'
      },
      body: courseData
    });
  }

  async updateCourse(courseId: number, courseData: any) {
    const token = await this.getAuthToken();
    return API.put('EBSAPI', `/courses/${courseId}`, {
      headers: {
        Authorization: token,
        'Content-Type': 'application/json'
      },
      body: courseData
    });
  }

  async deleteCourse(courseId: number) {
    const token = await this.getAuthToken();
    return API.del('EBSAPI', `/courses/${courseId}`, {
      headers: {
        Authorization: token
      }
    });
  }

  // Users API
  async getUsers(filters?: any) {
    const token = await this.getAuthToken();
    return API.get('EBSAPI', '/users', {
      headers: {
        Authorization: token
      },
      queryStringParameters: filters
    });
  }

  async createUser(userData: any) {
    const token = await this.getAuthToken();
    return API.post('EBSAPI', '/users', {
      headers: {
        Authorization: token,
        'Content-Type': 'application/json'
      },
      body: userData
    });
  }

  // Exams API
  async submitExam(examData: any) {
    const token = await this.getAuthToken();
    return API.post('EBSAPI', '/exams/submit', {
      headers: {
        Authorization: token,
        'Content-Type': 'application/json'
      },
      body: examData
    });
  }
}

export const apiService = new APIService();