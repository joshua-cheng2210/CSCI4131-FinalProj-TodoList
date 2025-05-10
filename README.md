# to connect to the mandatory personal UMN DB provided:
'''mysql -uC4131S25S01U12 -hcse-mysql-classes-01.cse.umn.edu -P3306 -p C4131S25S01U12'''
'''194'''

# possible webpages:
- http://localhost:7647/login.html (starting point. [note: i redirected every function to this page if an express-session is not created upon successful login])
- http://localhost:7647/registration.html
- http://localhost:7647/TodoList.html
- http://localhost:7647/profile.html

# login / registration:
- you must register an account before you can do anything else @
- example account that I used for development: http://localhost:7647/login.html
    - username: chengjoshua22@gmail.com
    - password: 123
- but you can create one yourself too

# minimum feature implementation:
## account creation
- at http://localhost:7647/login.html 

## account deletion
- upon successful login, navigate to "profile" (http://localhost:7647/profile.html)
- there is a delete button at the bottom of all your profile information

## logout
- there is a logout button at the navigation bar

# sql tables
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
- test all features
