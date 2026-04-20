document.addEventListener("DOMContentLoaded", () => {

    // --- API Configuration ---
    const API_BASE_URL = 'http://localhost:5000/api';

    // --- 1. COURSE DATA (The Roadmap Information) ---
    const courseDB = {
        "regular-tuitions": {
            title: "Regular Tuitions",
            desc: "Comprehensive coaching for Class 6th to 10th covering all syllabuses (ICSE, CBSE, State).",
            steps: [
                { title: "Assessment", desc: "Diagnostic test to understand current standing." },
                { title: "Customized Plan", desc: "Study plan focusing on weak areas in Math & Science." },
                { title: "Daily Classes", desc: "Intensive classes with expert faculty." },
                { title: "Weekly Tests", desc: "Every Saturday tests to track retention and progress." }
            ]
        },
        "vedic-maths": {
            title: "Vedic Maths",
            desc: "Unlock the power of your brain with ancient Indian mathematical tricks.",
            steps: [
                { title: "Basics", desc: "Learning addition and subtraction without finger counting." },
                { title: "Speed Ops", desc: "Mastering tables and large number multiplication in seconds." },
                { title: "Mental Agility", desc: "Exercises to improve focus and concentration." },
                { title: "Certification", desc: "Completion certificate after mastering all levels." }
            ]
        },
        "olympiads": {
            title: "Olympiad Prep",
            desc: "Prepare for NSO, IMO, and other national level competitive exams.",
            steps: [
                { title: "Concept Depth", desc: "Going beyond the school textbook to understand 'Why'." },
                { title: "Logical Reasoning", desc: "Special sessions dedicated to puzzles and aptitude." },
                { title: "Mock Exams", desc: "Simulating real exam environments with OMR sheets." },
                { title: "Ranking", desc: "Comparing performance with students nationally." }
            ]
        },
        "foundation": {
            title: "Foundation Course",
            desc: "Build a strong base for future IIT-JEE and NEET exams (Class 8-10).",
            steps: [
                { title: "Adv Concepts", desc: "Introduction to 11th/12th grade topics." },
                { title: "Application", desc: "Applying concepts to real world problems." },
                { title: "HOTS", desc: "Solving Higher Order Thinking Skills questions." },
                { title: "Career Guide", desc: "Stream selection guidance based on performance." }
            ]
        },
        "coding-classes": {
            title: "Coding Classes",
            desc: "Learn logic and programming from industry experts.",
            steps: [
                { title: "Logic Building", desc: "Understanding algorithms and flowcharts." },
                { title: "Syntax Mastery", desc: "Learning Python or Java basics tailored for kids." },
                { title: "Projects", desc: "Creating calculators, simple games, and websites." },
                { title: "Showcase", desc: "Presenting a capstone project to parents." }
            ]
        },
        "home-tutors": {
            title: "Home Tuitions",
            desc: "Personalized 1-on-1 tutoring at the comfort of your home.",
            steps: [
                { title: "Tutor Matching", desc: "Finding the perfect tutor based on your needs." },
                { title: "Flexible Schedule", desc: "Classes scheduled according to your convenience." },
                { title: "Personal Attention", desc: "100% attention on your child's specific doubts." },
                { title: "Monthly Report", desc: "Detailed progress report sent to parents." }
            ]
        }
    };

    // --- 2. POPULATE ROADMAP PAGE ---
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('course');
    const roadmapContainer = document.getElementById('roadmap-container');

    if (courseId && roadmapContainer && courseDB[courseId]) {
        const data = courseDB[courseId];
        document.getElementById('course-title').innerText = data.title;
        document.getElementById('course-desc').innerText = data.desc;

        let html = '';
        data.steps.forEach((step, index) => {
            html += `
                <div class="roadmap-item animate-fade-up" style="transition-delay: ${index * 0.2}s">
                    <div class="roadmap-content">
                        <span class="step-number">STEP ${index + 1}</span>
                        <h3>${step.title}</h3>
                        <p>${step.desc}</p>
                    </div>
                </div>
            `;
        });
        roadmapContainer.innerHTML = html;
        setTimeout(() => {
            document.querySelectorAll('.roadmap-item').forEach(el => el.classList.add('visible'));
        }, 100);
    }

    // --- 3. STANDARD UI LOGIC ---
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const closeBtn = document.getElementById('close-btn');
    if(mobileToggle){
        mobileToggle.addEventListener('click', () => navMenu.classList.add('active'));
        closeBtn.addEventListener('click', () => navMenu.classList.remove('active'));
    }

    // Setup Animation Observer for Fade-Up elements
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { 
            if(entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once visible to save performance
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 }); 

    document.querySelectorAll('.animate-fade-up').forEach(el => observer.observe(el));

    // --- 4. CONTACT FORM SUBMISSION ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submitBtn');
            const successMsg = document.getElementById('success-msg');
            const errorMsg = document.getElementById('error-msg');
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                course: document.getElementById('course').value
            };

            // Validate phone number
            const phoneRegex = /^[6-9]\d{9}$/;
            if (!phoneRegex.test(formData.phone)) {
                errorMsg.textContent = 'Please enter a valid 10-digit phone number';
                errorMsg.style.display = 'block';
                successMsg.style.display = 'none';
                return;
            }

            // Disable button and show loading
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';
            errorMsg.style.display = 'none';

            try {
                const response = await fetch(`${API_BASE_URL}/inquiries`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (result.success) {
                    successMsg.style.display = 'block';
                    contactForm.reset();
                } else {
                    throw new Error(result.message || 'Failed to submit');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                errorMsg.textContent = error.message || 'Failed to submit. Please try again or call us directly.';
                errorMsg.style.display = 'block';
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Request Call Back';
            }
        });
    }
});