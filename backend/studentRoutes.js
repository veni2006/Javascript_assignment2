const express = require('express');
const mongoose = require('mongoose');
const Student = require('../models/Student');

const router = express.Router();

/**
 * Helper: Validate student payload fields
 */
const validateStudentInput = (body) => {
  const { studentId, name, email, phone, department, year, gender } = body;

  if (
    !studentId ||
    !name ||
    !email ||
    !phone ||
    !department ||
    !year ||
    !gender
  ) {
    return 'All fields (Student ID, Name, Email, Phone, Department, Year, Gender) are required.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(String(email).trim())) {
    return 'Please provide a valid email address.';
  }

  const phoneRegex = /^[0-9+\-\s()]{7,15}$/;
  if (!phoneRegex.test(String(phone).trim())) {
    return 'Please provide a valid phone number (7 to 15 digits).';
  }

  const allowedGenders = ['Male', 'Female', 'Other'];
  if (!allowedGenders.includes(String(gender).trim())) {
    return 'Gender must be Male, Female, or Other.';
  }

  return null;
};

/**
 * @route   GET /api/students
 * @desc    Retrieve all students
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    console.error('Error fetching students:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve students from database.',
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/students/:id
 * @desc    Retrieve single student by MongoDB ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid MongoDB ID format.',
      });
    }

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student record not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.error('Error fetching student:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve student record.',
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/students
 * @desc    Add a new student record
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const validationError = validateStudentInput(req.body);
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const trimmedStudentId = String(req.body.studentId).trim();
    const trimmedName = String(req.body.name).trim();
    const trimmedEmail = String(req.body.email).trim().toLowerCase();
    const trimmedPhone = String(req.body.phone).trim();
    const trimmedDept = String(req.body.department).trim();
    const trimmedYear = String(req.body.year).trim();
    const trimmedGender = String(req.body.gender).trim();

    // Check if student with this Student ID already exists
    const existingStudent = await Student.findOne({ studentId: trimmedStudentId });
    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: `Student with ID '${trimmedStudentId}' already exists. Please use a unique Student ID.`,
      });
    }

    const newStudent = new Student({
      studentId: trimmedStudentId,
      name: trimmedName,
      email: trimmedEmail,
      phone: trimmedPhone,
      department: trimmedDept,
      year: trimmedYear,
      gender: trimmedGender,
    });

    const savedStudent = await newStudent.save();

    return res.status(201).json({
      success: true,
      message: 'Student added successfully!',
      data: savedStudent,
    });
  } catch (error) {
    // Handle duplicate key error from MongoDB unique index
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Student ID already exists. Please choose a different Student ID.',
      });
    }

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }

    console.error('Error adding student:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while adding student.',
      error: error.message,
    });
  }
});

/**
 * @route   PUT /api/students/:id
 * @desc    Update an existing student record
 * @access  Public
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid MongoDB ID format.',
      });
    }

    const studentToUpdate = await Student.findById(id);
    if (!studentToUpdate) {
      return res.status(404).json({
        success: false,
        message: 'Student record not found.',
      });
    }

    const validationError = validateStudentInput(req.body);
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const trimmedStudentId = String(req.body.studentId).trim();
    const trimmedName = String(req.body.name).trim();
    const trimmedEmail = String(req.body.email).trim().toLowerCase();
    const trimmedPhone = String(req.body.phone).trim();
    const trimmedDept = String(req.body.department).trim();
    const trimmedYear = String(req.body.year).trim();
    const trimmedGender = String(req.body.gender).trim();

    // Check if the new studentId belongs to another student
    if (trimmedStudentId !== studentToUpdate.studentId) {
      const duplicateId = await Student.findOne({
        studentId: trimmedStudentId,
        _id: { $ne: id },
      });

      if (duplicateId) {
        return res.status(409).json({
          success: false,
          message: `Student with ID '${trimmedStudentId}' already exists. Please use a unique Student ID.`,
        });
      }
    }

    // Update fields
    studentToUpdate.studentId = trimmedStudentId;
    studentToUpdate.name = trimmedName;
    studentToUpdate.email = trimmedEmail;
    studentToUpdate.phone = trimmedPhone;
    studentToUpdate.department = trimmedDept;
    studentToUpdate.year = trimmedYear;
    studentToUpdate.gender = trimmedGender;

    const updatedStudent = await studentToUpdate.save();

    return res.status(200).json({
      success: true,
      message: 'Student updated successfully!',
      data: updatedStudent,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Student ID already exists. Please choose a different Student ID.',
      });
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }

    console.error('Error updating student:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating student.',
      error: error.message,
    });
  }
});

/**
 * @route   DELETE /api/students/:id
 * @desc    Delete a student record
 * @access  Public
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid MongoDB ID format.',
      });
    }

    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).json({
        success: false,
        message: 'Student record not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Student deleted successfully!',
      data: deletedStudent,
    });
  } catch (error) {
    console.error('Error deleting student:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting student.',
      error: error.message,
    });
  }
});

module.exports = router;
