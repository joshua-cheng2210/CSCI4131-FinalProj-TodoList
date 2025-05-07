async function onRegistrationSubmit() {
    const registerForm = document.getElementById('register-form');

    registerForm.addEventListener('submit', async (event) => {
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
                    window.location.href = 'login.html'; 
                }
            }
        } catch (error) {
            console.error(error);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    onRegistrationSubmit()
});