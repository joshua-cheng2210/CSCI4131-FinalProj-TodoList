

async function populateTodoList() {
    const tableBody = document.querySelector('.TaskList-table tbody');

    try {
        const response = await fetch('/getTodoList'); 

        if (!response.ok) {
            throw new Error(`Failed to get todo. status -->${response.status}`);
        }
        
        let todos = await response.json(); 
        todos = todos.results
        
        console.log("response from front end: ", todos)

        todos.forEach(todo => {
            const row = document.createElement('tr');
            row.classList.add('todo-row');

            row.innerHTML = `
                <td>${todo.task || 'N/A'}</td>
                <td>${todo.deadline || 'N/A'}</td>
            `;
            tableBody.appendChild(row);
        });

    } catch (err) {
        throw err
    }
}


document.addEventListener('DOMContentLoaded', () => {
    populateTodoList()
});