# create a todoList table

CREATE TABLE todoList (
    taskID INTEGER PRIMARY KEY AUTOINCREMENT,
    task VARCHAR(255) NOT NULL,
    deadline DATE,
    done BOOLEAN DEFAULT FALSE
);