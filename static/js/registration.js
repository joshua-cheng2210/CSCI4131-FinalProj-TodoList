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
                alert("reg sucess")
                window.location.href = '/login.html'; 
            } else {
                alert("reg failed1")
                window.location.href = '/registration.html'; 
            }
        } else {
            alert("reg failed2")
            window.location.href = '/registration.html'; 
        }
    } catch (error) {
        console.error(error);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', onRegistrationSubmit)
    }
});