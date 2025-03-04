document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById("signup-form");
    const loginForm = document.getElementById("login-form");
    const logoutBtn = document.getElementById("logout");
    const form = document.getElementById("userForm");
    const phoneInput = document.querySelector("#phone");
    let iti;

    if (phoneInput) {
        iti = window.intlTelInput(phoneInput, {
            initialCountry: "in",
            separateDialCode: true,
            preferredCountries: ["us", "in", "gb"],
            utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js"
        });
    }

    if (signupForm) {
        signupForm.addEventListener("submit", function (e) {
            e.preventDefault();
            let email = document.getElementById("email").value.trim();
            let password = document.getElementById("password").value.trim();
            let contact = phoneInput ? phoneInput.value.trim() : "";
            let phoneError = document.getElementById("phoneError");
            let users = JSON.parse(localStorage.getItem("users")) || [];
            let valid = true;

            phoneError.textContent = "";

            if (users.some(user => user.email === email)) {
                alert("Email already registered! Please log in.");
                return;
            }

            if (iti && !iti.isValidNumber()) {
                phoneError.textContent = "Enter a valid phone number!";
                valid = false;
            }

            if (!valid) return;

            users.push({ email, password, contact });
            localStorage.setItem("users", JSON.stringify(users));
            alert("Signup successful! You can now log in.");
            window.location.href = "login.html";
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();
            let email = document.getElementById("login-email").value.trim();
            let password = document.getElementById("login-password").value.trim();
            let users = JSON.parse(localStorage.getItem("users")) || [];
            let validUser = users.find(user => user.email === email);

            if (validUser) {
                if (validUser.password === password) {
                    localStorage.setItem("loggedInUser", email);
                    alert("Login successful!");
                    window.location.href = "dashboard.html";
                } else {
                    alert("Incorrect password! Please try again.");
                }
            } else {
                alert("User not found! Please sign up.");
            }
        });
    }

    if (logoutBtn) {
        document.getElementById("user-email").innerText = localStorage.getItem("loggedInUser");
        logoutBtn.addEventListener("click", function () {
            localStorage.removeItem("loggedInUser");
            alert("Logged out successfully!");
            window.location.href = "index.html";
        });
    }

    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            let valid = true;
            let name = document.getElementById("name").value.trim();
            let age = document.getElementById("age").value.trim();
            let address = document.getElementById("address").value.trim();
            let email = document.getElementById("email").value.trim();
            let phoneError = document.getElementById("phoneError");

            let nameError = document.getElementById("nameError");
            let ageError = document.getElementById("ageError");
            let addressError = document.getElementById("addressError");
            let emailError = document.getElementById("emailError");

            nameError.textContent = "";
            ageError.textContent = "";
            addressError.textContent = "";
            emailError.textContent = "";
            phoneError.textContent = "";

            let namePattern = /^[a-zA-Z\s]+$/;
            if (!name) {
                nameError.textContent = "Name is required!";
                valid = false;
            } else if (!namePattern.test(name)) {
                nameError.textContent = "Name must contain only letters!";
                valid = false;
            }

            if (!age || age < 18 || age > 60) {
                ageError.textContent = "Age must be between 18 and 60!";
                valid = false;
            }

            if (!address) {
                addressError.textContent = "Address is required!";
                valid = false;
            }

            let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailPattern.test(email)) {
                emailError.textContent = "Enter a valid email!";
                valid = false;
            }

            if (iti && !iti.isValidNumber()) {
                phoneError.textContent = "Enter a valid phone number!";
                valid = false;
            }

            if (valid) {
                document.getElementById("successMessage").style.display = "block";
                form.reset();
                iti.setNumber("");
                setTimeout(() => {
                    document.getElementById("successMessage").style.display = "none";
                }, 3000);
            }
        });
    }
});
