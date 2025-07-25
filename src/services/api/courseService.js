class CourseService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'course_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "code_c" } },
          { field: { Name: "credits_c" } },
          { field: { Name: "professor_c" } },
          { field: { Name: "color_c" } },
          { field: { Name: "current_grade_c" } },
          { field: { Name: "progress_c" } },
          { field: { Name: "next_assignment_c" } },
          { field: { Name: "schedule_c" } },
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
          limit: 50,
          offset: 0
        }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Error fetching courses:", response.message);
        throw new Error(response.message);
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(course => ({
        Id: course.Id,
        name: course.Name || '',
        code: course.code_c || '',
        credits: course.credits_c || 0,
        professor: course.professor_c || '',
        color: course.color_c || '#6366f1',
        currentGrade: course.current_grade_c || 0,
        progress: course.progress_c || 0,
        nextAssignment: course.next_assignment_c || null,
        schedule: this.parseSchedule(course.schedule_c)
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching courses:", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching courses:", error.message);
        throw error;
      }
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "code_c" } },
          { field: { Name: "credits_c" } },
          { field: { Name: "professor_c" } },
          { field: { Name: "color_c" } },
          { field: { Name: "current_grade_c" } },
          { field: { Name: "progress_c" } },
          { field: { Name: "next_assignment_c" } },
          { field: { Name: "schedule_c" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(`Error fetching course with ID ${id}:`, response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        return null;
      }

      const course = response.data;
      return {
        Id: course.Id,
        name: course.Name || '',
        code: course.code_c || '',
        credits: course.credits_c || 0,
        professor: course.professor_c || '',
        color: course.color_c || '#6366f1',
        currentGrade: course.current_grade_c || 0,
        progress: course.progress_c || 0,
        nextAssignment: course.next_assignment_c || null,
        schedule: this.parseSchedule(course.schedule_c)
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching course with ID ${id}:`, error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error(`Error fetching course with ID ${id}:`, error.message);
        throw error;
      }
    }
  }

  async create(courseData) {
    try {
      const params = {
        records: [
          {
            Name: courseData.name || '',
            code_c: courseData.code || '',
            credits_c: parseInt(courseData.credits) || 0,
            professor_c: courseData.professor || '',
            color_c: courseData.color || '#6366f1',
            current_grade_c: courseData.currentGrade || 0,
            progress_c: courseData.progress || 0,
            next_assignment_c: courseData.nextAssignment || null,
            schedule_c: this.formatSchedule(courseData.schedule),
            Tags: courseData.Tags || '',
            Owner: courseData.Owner || null
          }
        ]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error creating course:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create course ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const createdCourse = successfulRecords[0].data;
          return {
            Id: createdCourse.Id,
            name: createdCourse.Name || '',
            code: createdCourse.code_c || '',
            credits: createdCourse.credits_c || 0,
            professor: createdCourse.professor_c || '',
            color: createdCourse.color_c || '#6366f1',
            currentGrade: createdCourse.current_grade_c || 0,
            progress: createdCourse.progress_c || 0,
            nextAssignment: createdCourse.next_assignment_c || null,
            schedule: this.parseSchedule(createdCourse.schedule_c)
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating course:", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating course:", error.message);
        throw error;
      }
    }
  }

  async update(id, courseData) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: courseData.name || '',
            code_c: courseData.code || '',
            credits_c: parseInt(courseData.credits) || 0,
            professor_c: courseData.professor || '',
            color_c: courseData.color || '#6366f1',
            current_grade_c: courseData.currentGrade || 0,
            progress_c: courseData.progress || 0,
            next_assignment_c: courseData.nextAssignment || null,
            schedule_c: this.formatSchedule(courseData.schedule),
            Tags: courseData.Tags || '',
            Owner: courseData.Owner || null
          }
        ]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error updating course:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update course ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const updatedCourse = successfulUpdates[0].data;
          return {
            Id: updatedCourse.Id,
            name: updatedCourse.Name || '',
            code: updatedCourse.code_c || '',
            credits: updatedCourse.credits_c || 0,
            professor: updatedCourse.professor_c || '',
            color: updatedCourse.color_c || '#6366f1',
            currentGrade: updatedCourse.current_grade_c || 0,
            progress: updatedCourse.progress_c || 0,
            nextAssignment: updatedCourse.next_assignment_c || null,
            schedule: this.parseSchedule(updatedCourse.schedule_c)
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating course:", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating course:", error.message);
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
        console.error("Error deleting course:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete course ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return response.results.some(result => result.success);
      }
      
      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting course:", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting course:", error.message);
        throw error;
      }
    }
  }

  parseSchedule(scheduleData) {
    if (!scheduleData) return [];
    try {
      if (typeof scheduleData === 'string') {
        return JSON.parse(scheduleData);
      }
      return Array.isArray(scheduleData) ? scheduleData : [];
    } catch (error) {
      console.error("Error parsing schedule data:", error);
      return [];
    }
  }

  formatSchedule(schedule) {
    if (!schedule || !Array.isArray(schedule)) return '';
    return JSON.stringify(schedule);
  }
}

export const courseService = new CourseService();