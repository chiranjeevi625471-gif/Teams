const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Inquiry = require('../models/Inquiry');

// Validation rules
const inquiryValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
    body('phone')
        .trim()
        .notEmpty().withMessage('Phone number is required')
        .matches(/^[6-9]\d{9}$/).withMessage('Please enter a valid 10-digit Indian phone number'),
    body('course')
        .notEmpty().withMessage('Please select a course')
];

// @route   POST /api/inquiries
// @desc    Create a new inquiry (contact form submission)
// @access  Public
router.post('/', inquiryValidation, async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false, 
                errors: errors.array() 
            });
        }

        const { name, phone, course, message } = req.body;

        // Create new inquiry
        const inquiry = new Inquiry({
            name,
            phone,
            course,
            message: message || ''
        });

        await inquiry.save();

        res.status(201).json({
            success: true,
            message: 'Thank you! We will contact you shortly.',
            data: inquiry
        });

    } catch (error) {
        console.error('Error creating inquiry:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to submit inquiry. Please try again.' 
        });
    }
});

// @route   GET /api/inquiries
// @desc    Get all inquiries (for admin panel)
// @access  Private (should add auth middleware in production)
router.get('/', async (req, res) => {
    try {
        const { status, course, page = 1, limit = 10 } = req.query;
        
        // Build filter object
        const filter = {};
        if (status) filter.status = status;
        if (course) filter.course = course;

        const inquiries = await Inquiry.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Inquiry.countDocuments(filter);

        res.json({
            success: true,
            data: inquiries,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalItems: total
            }
        });

    } catch (error) {
        console.error('Error fetching inquiries:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch inquiries' 
        });
    }
});

// @route   GET /api/inquiries/:id
// @desc    Get single inquiry by ID
// @access  Private
router.get('/:id', async (req, res) => {
    try {
        const inquiry = await Inquiry.findById(req.params.id);
        
        if (!inquiry) {
            return res.status(404).json({ 
                success: false, 
                message: 'Inquiry not found' 
            });
        }

        res.json({ success: true, data: inquiry });

    } catch (error) {
        console.error('Error fetching inquiry:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch inquiry' 
        });
    }
});

// @route   PUT /api/inquiries/:id
// @desc    Update inquiry status/notes (for admin)
// @access  Private
router.put('/:id', async (req, res) => {
    try {
        const { status, notes } = req.body;
        
        const inquiry = await Inquiry.findByIdAndUpdate(
            req.params.id,
            { status, notes, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        if (!inquiry) {
            return res.status(404).json({ 
                success: false, 
                message: 'Inquiry not found' 
            });
        }

        res.json({ 
            success: true, 
            message: 'Inquiry updated successfully',
            data: inquiry 
        });

    } catch (error) {
        console.error('Error updating inquiry:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update inquiry' 
        });
    }
});

// @route   DELETE /api/inquiries/:id
// @desc    Delete an inquiry
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        const inquiry = await Inquiry.findByIdAndDelete(req.params.id);

        if (!inquiry) {
            return res.status(404).json({ 
                success: false, 
                message: 'Inquiry not found' 
            });
        }

        res.json({ 
            success: true, 
            message: 'Inquiry deleted successfully' 
        });

    } catch (error) {
        console.error('Error deleting inquiry:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to delete inquiry' 
        });
    }
});

// @route   GET /api/inquiries/stats/overview
// @desc    Get inquiry statistics
// @access  Private
router.get('/stats/overview', async (req, res) => {
    try {
        const totalInquiries = await Inquiry.countDocuments();
        const newInquiries = await Inquiry.countDocuments({ status: 'new' });
        const contactedInquiries = await Inquiry.countDocuments({ status: 'contacted' });
        const enrolledInquiries = await Inquiry.countDocuments({ status: 'enrolled' });

        // Inquiries by course
        const byCourse = await Inquiry.aggregate([
            { $group: { _id: '$course', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        // Today's inquiries
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayInquiries = await Inquiry.countDocuments({
            createdAt: { $gte: today }
        });

        res.json({
            success: true,
            data: {
                total: totalInquiries,
                new: newInquiries,
                contacted: contactedInquiries,
                enrolled: enrolledInquiries,
                today: todayInquiries,
                byCourse
            }
        });

    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch statistics' 
        });
    }
});

// @route   GET /api/inquiries/export/csv
// @desc    Export all inquiries as CSV (for Excel/Google Sheets)
// @access  Private
router.get('/export/csv', async (req, res) => {
    try {
        const inquiries = await Inquiry.find().sort({ createdAt: -1 });

        // CSV Headers
        const headers = ['Name', 'Phone', 'Course', 'Status', 'Message', 'Date', 'Time'];
        
        // Convert to CSV rows
        const rows = inquiries.map(inq => {
            const date = new Date(inq.createdAt);
            return [
                `"${inq.name}"`,
                inq.phone,
                `"${inq.course}"`,
                inq.status,
                `"${(inq.message || '').replace(/"/g, '""')}"`,
                date.toLocaleDateString('en-IN'),
                date.toLocaleTimeString('en-IN')
            ].join(',');
        });

        // Combine headers and rows
        const csv = [headers.join(','), ...rows].join('\n');

        // Set headers for file download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=TEAMS_Inquiries.csv');
        res.send(csv);

    } catch (error) {
        console.error('Error exporting CSV:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to export data' 
        });
    }
});

module.exports = router;
