class WhatIfScenarioService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'whatifscenario_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { 
            field: { Name: "student_c" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { Name: "course_c" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { Name: "assignment_c" },
            referenceField: { field: { Name: "Name" } }
          },
          { field: { Name: "potential_grade_c" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } }
        ],
        orderBy: [
          {
            fieldName: "CreatedOn",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: 200,
          offset: 0
        }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Error fetching what-if scenarios:", response.message);
        throw new Error(response.message);
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(scenario => ({
        Id: scenario.Id,
        name: scenario.Name || '',
        studentId: scenario.student_c?.Id || scenario.student_c,
        studentName: scenario.student_c?.Name || '',
        courseId: scenario.course_c?.Id || scenario.course_c,
        courseName: scenario.course_c?.Name || '',
        assignmentId: scenario.assignment_c?.Id || scenario.assignment_c,
        assignmentName: scenario.assignment_c?.Name || '',
        potentialGrade: scenario.potential_grade_c || 0,
        tags: scenario.Tags || '',
        owner: scenario.Owner || '',
        createdOn: scenario.CreatedOn || null
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching what-if scenarios:", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching what-if scenarios:", error.message);
        throw error;
      }
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { 
            field: { Name: "student_c" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { Name: "course_c" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { Name: "assignment_c" },
            referenceField: { field: { Name: "Name" } }
          },
          { field: { Name: "potential_grade_c" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(`Error fetching what-if scenario with ID ${id}:`, response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        return null;
      }

      const scenario = response.data;
      return {
        Id: scenario.Id,
        name: scenario.Name || '',
        studentId: scenario.student_c?.Id || scenario.student_c,
        studentName: scenario.student_c?.Name || '',
        courseId: scenario.course_c?.Id || scenario.course_c,
        courseName: scenario.course_c?.Name || '',
        assignmentId: scenario.assignment_c?.Id || scenario.assignment_c,
        assignmentName: scenario.assignment_c?.Name || '',
        potentialGrade: scenario.potential_grade_c || 0,
        tags: scenario.Tags || '',
        owner: scenario.Owner || ''
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching what-if scenario with ID ${id}:`, error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error(`Error fetching what-if scenario with ID ${id}:`, error.message);
        throw error;
      }
    }
  }

  async create(scenarioData) {
    try {
      const params = {
        records: [
          {
            Name: scenarioData.name || '',
            student_c: scenarioData.studentId ? parseInt(scenarioData.studentId) : null,
            course_c: scenarioData.courseId ? parseInt(scenarioData.courseId) : null,
            assignment_c: scenarioData.assignmentId ? parseInt(scenarioData.assignmentId) : null,
            potential_grade_c: parseFloat(scenarioData.potentialGrade) || 0,
            Tags: scenarioData.tags || '',
            Owner: scenarioData.owner || null
          }
        ]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error creating what-if scenario:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create what-if scenario ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const createdScenario = successfulRecords[0].data;
          return {
            Id: createdScenario.Id,
            name: createdScenario.Name || '',
            studentId: createdScenario.student_c?.Id || createdScenario.student_c,
            studentName: createdScenario.student_c?.Name || '',
            courseId: createdScenario.course_c?.Id || createdScenario.course_c,
            courseName: createdScenario.course_c?.Name || '',
            assignmentId: createdScenario.assignment_c?.Id || createdScenario.assignment_c,
            assignmentName: createdScenario.assignment_c?.Name || '',
            potentialGrade: createdScenario.potential_grade_c || 0,
            tags: createdScenario.Tags || '',
            owner: createdScenario.Owner || ''
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating what-if scenario:", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating what-if scenario:", error.message);
        throw error;
      }
    }
  }

  async update(id, scenarioData) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: scenarioData.name || '',
            student_c: scenarioData.studentId ? parseInt(scenarioData.studentId) : null,
            course_c: scenarioData.courseId ? parseInt(scenarioData.courseId) : null,
            assignment_c: scenarioData.assignmentId ? parseInt(scenarioData.assignmentId) : null,
            potential_grade_c: parseFloat(scenarioData.potentialGrade) || 0,
            Tags: scenarioData.tags || '',
            Owner: scenarioData.owner || null
          }
        ]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error updating what-if scenario:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update what-if scenario ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const updatedScenario = successfulUpdates[0].data;
          return {
            Id: updatedScenario.Id,
            name: updatedScenario.Name || '',
            studentId: updatedScenario.student_c?.Id || updatedScenario.student_c,
            studentName: updatedScenario.student_c?.Name || '',
            courseId: updatedScenario.course_c?.Id || updatedScenario.course_c,
            courseName: updatedScenario.course_c?.Name || '',
            assignmentId: updatedScenario.assignment_c?.Id || updatedScenario.assignment_c,
            assignmentName: updatedScenario.assignment_c?.Name || '',
            potentialGrade: updatedScenario.potential_grade_c || 0,
            tags: updatedScenario.Tags || '',
            owner: updatedScenario.Owner || ''
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating what-if scenario:", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating what-if scenario:", error.message);
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
        console.error("Error deleting what-if scenario:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete what-if scenario ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return response.results.some(result => result.success);
      }
      
      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting what-if scenario:", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting what-if scenario:", error.message);
        throw error;
      }
    }
  }

  async getByCourse(courseId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "potential_grade_c" } },
          { field: { Name: "CreatedOn" } }
        ],
        where: [
          {
            FieldName: "course_c",
            Operator: "EqualTo",
            Values: [parseInt(courseId)]
          }
        ],
        orderBy: [
          {
            fieldName: "Name",
            sorttype: "ASC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Error fetching course scenarios:", response.message);
        throw new Error(response.message);
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      // Group scenarios by name (scenario base name)
      const groupedScenarios = {};
      response.data.forEach(scenario => {
        const baseName = scenario.Name.split(' - ')[0];
        if (!groupedScenarios[baseName]) {
          groupedScenarios[baseName] = {
            Id: scenario.Id,
            name: baseName,
            predictedGrade: scenario.potential_grade_c || 0,
            createdOn: scenario.CreatedOn
          };
        }
      });

      return Object.values(groupedScenarios);
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching course scenarios:", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching course scenarios:", error.message);
        throw error;
      }
    }
  }
}

export const whatIfScenarioService = new WhatIfScenarioService();