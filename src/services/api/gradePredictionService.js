class GradePredictionService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'gradeprediction_c';
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
            field: { Name: "scenario_c" },
            referenceField: { field: { Name: "Name" } }
          },
          { field: { Name: "predicted_grade_c" } },
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
          limit: 100,
          offset: 0
        }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Error fetching grade predictions:", response.message);
        throw new Error(response.message);
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(prediction => ({
        Id: prediction.Id,
        name: prediction.Name || '',
        studentId: prediction.student_c?.Id || prediction.student_c,
        studentName: prediction.student_c?.Name || '',
        courseId: prediction.course_c?.Id || prediction.course_c,
        courseName: prediction.course_c?.Name || '',
        scenarioId: prediction.scenario_c?.Id || prediction.scenario_c,
        scenarioName: prediction.scenario_c?.Name || '',
        predictedGrade: prediction.predicted_grade_c || 0,
        tags: prediction.Tags || '',
        owner: prediction.Owner || '',
        createdOn: prediction.CreatedOn || null
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching grade predictions:", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching grade predictions:", error.message);
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
            field: { Name: "scenario_c" },
            referenceField: { field: { Name: "Name" } }
          },
          { field: { Name: "predicted_grade_c" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(`Error fetching grade prediction with ID ${id}:`, response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        return null;
      }

      const prediction = response.data;
      return {
        Id: prediction.Id,
        name: prediction.Name || '',
        studentId: prediction.student_c?.Id || prediction.student_c,
        studentName: prediction.student_c?.Name || '',
        courseId: prediction.course_c?.Id || prediction.course_c,
        courseName: prediction.course_c?.Name || '',
        scenarioId: prediction.scenario_c?.Id || prediction.scenario_c,
        scenarioName: prediction.scenario_c?.Name || '',
        predictedGrade: prediction.predicted_grade_c || 0,
        tags: prediction.Tags || '',
        owner: prediction.Owner || ''
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching grade prediction with ID ${id}:`, error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error(`Error fetching grade prediction with ID ${id}:`, error.message);
        throw error;
      }
    }
  }

  async create(predictionData) {
    try {
      const params = {
        records: [
          {
            Name: predictionData.name || '',
            student_c: predictionData.studentId ? parseInt(predictionData.studentId) : null,
            course_c: predictionData.courseId ? parseInt(predictionData.courseId) : null,
            scenario_c: predictionData.scenarioId ? parseInt(predictionData.scenarioId) : null,
            predicted_grade_c: parseFloat(predictionData.predictedGrade) || 0,
            Tags: predictionData.tags || '',
            Owner: predictionData.owner || null
          }
        ]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error creating grade prediction:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create grade prediction ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const createdPrediction = successfulRecords[0].data;
          return {
            Id: createdPrediction.Id,
            name: createdPrediction.Name || '',
            studentId: createdPrediction.student_c?.Id || createdPrediction.student_c,
            studentName: createdPrediction.student_c?.Name || '',
            courseId: createdPrediction.course_c?.Id || createdPrediction.course_c,
            courseName: createdPrediction.course_c?.Name || '',
            scenarioId: createdPrediction.scenario_c?.Id || createdPrediction.scenario_c,
            scenarioName: createdPrediction.scenario_c?.Name || '',
            predictedGrade: createdPrediction.predicted_grade_c || 0,
            tags: createdPrediction.Tags || '',
            owner: createdPrediction.Owner || ''
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating grade prediction:", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating grade prediction:", error.message);
        throw error;
      }
    }
  }

  async update(id, predictionData) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: predictionData.name || '',
            student_c: predictionData.studentId ? parseInt(predictionData.studentId) : null,
            course_c: predictionData.courseId ? parseInt(predictionData.courseId) : null,
            scenario_c: predictionData.scenarioId ? parseInt(predictionData.scenarioId) : null,
            predicted_grade_c: parseFloat(predictionData.predictedGrade) || 0,
            Tags: predictionData.tags || '',
            Owner: predictionData.owner || null
          }
        ]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error updating grade prediction:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update grade prediction ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const updatedPrediction = successfulUpdates[0].data;
          return {
            Id: updatedPrediction.Id,
            name: updatedPrediction.Name || '',
            studentId: updatedPrediction.student_c?.Id || updatedPrediction.student_c,
            studentName: updatedPrediction.student_c?.Name || '',
            courseId: updatedPrediction.course_c?.Id || updatedPrediction.course_c,
            courseName: updatedPrediction.course_c?.Name || '',
            scenarioId: updatedPrediction.scenario_c?.Id || updatedPrediction.scenario_c,
            scenarioName: updatedPrediction.scenario_c?.Name || '',
            predictedGrade: updatedPrediction.predicted_grade_c || 0,
            tags: updatedPrediction.Tags || '',
            owner: updatedPrediction.Owner || ''
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating grade prediction:", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating grade prediction:", error.message);
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
        console.error("Error deleting grade prediction:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete grade prediction ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return response.results.some(result => result.success);
      }
      
      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting grade prediction:", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting grade prediction:", error.message);
        throw error;
      }
    }
  }

  async getByCourse(courseId) {
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
            field: { Name: "scenario_c" },
            referenceField: { field: { Name: "Name" } }
          },
          { field: { Name: "predicted_grade_c" } },
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
            fieldName: "CreatedOn",
            sorttype: "DESC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Error fetching course predictions:", response.message);
        throw new Error(response.message);
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(prediction => ({
        Id: prediction.Id,
        name: prediction.Name || '',
        predictedGrade: prediction.predicted_grade_c || 0,
        createdOn: prediction.CreatedOn || null
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching course predictions:", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching course predictions:", error.message);
        throw error;
      }
    }
  }
}

export const gradePredictionService = new GradePredictionService();