const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// @route   GET /api/courses
// @desc    Get all active courses
// @access  Public
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find({ isActive: true })
            .select('-__v')
            .sort({ createdAt: 1 });

        res.json({ success: true, data: courses });

    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch courses' 
        });
    }
});

// @route   GET /api/courses/:courseId
// @desc    Get single course by courseId (slug)
// @access  Public
router.get('/:courseId', async (req, res) => {
    try {
        const course = await Course.findOne({ 
            courseId: req.params.courseId,
            isActive: true 
        });

        if (!course) {
            return res.status(404).json({ 
                success: false, 
                message: 'Course not found' 
            });
        }

        res.json({ success: true, data: course });

    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch course' 
        });
    }
});

// @route   POST /api/courses
// @desc    Create a new course (admin)
// @access  Private
router.post('/', async (req, res) => {
    try {
        const { courseId, title, description, icon, iconColor, eligibility, duration, fee, steps } = req.body;

        // Check if course already exists
        const existingCourse = await Course.findOne({ courseId });
        if (existingCourse) {
            return res.status(400).json({ 
                success: false, 
                message: 'Course with this ID already exists' 
            });
        }

        const course = new Course({
            courseId,
            title,
            description,
            icon,
            iconColor,
            eligibility,
            duration,
            fee,
            steps
        });

        await course.save();

        res.status(201).json({
            success: true,
            message: 'Course created successfully',
            data: course
        });

    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to create course' 
        });
    }
});

// @route   PUT /api/courses/:courseId
// @desc    Update a course
// @access  Private
router.put('/:courseId', async (req, res) => {
    try {
        const course = await Course.findOneAndUpdate(
            { courseId: req.params.courseId },
            { ...req.body, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        if (!course) {
            return res.status(404).json({ 
                success: false, 
                message: 'Course not found' 
            });
        }

        res.json({
            success: true,
            message: 'Course updated successfully',
            data: course
        });

    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update course' 
        });
    }
});

// @route   DELETE /api/courses/:courseId
// @desc    Delete a course (soft delete)
// @access  Private
router.delete('/:courseId', async (req, res) => {
    try {
        const course = await Course.findOneAndUpdate(
            { courseId: req.params.courseId },
            { isActive: false, updatedAt: Date.now() },
            { new: true }
        );

        if (!course) {
            return res.status(404).json({ 
                success: false, 
                message: 'Course not found' 
            });
        }

        res.json({
            success: true,
            message: 'Course deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to delete course' 
        });
    }
});

module.exports = router;
