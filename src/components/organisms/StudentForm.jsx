import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";

const StudentForm = ({ student, courses, onSave, onCancel }) => {
const [formData, setFormData] = useState({
    name: "",
    studentId: "",
    courseId: "",
    grade: "",
    tags: "",
    dateOfBirth: "",
    gender: "",
    section: "",
    parentGuardianName: "",
    contactNumber: "",
    emailAddress: "",
    address: "",
    enrollmentDate: "",
    nationality: "",
    category: "",
    emergencyContactDetails: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || "",
        studentId: student.studentId || "",
        courseId: student.courseId || "",
        grade: student.grade || "",
        tags: student.tags || "",
        dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split('T')[0] : "",
        gender: student.gender || "",
        section: student.section || "",
        parentGuardianName: student.parentGuardianName || "",
        contactNumber: student.contactNumber || "",
        emailAddress: student.emailAddress || "",
        address: student.address || "",
        enrollmentDate: student.enrollmentDate ? new Date(student.enrollmentDate).toISOString().split('T')[0] : "",
        nationality: student.nationality || "",
        category: student.category || "",
        emergencyContactDetails: student.emergencyContactDetails || ""
      });
    }
  }, [student]);

const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!formData.studentId.trim()) {
      newErrors.studentId = "Admission number is required";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }

    if (!formData.parentGuardianName.trim()) {
      newErrors.parentGuardianName = "Parent/Guardian name is required";
    }

    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = "Contact number is required";
    }

    if (formData.emailAddress && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) {
      newErrors.emailAddress = "Please enter a valid email address";
    }

    if (!formData.enrollmentDate) {
      newErrors.enrollmentDate = "Enrollment date is required";
    }

    if (formData.grade && (isNaN(formData.grade) || formData.grade < 0 || formData.grade > 100)) {
      newErrors.grade = "Grade must be a number between 0 and 100";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const studentData = {
        ...formData,
        courseId: formData.courseId || null,
        grade: formData.grade ? parseInt(formData.grade) : null,
        dateOfBirth: formData.dateOfBirth || null,
        enrollmentDate: formData.enrollmentDate || null
      };
      
      await onSave(studentData);
    } catch (error) {
      console.error("Error saving student:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ApperIcon name="User" className="h-5 w-5 mr-2 text-primary-600" />
          {student ? "Edit Student" : "Add New Student"}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Full Name"
                error={errors.name}
                required
              >
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  className={errors.name ? "border-red-500" : ""}
                />
              </FormField>

              <FormField
                label="Date of Birth"
                error={errors.dateOfBirth}
                required
              >
                <Input
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className={errors.dateOfBirth ? "border-red-500" : ""}
                />
              </FormField>

              <FormField
                label="Gender"
                error={errors.gender}
                required
              >
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={errors.gender ? "border-red-500" : ""}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </Select>
              </FormField>

              <FormField
                label="Nationality"
                error={errors.nationality}
              >
                <Input
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  placeholder="Enter nationality"
                  className={errors.nationality ? "border-red-500" : ""}
                />
              </FormField>
            </div>
          </div>

          {/* Academic Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Academic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Admission Number / Student ID"
                error={errors.studentId}
                required
              >
                <Input
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  placeholder="Enter admission number"
                  className={errors.studentId ? "border-red-500" : ""}
                />
              </FormField>

              <FormField
                label="Grade / Class / Year (%)"
                error={errors.grade}
              >
                <Input
                  name="grade"
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={formData.grade}
                  onChange={handleChange}
                  placeholder="Enter grade (0-100)"
                  className={errors.grade ? "border-red-500" : ""}
                />
              </FormField>

              <FormField
                label="Section"
                error={errors.section}
              >
                <Input
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  placeholder="Enter section (e.g., A, B, C)"
                  className={errors.section ? "border-red-500" : ""}
                />
              </FormField>

              <FormField
                label="Course"
                error={errors.courseId}
              >
                <Select
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleChange}
                  className={errors.courseId ? "border-red-500" : ""}
                >
                  <option value="">Select a course</option>
                  {courses.map(course => (
                    <option key={course.Id} value={course.Id}>
                      {course.code} - {course.name}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField
                label="Enrollment Date"
                error={errors.enrollmentDate}
                required
              >
                <Input
                  name="enrollmentDate"
                  type="date"
                  value={formData.enrollmentDate}
                  onChange={handleChange}
                  className={errors.enrollmentDate ? "border-red-500" : ""}
                />
              </FormField>

              <FormField
                label="Category"
                error={errors.category}
              >
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={errors.category ? "border-red-500" : ""}
                >
                  <option value="">Select category</option>
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                </Select>
              </FormField>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Parent/Guardian Name"
                error={errors.parentGuardianName}
                required
              >
                <Input
                  name="parentGuardianName"
                  value={formData.parentGuardianName}
                  onChange={handleChange}
                  placeholder="Enter parent/guardian name"
                  className={errors.parentGuardianName ? "border-red-500" : ""}
                />
              </FormField>

              <FormField
                label="Contact Number (Parent/Student)"
                error={errors.contactNumber}
                required
              >
                <Input
                  name="contactNumber"
                  type="tel"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="Enter contact number"
                  className={errors.contactNumber ? "border-red-500" : ""}
                />
              </FormField>

              <FormField
                label="Email Address"
                error={errors.emailAddress}
              >
                <Input
                  name="emailAddress"
                  type="email"
                  value={formData.emailAddress}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className={errors.emailAddress ? "border-red-500" : ""}
                />
              </FormField>
            </div>

            <FormField
              label="Address"
              error={errors.address}
            >
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter complete address"
                rows={3}
                className={`flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:opacity-50 resize-none ${errors.address ? "border-red-500" : ""}`}
              />
            </FormField>
          </div>

          {/* Additional Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Additional Information
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <FormField
                label="Emergency Contact Details"
                error={errors.emergencyContactDetails}
              >
                <textarea
                  name="emergencyContactDetails"
                  value={formData.emergencyContactDetails}
                  onChange={handleChange}
                  placeholder="Enter emergency contact name, relationship, and phone number"
                  rows={3}
                  className={`flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:opacity-50 resize-none ${errors.emergencyContactDetails ? "border-red-500" : ""}`}
                />
              </FormField>

              <FormField
                label="Tags"
                error={errors.tags}
              >
                <Input
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="Enter tags (comma separated)"
                  className={errors.tags ? "border-red-500" : ""}
                />
              </FormField>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <ApperIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </div>
              ) : (
                <>
                  <ApperIcon name="Save" className="h-4 w-4 mr-2" />
                  {student ? "Update Student" : "Add Student"}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default StudentForm;