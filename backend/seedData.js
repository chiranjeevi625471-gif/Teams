const mongoose = require('mongoose');
require('dotenv').config();

const Course = require('./models/Course');

const courses = [
    {
        courseId: "regular-tuitions",
        title: "Regular Tuitions",
        description: "Comprehensive coaching for Class 6th to 10th covering all syllabuses (ICSE, CBSE, State).",
        icon: "fas fa-book-open",
        iconColor: "orange",
        eligibility: "Class 6th to 10th",
        duration: "Full Academic Year",
        steps: [
            { title: "Assessment", desc: "Diagnostic test to understand current standing." },
            { title: "Customized Plan", desc: "Study plan focusing on weak areas in Math & Science." },
            { title: "Daily Classes", desc: "Intensive classes with expert faculty." },
            { title: "Weekly Tests", desc: "Every Saturday tests to track retention and progress." }
        ]
    },
    {
        courseId: "vedic-maths",
        title: "Vedic Maths",
        description: "Unlock the power of your brain with ancient Indian mathematical tricks.",
        icon: "fas fa-calculator",
        iconColor: "pink",
        eligibility: "Class 5th, 6th & 7th",
        duration: "3 Months",
        steps: [
            { title: "Basics", desc: "Learning addition and subtraction without finger counting." },
            { title: "Speed Ops", desc: "Mastering tables and large number multiplication in seconds." },
            { title: "Mental Agility", desc: "Exercises to improve focus and concentration." },
            { title: "Certification", desc: "Completion certificate after mastering all levels." }
        ]
    },
    {
        courseId: "olympiads",
        title: "Olympiad Prep",
        description: "Prepare for NSO, IMO, and other national level competitive exams.",
        icon: "fas fa-trophy",
        iconColor: "purple",
        eligibility: "Class 5th Onwards",
        duration: "6 Months",
        steps: [
            { title: "Concept Depth", desc: "Going beyond the school textbook to understand 'Why'." },
            { title: "Logical Reasoning", desc: "Special sessions dedicated to puzzles and aptitude." },
            { title: "Mock Exams", desc: "Simulating real exam environments with OMR sheets." },
            { title: "Ranking", desc: "Comparing performance with students nationally." }
        ]
    },
    {
        courseId: "foundation",
        title: "Foundation Course",
        description: "Build a strong base for future IIT-JEE and NEET exams (Class 8-10).",
        icon: "fas fa-atom",
        iconColor: "green",
        eligibility: "Class 8th, 9th & 10th",
        duration: "Full Academic Year",
        steps: [
            { title: "Adv Concepts", desc: "Introduction to 11th/12th grade topics." },
            { title: "Application", desc: "Applying concepts to real world problems." },
            { title: "HOTS", desc: "Solving Higher Order Thinking Skills questions." },
            { title: "Career Guide", desc: "Stream selection guidance based on performance." }
        ]
    },
    {
        courseId: "coding-classes",
        title: "Coding Classes",
        description: "Learn logic and programming from industry experts.",
        icon: "fas fa-laptop-code",
        iconColor: "blue",
        eligibility: "Class 5th Onwards",
        duration: "6 Months",
        steps: [
            { title: "Logic Building", desc: "Understanding algorithms and flowcharts." },
            { title: "Syntax Mastery", desc: "Learning Python or Java basics tailored for kids." },
            { title: "Projects", desc: "Creating calculators, simple games, and websites." },
            { title: "Showcase", desc: "Presenting a capstone project to parents." }
        ]
    },
    {
        courseId: "home-tutors",
        title: "Home Tuitions",
        description: "Personalized 1-on-1 tutoring at the comfort of your home.",
        icon: "fas fa-home",
        iconColor: "yellow",
        eligibility: "All Classes",
        duration: "Flexible",
        steps: [
            { title: "Tutor Matching", desc: "Finding the perfect tutor based on your needs." },
            { title: "Flexible Schedule", desc: "Classes scheduled according to your convenience." },
            { title: "Personal Attention", desc: "100% attention on your child's specific doubts." },
            { title: "Monthly Report", desc: "Detailed progress report sent to parents." }
        ]
    }
];

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing courses
        await Course.deleteMany({});
        console.log('Cleared existing courses');

        // Insert new courses
        await Course.insertMany(courses);
        console.log('✅ Courses seeded successfully!');

        mongoose.connection.close();
        console.log('Database connection closed');

    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
