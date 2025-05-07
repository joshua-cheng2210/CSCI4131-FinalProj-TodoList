async function onLoginSubmit(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    const loginAcc = {
        email,
        password,
    };

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginAcc),
        });

        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                window.location.href = '/TodoList.html'; 
                console.log("result: ", result.user)
            } else {
                window.location.href = '/login.html'; 
            }
        } else {
            window.location.href = '/login.html'; 
        }
    } catch (error) {
        console.error(error);
        window.location.href = '/login.html'; 
    }
};


document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('login-form');
    if (registerForm) {
        registerForm.addEventListener('submit', onLoginSubmit)
    }
});