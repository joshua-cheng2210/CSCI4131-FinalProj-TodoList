to connect to the mandatory personal UMN DB provided:
'''mysql -uC4131S25S01U12 -hcse-mysql-classes-01.cse.umn.edu -P3306 -p C4131S25S01U12'''
'''194'''

# create a todoList table

CREATE TABLE todoList (
    taskID INTEGER PRIMARY KEY AUTO_INCREMENT,
    task VARCHAR(255) NOT NULL,
    deadline DATETIME,
    done BOOLEAN DEFAULT FALSE
);