to connect to the mandatory personal UMN DB provided:
'''mysql -uC4131S25S01U12 -hcse-mysql-classes-01.cse.umn.edu -P3306 -p C4131S25S01U12'''
'''194'''

# create a todoList table
CREATE TABLE Users (
    userID INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    passwordHash VARCHAR(255) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE todoList (
    taskID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT NOT NULL,
    task VARCHAR(255) NOT NULL,
    deadline DATETIME,
    done BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (userID) REFERENCES Users(userID) ON DELETE CASCADE 
);

# Todo functionalities
- maybe not use checklist (assignment say use flexbox)
- account delete button noy showing up

# design work
- make it look simplistic
- make a stike through animation or style through the line if checkbox is checked
- the todo-deadline text wil be in red if the deadline is missed and the checkbox is not checked; orange if the deadline is close like within 1 hr
- other styling
- think about varying screen size
- separate the server functions into account realted functions and app utilities functions
