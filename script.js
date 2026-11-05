
const tabButtons = document.querySelectorAll(".tab-btn");
const contactSection = document.getElementById("contactSection");
const jobSection = document.getElementById("jobSection");

const contactForm = document.getElementById("contactForm");
const jobForm = document.getElementById("jobForm");

const contactResult = document.getElementById("contactResult");
const jobResult = document.getElementById("jobResult");

// Switch between Contact Form and Job Application Form
tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
        tabButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        const selectedForm = button.dataset.form;

        if (selectedForm === "contactForm") {
            contactSection.hidden = false;
            jobSection.hidden = true;
        } else {
            contactSection.hidden = true;
            jobSection.hidden = false;
        }
    });
});

// Show validation error
function showError(input, message) {
    const formGroup = input.closest(".form-group");
    const error = formGroup.querySelector(".error");

    input.classList.add("invalid");
    error.textContent = message;
}

// Clear validation error
function clearError(input) {
    const formGroup = input.closest(".form-group");
    const error = formGroup.querySelector(".error");

    input.classList.remove("invalid");
    error.textContent = "";
}

// Validate required input
function validateRequired(input, fieldName) {
    if (input.value.trim() === "") {
        showError(input, `${fieldName} is required.`);
        return false;
    }

    clearError(input);
    return true;
}

// Validate email
function validateEmail(input) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(input.value.trim())) {
        showError(input, "Please enter a valid email address.");
        return false;
    }

    clearError(input);
    return true;
}

// Validate 10-digit phone number
function validatePhone(input) {
    const phonePattern = /^[0-9]{10}$/;

    if (!phonePattern.test(input.value.trim())) {
        showError(input, "Phone number must contain exactly 10 digits.");
        return false;
    }

    clearError(input);
    return true;
}

// Contact Form Submission
contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("contactName");
    const email = document.getElementById("contactEmail");
    const phone = document.getElementById("contactPhone");
    const subject = document.getElementById("subject");
    const message = document.getElementById("message");

    let isValid = true;

    isValid = validateRequired(name, "Full Name") && isValid;
    isValid = validateRequired(email, "Email") && isValid;
    isValid = validateRequired(phone, "Phone Number") && isValid;
    isValid = validateRequired(subject, "Subject") && isValid;
    isValid = validateRequired(message, "Message") && isValid;

    if (email.value.trim() !== "") {
        isValid = validateEmail(email) && isValid;
    }

    if (phone.value.trim() !== "") {
        isValid = validatePhone(phone) && isValid;
    }

    if (!isValid) {
        contactResult.hidden = true;
        return;
    }

    contactResult.innerHTML = `
        <h3>Message Sent Successfully!</h3>
        <p><strong>Name:</strong> ${escapeHTML(name.value)}</p>
        <p><strong>Email:</strong> ${escapeHTML(email.value)}</p>
        <p><strong>Subject:</strong> ${escapeHTML(subject.value)}</p>
        <p>Thank you for contacting us.</p>
    `;

    contactResult.hidden = false;
    contactForm.reset();
});

// Job Application Submission
jobForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("jobName");
    const email = document.getElementById("jobEmail");
    const phone = document.getElementById("jobPhone");
    const age = document.getElementById("age");
    const qualification = document.getElementById("qualification");
    const course = document.getElementById("course");
    const skills = document.getElementById("skills");
    const experience = document.getElementById("experience");
    const location = document.getElementById("location");
    const password = document.getElementById("password");
    const resume = document.getElementById("resume");

    let isValid = true;

    const requiredFields = [
        [name, "Full Name"],
        [email, "Email"],
        [phone, "Phone Number"],
        [age, "Age"],
        [qualification, "Qualification"],
        [course, "Course / Role"],
        [skills, "Skills"],
        [experience, "Experience"],
        [location, "Preferred Location"],
        [password, "Password"]
    ];

    requiredFields.forEach(([input, fieldName]) => {
        isValid = validateRequired(input, fieldName) && isValid;
    });

    if (email.value.trim() !== "") {
        isValid = validateEmail(email) && isValid;
    }

    if (phone.value.trim() !== "") {
        isValid = validatePhone(phone) && isValid;
    }

    // Validate age
    if (age.value.trim() !== "") {
        const ageValue = Number(age.value);

        if (!Number.isInteger(ageValue) || ageValue < 16 || ageValue > 60) {
            showError(age, "Age must be between 16 and 60.");
            isValid = false;
        } else {
            clearError(age);
        }
    }

    // Validate password length
    if (password.value !== "") {
        if (password.value.length < 8) {
            showError(password, "Password must be at least 8 characters.");
            isValid = false;
        } else {
            clearError(password);
        }
    }

    // Validate resume
    if (resume.files.length === 0) {
        showError(resume, "Please upload your resume.");
        isValid = false;
    } else {
        const file = resume.files[0];
        const allowedExtensions = [".pdf", ".doc", ".docx"];
        const fileName = file.name.toLowerCase();
        const validExtension = allowedExtensions.some((extension) =>
            fileName.endsWith(extension)
        );

        if (!validExtension) {
            showError(resume, "Upload a PDF, DOC, or DOCX file.");
            isValid = false;
        } else if (file.size > 5 * 1024 * 1024) {
            showError(resume, "Resume size must be less than 5 MB.");
            isValid = false;
        } else {
            clearError(resume);
        }
    }

    if (!isValid) {
        jobResult.hidden = true;
        return;
    }

    jobResult.innerHTML = `
        <h3>Application Submitted Successfully!</h3>
        <p><strong>Name:</strong> ${escapeHTML(name.value)}</p>
        <p><strong>Email:</strong> ${escapeHTML(email.value)}</p>
        <p><strong>Course / Role:</strong> ${escapeHTML(course.value)}</p>
        <p><strong>Qualification:</strong> ${escapeHTML(qualification.value)}</p>
        <p>Thank you for applying. Your details have been submitted.</p>
    `;

    jobResult.hidden = false;
    jobForm.reset();
});

// Prevent HTML injection in displayed user input
function escapeHTML(value) {
    return value.replace(/[&<>"']/g, function (character) {
        const characters = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return characters[character];
    });
}

// Clear errors while user types or changes values
document.querySelectorAll("input, select, textarea").forEach((input) => {
    input.addEventListener("input", () => clearError(input));
    input.addEventListener("change", () => clearError(input));
});
