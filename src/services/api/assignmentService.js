class AssignmentService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'assignment_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { 
            field: { Name: "course_id_c" },
            referenceField: { field: { Name: "Name" } }
          },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "weight_c" } },
          { field: { Name: "grade_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } }
        ],
        orderBy: [
          {
            fieldName: "due_date_c",
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
        console.error("Error fetching assignments:", response.message);
        throw new Error(response.message);
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(assignment => ({
        Id: assignment.Id,
        title: assignment.title_c || assignment.Name || '',
        courseId: assignment.course_id_c?.Id || assignment.course_id_c,
        courseName: assignment.course_id_c?.Name || '',
        dueDate: assignment.due_date_c || null,
        priority: assignment.priority_c || 'medium',
        status: assignment.status_c || 'pending',
        category: assignment.category_c || 'assignment',
        weight: assignment.weight_c || 0,
        grade: assignment.grade_c || null,
        description: assignment.description_c || ''
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching assignments:", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching assignments:", error.message);
        throw error;
      }
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { 
            field: { Name: "course_id_c" },
            referenceField: { field: { Name: "Name" } }
          },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "weight_c" } },
          { field: { Name: "grade_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(`Error fetching assignment with ID ${id}:`, response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        return null;
      }

      const assignment = response.data;
      return {
        Id: assignment.Id,
        title: assignment.title_c || assignment.Name || '',
        courseId: assignment.course_id_c?.Id || assignment.course_id_c,
        courseName: assignment.course_id_c?.Name || '',
        dueDate: assignment.due_date_c || null,
        priority: assignment.priority_c || 'medium',
        status: assignment.status_c || 'pending',
        category: assignment.category_c || 'assignment',
        weight: assignment.weight_c || 0,
        grade: assignment.grade_c || null,
        description: assignment.description_c || ''
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching assignment with ID ${id}:`, error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error(`Error fetching assignment with ID ${id}:`, error.message);
        throw error;
      }
    }
  }

  async create(assignmentData) {
    try {
      const params = {
        records: [
          {
            Name: assignmentData.title || '',
            title_c: assignmentData.title || '',
            course_id_c: parseInt(assignmentData.courseId),
            due_date_c: assignmentData.dueDate || null,
            priority_c: assignmentData.priority || 'medium',
            status_c: assignmentData.status || 'pending',
            category_c: assignmentData.category || 'assignment',
            weight_c: parseFloat(assignmentData.weight) || 0,
            grade_c: assignmentData.grade ? parseFloat(assignmentData.grade) : null,
            description_c: assignmentData.description || '',
            Tags: assignmentData.Tags || '',
            Owner: assignmentData.Owner || null
          }
        ]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error creating assignment:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create assignment ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const createdAssignment = successfulRecords[0].data;
          return {
            Id: createdAssignment.Id,
            title: createdAssignment.title_c || createdAssignment.Name || '',
            courseId: createdAssignment.course_id_c?.Id || createdAssignment.course_id_c,
            courseName: createdAssignment.course_id_c?.Name || '',
            dueDate: createdAssignment.due_date_c || null,
            priority: createdAssignment.priority_c || 'medium',
            status: createdAssignment.status_c || 'pending',
            category: createdAssignment.category_c || 'assignment',
            weight: createdAssignment.weight_c || 0,
            grade: createdAssignment.grade_c || null,
            description: createdAssignment.description_c || ''
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating assignment:", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating assignment:", error.message);
        throw error;
      }
    }
  }

  async update(id, assignmentData) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: assignmentData.title || '',
            title_c: assignmentData.title || '',
            course_id_c: parseInt(assignmentData.courseId),
            due_date_c: assignmentData.dueDate || null,
            priority_c: assignmentData.priority || 'medium',
            status_c: assignmentData.status || 'pending',
            category_c: assignmentData.category || 'assignment',
            weight_c: parseFloat(assignmentData.weight) || 0,
            grade_c: assignmentData.grade ? parseFloat(assignmentData.grade) : null,
            description_c: assignmentData.description || '',
            Tags: assignmentData.Tags || '',
            Owner: assignmentData.Owner || null
          }
        ]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error updating assignment:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update assignment ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const updatedAssignment = successfulUpdates[0].data;
          return {
            Id: updatedAssignment.Id,
            title: updatedAssignment.title_c || updatedAssignment.Name || '',
            courseId: updatedAssignment.course_id_c?.Id || updatedAssignment.course_id_c,
            courseName: updatedAssignment.course_id_c?.Name || '',
            dueDate: updatedAssignment.due_date_c || null,
            priority: updatedAssignment.priority_c || 'medium',
            status: updatedAssignment.status_c || 'pending',
            category: updatedAssignment.category_c || 'assignment',
            weight: updatedAssignment.weight_c || 0,
            grade: updatedAssignment.grade_c || null,
            description: updatedAssignment.description_c || ''
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating assignment:", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating assignment:", error.message);
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
        console.error("Error deleting assignment:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete assignment ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return response.results.some(result => result.success);
      }
      
      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting assignment:", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting assignment:", error.message);
        throw error;
      }
    }
  }
}

export const assignmentService = new AssignmentService();