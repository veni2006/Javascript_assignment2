import React, { useState, useEffect, useCallback } from 'react';
import studentService from './services/studentService';
import StudentForm from './components/StudentForm';
import StudentList from './components/StudentList';
import StudentViewModal from './components/StudentViewModal';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [viewingStudent, setViewingStudent] = useState(null);
  const [notification, setNotification] = useState({ type: '', message: '' });

  // Show notification helper with auto-clear
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification({ type: '', message: '' });
    }, 4500);
  };

  // Fetch all students from backend REST API
  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await studentService.getAllStudents();
      if (response && response.success) {
        setStudents(response.data || []);
      } else {
        setStudents([]);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      const errorMsg =
        error.response?.data?.message ||
        'Failed to connect to backend server. Make sure the backend is running on port 5000.';
      showNotification('error', errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Open form for adding a new student
  const handleAddNewClick = () => {
    setCurrentStudent(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open form for editing an existing student
  const handleEditClick = (student) => {
    setCurrentStudent(student);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancel form action
  const handleCancelForm = () => {
    setShowForm(false);
    setCurrentStudent(null);
  };

  // Save student (handles both Create and Update)
  const handleSaveStudent = async (studentData) => {
    try {
      if (currentStudent) {
        // UPDATE operation
        const response = await studentService.updateStudent(
          currentStudent._id,
          studentData
        );
        showNotification(
          'success',
          response.message || 'Student updated successfully!'
        );
      } else {
        // CREATE operation
        const response = await studentService.createStudent(studentData);
        showNotification(
          'success',
          response.message || 'Student added successfully!'
        );
      }

      // Close form and refresh student list
      setShowForm(false);
      setCurrentStudent(null);
      await fetchStudents();
    } catch (error) {
      console.error('Save student error:', error);
      const errorMsg =
        error.response?.data?.message ||
        'An error occurred while saving the student. Please try again.';
      showNotification('error', errorMsg);
      // Re-throw so form knows submission completed/failed
      throw error;
    }
  };

  // Delete student (DELETE operation)
  const handleDeleteStudent = async (id) => {
    try {
      const response = await studentService.deleteStudent(id);
      showNotification(
        'success',
        response.message || 'Student deleted successfully!'
      );
      // Refresh list
      await fetchStudents();
    } catch (error) {
      console.error('Delete student error:', error);
      const errorMsg =
        error.response?.data?.message ||
        'Failed to delete student record. Please try again.';
      showNotification('error', errorMsg);
    }
  };

  // View student details
  const handleViewStudent = (student) => {
    setViewingStudent(student);
  };

  // Close view modal
  const handleCloseViewModal = () => {
    setViewingStudent(null);
  };

  return (
    <div className="app-container">
      {/* Top Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="header-title-wrapper">
            <div className="header-icon">🎓</div>
            <div>
              <h1 className="header-title">Student Management System</h1>
              <p className="header-subtitle">
                MERN Stack College Practical Assignment Dashboard
              </p>
            </div>
          </div>
          <div className="header-stats">
            <div className="stat-card">
              <span className="stat-label">Total Students</span>
              <span className="stat-value">{students.length}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="main-content">
        {/* Notification Banner */}
        {notification.message && (
          <div
            className={`alert-banner ${notification.type === 'error' ? 'alert-error' : 'alert-success'
              }`}
          >
            <span className="alert-icon">
              {notification.type === 'error' ? '⚠️' : '✅'}
            </span>
            <span className="alert-message">{notification.message}</span>
            <button
              type="button"
              className="alert-close"
              onClick={() => setNotification({ type: '', message: '' })}
            >
              &times;
            </button>
          </div>
        )}

        {/* Action Bar */}
        <div className="action-bar">
          <div className="action-info">
            <h2 className="section-title">Dashboard Overview</h2>
            <p className="section-subtitle">
              Manage student enrollment, view profiles, and update academic information.
            </p>
          </div>
          {!showForm && (
            <button
              type="button"
              className="btn btn-primary btn-add"
              onClick={handleAddNewClick}
            >
              <span className="btn-icon">+</span> Add Student
            </button>
          )}
        </div>

        {/* Student Registration / Edit Form */}
        {showForm && (
          <StudentForm
            currentStudent={currentStudent}
            existingStudents={students}
            onSave={handleSaveStudent}
            onCancel={handleCancelForm}
          />
        )}

        {/* Student Records Table */}
        <StudentList
          students={students}
          loading={loading}
          onView={handleViewStudent}
          onEdit={handleEditClick}
          onDelete={handleDeleteStudent}
        />
      </main>

      {/* View Individual Student Details Modal */}
      {viewingStudent && (
        <StudentViewModal
          student={viewingStudent}
          onClose={handleCloseViewModal}
        />
      )}

      {/* Footer */}
      <footer className="app-footer">
        <p>Student Management System &bull; Built with MongoDB, Express, React, Node.js</p>
      </footer>
    </div>
  );
}

export default App;
