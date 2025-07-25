class StudentService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'student_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "student_id_c" } },
          { 
            field: { Name: "course_c" },
            referenceField: { field: { Name: "Name" } }
          },
          { field: { Name: "grade_c" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } }
        ],
        orderBy: [
          {
            fieldName: "Name",
            sorttype: "ASC"
          }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Error fetching students:", response.message);
        throw new Error(response.message);
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(student => ({
        Id: student.Id,
        name: student.Name || '',
        studentId: student.student_id_c || '',
        courseId: student.course_c?.Id || student.course_c,
        courseName: student.course_c?.Name || '',
        grade: student.grade_c || null,
        tags: student.Tags || '',
        owner: student.Owner || ''
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching students:", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching students:", error.message);
        throw error;
      }
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "student_id_c" } },
          { 
            field: { Name: "course_c" },
            referenceField: { field: { Name: "Name" } }
          },
          { field: { Name: "grade_c" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(`Error fetching student with ID ${id}:`, response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        return null;
      }

      const student = response.data;
      return {
        Id: student.Id,
        name: student.Name || '',
        studentId: student.student_id_c || '',
        courseId: student.course_c?.Id || student.course_c,
        courseName: student.course_c?.Name || '',
        grade: student.grade_c || null,
        tags: student.Tags || '',
        owner: student.Owner || ''
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching student with ID ${id}:`, error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error(`Error fetching student with ID ${id}:`, error.message);
        throw error;
      }
    }
  }

  async create(studentData) {
    try {
      const params = {
        records: [
          {
            Name: studentData.name || '',
            student_id_c: studentData.studentId || '',
            course_c: studentData.courseId ? parseInt(studentData.courseId) : null,
            grade_c: studentData.grade ? parseFloat(studentData.grade) : null,
            Tags: studentData.tags || '',
            Owner: studentData.owner || null
          }
        ]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error creating student:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create student ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const createdStudent = successfulRecords[0].data;
          return {
            Id: createdStudent.Id,
            name: createdStudent.Name || '',
            studentId: createdStudent.student_id_c || '',
            courseId: createdStudent.course_c?.Id || createdStudent.course_c,
            courseName: createdStudent.course_c?.Name || '',
            grade: createdStudent.grade_c || null,
            tags: createdStudent.Tags || '',
            owner: createdStudent.Owner || ''
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating student:", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating student:", error.message);
        throw error;
      }
    }
  }

  async update(id, studentData) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: studentData.name || '',
            student_id_c: studentData.studentId || '',
            course_c: studentData.courseId ? parseInt(studentData.courseId) : null,
            grade_c: studentData.grade ? parseFloat(studentData.grade) : null,
            Tags: studentData.tags || '',
            Owner: studentData.owner || null
          }
        ]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error updating student:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update student ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const updatedStudent = successfulUpdates[0].data;
          return {
            Id: updatedStudent.Id,
            name: updatedStudent.Name || '',
            studentId: updatedStudent.student_id_c || '',
            courseId: updatedStudent.course_c?.Id || updatedStudent.course_c,
            courseName: updatedStudent.course_c?.Name || '',
            grade: updatedStudent.grade_c || null,
            tags: updatedStudent.Tags || '',
            owner: updatedStudent.Owner || ''
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating student:", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating student:", error.message);
        throw error;
      }
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error deleting student:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete student ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return response.results.some(result => result.success);
      }
      
      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting student:", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting student:", error.message);
        throw error;
      }
    }
  }
}

export const studentService = new StudentService();