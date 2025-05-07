const bcrypt = require('bcrypt');
const saltRounds = 10;

async function onRegistrationSubmit(event){
    event.preventDefault(); 
    
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
            
    const newAcc = {
        username,
        email,
        password,
    };

    try {
        const response = await fetch('/registerAcc', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newAcc),
        });

        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                window.location.href = '/login.html'; 
            } else {
                window.location.href = '/registration.html'; 
            }
        } else {
            window.location.href = '/registration.html'; 
        }
    } catch (error) {
        console.error(error);
        return;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', onRegistrationSubmit)
    }
});