function checkPassword(password) {
    // Password must contain at least 8 characters, one uppercase letter, one special character, and one number
    var passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
}

function checkPhoneNumber(phoneNumber) {
    // Phone number must be exactly 8 digits
    var phoneNumberRegex = /^[0-9]{8}$/;
    return phoneNumberRegex.test(phoneNumber);
}

function checkEmail(email) {
    // Simple email regex for basic validation
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

var container = document.getElementById('container');
var signUpForm = document.getElementById('signup-form');
var signUpHeading = document.getElementById('Sign-Up');
var backToLoginButton = document.getElementById('btn-back-to-login');
var registerButton = document.getElementById('btn-register');

var loginBtn = document.getElementById('btn-login');
var loginemail = document.getElementById('login-email');
var loginpass = document.getElementById('login-pass');

var SignUpBtn = document.getElementById('btn-register');
var register_email = document.getElementById('signup-email');
var register_pass = document.getElementById('signup-pass');
var register_firstname = document.getElementById('signup-fname');
var register_lastname = document.getElementById('signup-lname');
var register_address = document.getElementById('signup-address');
var register_phonenumber = document.getElementById('signup-number');

const baseURL = "http://localhost:1337/";


function fadeInEffect() {
    var glassEffect = document.getElementById('glassEffect');
    glassEffect.style.opacity = 0;

    var fadeEffect = setInterval(function () {
      if (glassEffect.style.opacity < 1) {
        glassEffect.style.opacity = parseFloat(glassEffect.style.opacity) + 0.07;
      } else {
        clearInterval(fadeEffect);
      }
    }, 100);
};

  function toggleSignUpForm() {
    
    if (container.style.width === '0' || container.style.width === '') {
      container.style.width = '50%';
      signUpForm.classList.add('visible');
      signUpHeading.style.display = 'block';
      backToLoginButton.style.display = 'block';
      registerButton.style.display = 'block';
    } else {
      container.style.width = '0';
      signUpForm.classList.remove('visible');
      signUpHeading.style.display = 'none';
      backToLoginButton.style.display = 'none';
      registerButton.style.display = 'none';
    }
};
  
  
  function backToLoginForm() {
  
    container.style.width = '0';
    signUpForm.classList.remove('visible');
    signUpHeading.style.display = 'none';
    backToLoginButton.style.display = 'none';
    registerButton.style.display = 'none';
};

loginBtn.addEventListener("click", async function (event) {

   

    event.preventDefault();
    var baseURlPost = baseURL + "login";
    const res = await fetch(baseURlPost, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: loginemail.value,
            password: loginpass.value,
        }),
    });

    const result = await res.json();

    if (result.status === 200) {

        window.location.href = "http://localhost:1337/";

    } else {

        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
        });
        Toast.fire({
            icon: "error",
            title: "Invalid email or password!"
        });

    }

});

SignUpBtn.addEventListener("click", async function (event) {

    var isPasswordValid = checkPassword(register_pass.value);
    var isPhoneNumberValid = checkPhoneNumber(register_phonenumber.value);
    var isEmailValid = checkEmail(register_email.value);

    if (!isPasswordValid || !isPhoneNumberValid || !isEmailValid) {

        Swal.fire({
            title: 'Error!',
            text: 'Invalid input format. Please check your inputs.',
            icon: 'error',
            confirmButtonText: 'OK'
        })
        return;
    }
    
    event.preventDefault();
    var baseURlPost = baseURL + "register";
    const res = await fetch(baseURlPost, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: register_email.value,
            password: register_pass.value,
            firstname: register_firstname.value,
            lastname: register_lastname.value,
            phonenumber: register_phonenumber.value,
            address: register_address.value
        }),
    });

    const result = await res.json();

    if (result.status === 200) {

     
        Swal.fire({
            title: 'Registered!',
            text: 'Account succesfully created.',
            icon: 'success',
            confirmButtonText: 'GREAT'
        });


        window.location.href = "http://localhost:1337/login";

    } else
        if (result.status === 404) {

            Swal.fire({
                title: 'Error!',
                text: 'Email already exists.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }

    else alert('Internal Server error');

});

  window.onload = fadeInEffect;

