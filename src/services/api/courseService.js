import coursesData from "@/services/mockData/courses.json";

class CourseService {
  constructor() {
    this.courses = [...coursesData];
  }

  async getAll() {
    await this.delay();
    return [...this.courses];
  }

  async getById(id) {
    await this.delay();
    return this.courses.find(course => course.Id === id);
  }

  async create(courseData) {
    await this.delay();
    
    const newCourse = {
      ...courseData,
      Id: this.getNextId(),
      currentGrade: 0,
      progress: 0,
      nextAssignment: null
    };
    
    this.courses.push(newCourse);
    return { ...newCourse };
  }

  async update(id, courseData) {
    await this.delay();
    
    const index = this.courses.findIndex(course => course.Id === id);
    if (index === -1) {
      throw new Error("Course not found");
    }
    
    this.courses[index] = { ...this.courses[index], ...courseData };
    return { ...this.courses[index] };
  }

  async delete(id) {
    await this.delay();
    
    const index = this.courses.findIndex(course => course.Id === id);
    if (index === -1) {
      throw new Error("Course not found");
    }
    
    this.courses.splice(index, 1);
    return true;
  }

  getNextId() {
    const maxId = this.courses.reduce((max, course) => 
      course.Id > max ? course.Id : max, 0
    );
    return maxId + 1;
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, 300));
  }
}

export const courseService = new CourseService();