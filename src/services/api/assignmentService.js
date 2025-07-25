import assignmentsData from "@/services/mockData/assignments.json";

class AssignmentService {
  constructor() {
    this.assignments = [...assignmentsData];
  }

  async getAll() {
    await this.delay();
    return [...this.assignments];
  }

  async getById(id) {
    await this.delay();
    return this.assignments.find(assignment => assignment.Id === id);
  }

  async create(assignmentData) {
    await this.delay();
    
    const newAssignment = {
      ...assignmentData,
      Id: this.getNextId(),
      grade: null
    };
    
    this.assignments.push(newAssignment);
    return { ...newAssignment };
  }

  async update(id, assignmentData) {
    await this.delay();
    
    const index = this.assignments.findIndex(assignment => assignment.Id === id);
    if (index === -1) {
      throw new Error("Assignment not found");
    }
    
    this.assignments[index] = { ...this.assignments[index], ...assignmentData };
    return { ...this.assignments[index] };
  }

  async delete(id) {
    await this.delay();
    
    const index = this.assignments.findIndex(assignment => assignment.Id === id);
    if (index === -1) {
      throw new Error("Assignment not found");
    }
    
    this.assignments.splice(index, 1);
    return true;
  }

  getNextId() {
    const maxId = this.assignments.reduce((max, assignment) => 
      assignment.Id > max ? assignment.Id : max, 0
    );
    return maxId + 1;
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, 200));
  }
}

export const assignmentService = new AssignmentService();