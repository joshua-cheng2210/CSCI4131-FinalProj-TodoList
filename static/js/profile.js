var user;

async function handleLogout() {
    try {
        const response = await fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            window.location.href = '/login.html'; 
        }
    } catch (error) {
        console.error(error);
    }
}

async function getAccountInfo() {
    console.log("getAccountInfo")
    try {
        const response = await fetch('/getProfInfo', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log("getAccountInfo response.status: ", response.status)
        if (response.status === 401) {
            window.location.href = '/login.html';
            return;
        }

        if (!response.ok) {
            console.log("response.not ok")
            throw new Error("failed to get prof")
        }

        const result = await response.json();
        console.log("result: ", result)
        if (result.success) {
            user = result.user
            console.log("inside getAccountInfo user: ", user)
        } else {
            throw new Error("failed to get prof")
        }
    } catch (error) {
        console.log(error)
        window.location.href = '/login.html';
        return null;
    }
}

// async function populateProfInfo() {
//     console.log("populateProfInfo")
//     const tableBody = document.getElementById('userInfoTable');
//     const row = document.createElement('tr');

//     row.innerHTML = `
//         <td>${user.username}</td>
//         <td>${user.email}</td>
//         <td>${new Date(user.createdAt).toLocaleDateString()}</td>
//     `;

//     tableBody.appendChild(row);
// }

async function addDelAccBtn() {
    console.log("addDelAccBtn")
    const tableBody = document.getElementById('userInfoTable');
    const delBtn = document.createElement('tr');
    delBtn.innerHTML = `
        <th></th>
        <td><button id="DelAcc-btn">Delete Account</button></td>
    `;

    tableBody.appendChild(delBtn);

    const deleteButton = document.getElementById('DelAcc-btn');
    if (deleteButton) {
        deleteButton.addEventListener('click', async (event) => {
            event.preventDefault();
            await handleDeleteAccount();
        });
    }
}

async function handleDeleteAccount() {
    const confirmation = window.confirm("press OK to delete Acc");

    if (!confirmation) {
        return;
    }
    
    try {
        const response = await fetch('/deleteAccount', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 401) {
            window.location.href = '/login.html';
            return;
        }

        if (response.ok) {
            window.location.href = '/login.html';
        } else {
            throw new Error("Failed to delete account.")
        }
    } catch (error) {
        console.log(error);
    }
}

async function populateProfInfo() {
    console.log("populateProfInfo");
    const tableBody = document.getElementById('userInfoTable');

    const usernameRow = document.createElement('tr');
    usernameRow.innerHTML = `
        <th>Username</th>
        <td>${user.username}</td>
    `;

    const emailRow = document.createElement('tr');
    emailRow.innerHTML = `
        <th>Email</th>
        <td>${user.email}</td>
    `;

    const dateCreatedRow = document.createElement('tr');
    dateCreatedRow.innerHTML = `
        <th>Date of Creation</th>
        <td>${new Date(user.createdAt).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long', 
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        })}</td>
    `;

    tableBody.appendChild(usernameRow);
    tableBody.appendChild(emailRow);
    tableBody.appendChild(dateCreatedRow);
}

document.addEventListener('DOMContentLoaded', async () => {   
    try {
        await getAccountInfo()
        console.log("getAccountInfo completed")
        await populateProfInfo()
        console.log("populateProfInfo completed")

        const logoutButton = document.getElementById('logout-btn');
        if (logoutButton) {
            logoutButton.addEventListener('click', (event) => {
                event.preventDefault();
                handleLogout(); 
            });
        }

        const homePageButton = document.getElementById('todoList-btn');
        if (homePageButton) {
            homePageButton.addEventListener('click', (event) => {
                event.preventDefault();
                window.location.href = '/TodoList.html'; 
            });
        }
    } catch (err) {
        console.log(err)
    }
});