const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File path for storing inquiries
const inquiriesFile = path.join(__dirname, 'inquiries.json');

// Initialize inquiries file if it doesn't exist
if (!fs.existsSync(inquiriesFile)) {
    fs.writeFileSync(inquiriesFile, JSON.stringify([], null, 2));
}

// Root route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Welcome to TEAMS Tuitions API',
        version: '1.0.0',
        endpoints: {
            health: 'GET /api/health',
            inquiries: 'POST /api/inquiries',
            courses: 'GET /api/courses'
        }
    });
});

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'TEAMS Backend is running!' });
});

// POST /api/inquiries - Create new inquiry (file-based)
app.post('/api/inquiries', (req, res) => {
    try {
        const { name, phone, course } = req.body;

        // Validation
        if (!name || !name.trim()) {
            return res.status(400).json({ success: false, message: 'Name is required' });
        }
        if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
            return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit phone number' });
        }
        if (!course) {
            return res.status(400).json({ success: false, message: 'Please select a course' });
        }

        // Read existing inquiries
        const inquiries = JSON.parse(fs.readFileSync(inquiriesFile, 'utf-8'));

        // Create new inquiry
        const newInquiry = {
            id: Date.now(),
            name: name.trim(),
            phone: phone.trim(),
            course,
            createdAt: new Date().toISOString()
        };

        // Add to list and save
        inquiries.push(newInquiry);
        fs.writeFileSync(inquiriesFile, JSON.stringify(inquiries, null, 2));

        console.log('📩 New inquiry received:', newInquiry);

        res.status(201).json({
            success: true,
            message: 'Thank you! We will contact you shortly.',
            data: newInquiry
        });

    } catch (error) {
        console.error('Error creating inquiry:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to submit inquiry. Please try again.' 
        });
    }
});

// GET /api/inquiries - Get all inquiries
app.get('/api/inquiries', (req, res) => {
    try {
        const inquiries = JSON.parse(fs.readFileSync(inquiriesFile, 'utf-8'));
        res.json({ success: true, data: inquiries });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch inquiries' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
