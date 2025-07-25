import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import Input from '@/components/atoms/Input';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import ApperIcon from '@/components/ApperIcon';
import { gradePredictionService } from '@/services/api/gradePredictionService';
import { whatIfScenarioService } from '@/services/api/whatIfScenarioService';
import { assignmentService } from '@/services/api/assignmentService';
import { courseService } from '@/services/api/courseService';
import { toast } from 'react-toastify';

const GradePrediction = () => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [scenarios, setScenarios] = useState([]);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [whatIfGrades, setWhatIfGrades] = useState({});
  const [predictions, setPredictions] = useState({
    currentGPA: 0,
    predictedGPA: 0,
    impact: 0
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [scenarioName, setScenarioName] = useState('');

  // Load courses on component mount
  useEffect(() => {
    loadCourses();
  }, []);

  // Load assignments when course is selected
  useEffect(() => {
    if (selectedCourse) {
      loadAssignments(selectedCourse);
      loadScenarios(selectedCourse);
    }
  }, [selectedCourse]);

  // Recalculate predictions when grades change
  useEffect(() => {
    if (assignments.length > 0) {
      calculatePredictions();
    }
  }, [assignments, whatIfGrades]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const coursesData = await courseService.getAll();
      setCourses(coursesData);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const loadAssignments = async (courseId) => {
    try {
      setLoading(true);
      setError(null);
      const assignmentsData = await assignmentService.getAll();
      const courseAssignments = assignmentsData.filter(
        assignment => assignment.courseId === parseInt(courseId)
      );
      setAssignments(courseAssignments);
      
      // Initialize what-if grades with current grades
      const initialGrades = {};
      courseAssignments.forEach(assignment => {
        initialGrades[assignment.Id] = assignment.grade || '';
      });
      setWhatIfGrades(initialGrades);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

const loadScenarios = async (courseId) => {
    try {
      const courseScenarios = await whatIfScenarioService.getByCourse(courseId);
      setScenarios(courseScenarios);
    } catch (err) {
      console.error('Failed to load scenarios:', err.message);
    }
  };

  const calculatePredictions = () => {
    if (assignments.length === 0) return;

    let currentWeightedScore = 0;
    let predictedWeightedScore = 0;
    let totalWeight = 0;

    assignments.forEach(assignment => {
      const weight = assignment.weight || 0;
      const currentGrade = assignment.grade || 0;
      const whatIfGrade = parseFloat(whatIfGrades[assignment.Id]) || currentGrade;

      totalWeight += weight;
      currentWeightedScore += (currentGrade * weight);
      predictedWeightedScore += (whatIfGrade * weight);
    });

    const currentGPA = totalWeight > 0 ? (currentWeightedScore / totalWeight) : 0;
    const predictedGPA = totalWeight > 0 ? (predictedWeightedScore / totalWeight) : 0;
    const impact = predictedGPA - currentGPA;

    setPredictions({
      currentGPA: Math.round(currentGPA * 100) / 100,
      predictedGPA: Math.round(predictedGPA * 100) / 100,
      impact: Math.round(impact * 100) / 100
    });
  };

  const handleGradeChange = (assignmentId, grade) => {
    setWhatIfGrades(prev => ({ ...prev, [assignmentId]: grade }));
  };

  const handleSaveScenario = async () => {
    if (!scenarioName.trim()) {
      toast.error('Please enter a scenario name');
      return;
    }

    if (!selectedCourse) {
      toast.error('Please select a course');
      return;
    }

    try {
      setSaving(true);
      
      // Save individual what-if scenarios for each assignment
      const scenarioPromises = Object.entries(whatIfGrades).map(([assignmentId, grade]) => {
        if (grade !== '') {
          return whatIfScenarioService.create({
            name: `${scenarioName} - Assignment ${assignmentId}`,
            courseId: parseInt(selectedCourse),
            assignmentId: parseInt(assignmentId),
            potentialGrade: parseFloat(grade) || 0
          });
        }
        return null;
      }).filter(Boolean);

      await Promise.all(scenarioPromises);

      // Save the overall grade prediction
      await gradePredictionService.create({
        name: scenarioName,
        courseId: parseInt(selectedCourse),
        predictedGrade: predictions.predictedGPA
      });

      toast.success('Scenario saved successfully');
      setScenarioName('');
      loadScenarios(selectedCourse);
    } catch (err) {
      toast.error('Failed to save scenario');
      console.error('Save scenario error:', err);
    } finally {
      setSaving(false);
    }
  };

const handleLoadScenario = async (scenario) => {
    try {
      setLoading(true);
      
      // Load all scenarios for this course and scenario name
      const allScenarios = await whatIfScenarioService.getAll();
      const relatedScenarios = allScenarios.filter(s => 
        s.courseId === parseInt(selectedCourse) && 
        s.name.startsWith(scenario.name.split(' - ')[0])
      );

      // Update what-if grades based on loaded scenario
      const loadedGrades = {};
      relatedScenarios.forEach(s => {
        if (s.assignmentId) {
          loadedGrades[s.assignmentId] = s.potentialGrade;
        }
      });

      setWhatIfGrades(loadedGrades);
      setCurrentScenario(scenario);
      toast.success('Scenario loaded successfully');
    } catch (err) {
      toast.error('Failed to load scenario');
      console.error('Load scenario error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetGrades = () => {
    const initialGrades = {};
    assignments.forEach(assignment => {
      initialGrades[assignment.Id] = assignment.grade || '';
    });
    setWhatIfGrades(initialGrades);
    setCurrentScenario(null);
    toast.info('Grades reset to current values');
  };

  if (loading && courses.length === 0) {
    return <Loading />;
  }

  if (error && courses.length === 0) {
    return <Error message={error} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display text-gradient">Grade Predictor</h1>
          <p className="text-gray-600 mt-2">
            Explore "what-if" scenarios to see how potential grades affect your GPA
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button onClick={resetGrades} variant="outline">
            <ApperIcon name="RotateCcw" className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Course Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ApperIcon name="BookOpen" className="h-5 w-5 mr-2" />
            Select Course
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full max-w-md"
          >
            <option value="">Choose a course...</option>
            {courses.map((course) => (
              <option key={course.Id} value={course.Id}>
                {course.code} - {course.name}
              </option>
            ))}
          </Select>
        </CardContent>
      </Card>

      {selectedCourse && (
        <>
          {/* GPA Prediction Display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {predictions.currentGPA}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Current GPA</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {predictions.predictedGPA}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Predicted GPA</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${
                    predictions.impact >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {predictions.impact >= 0 ? '+' : ''}{predictions.impact}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Impact</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* What-If Grade Inputs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ApperIcon name="Calculator" className="h-5 w-5 mr-2" />
                What-If Grade Scenarios
              </CardTitle>
            </CardHeader>
            <CardContent>
              {assignments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No assignments found for this course
                </div>
              ) : (
                <div className="space-y-4">
                  {assignments.map((assignment) => (
                    <div key={assignment.Id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{assignment.title}</div>
                        <div className="text-sm text-gray-600">
                          Weight: {assignment.weight}% | Current: {assignment.grade || 'Not graded'}
                        </div>
                      </div>
                      <div className="w-32">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          placeholder="Grade"
                          value={whatIfGrades[assignment.Id] || ''}
                          onChange={(e) => handleGradeChange(assignment.Id, e.target.value)}
                          className="text-center"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Scenario Management */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Save Scenario */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ApperIcon name="Save" className="h-5 w-5 mr-2" />
                  Save Scenario
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    placeholder="Scenario name..."
                    value={scenarioName}
                    onChange={(e) => setScenarioName(e.target.value)}
                  />
                  <Button 
                    onClick={handleSaveScenario} 
                    disabled={saving || !scenarioName.trim()}
                    className="w-full"
                  >
                    {saving ? (
                      <>
                        <ApperIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <ApperIcon name="Save" className="h-4 w-4 mr-2" />
                        Save Scenario
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Load Scenario */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ApperIcon name="FolderOpen" className="h-5 w-5 mr-2" />
                  Saved Scenarios
                </CardTitle>
              </CardHeader>
              <CardContent>
                {scenarios.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No saved scenarios
                  </div>
                ) : (
                  <div className="space-y-2">
                    {scenarios.slice(0, 5).map((scenario) => (
                      <button
                        key={scenario.Id}
                        onClick={() => handleLoadScenario(scenario)}
                        className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <div className="font-medium">{scenario.name}</div>
                        <div className="text-sm text-gray-600">
                          Predicted: {scenario.predictedGrade}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default GradePrediction;