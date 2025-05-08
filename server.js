const http = require('http');
const url = require('url');
const fs = require('fs');
const express = require("express");
const app = express(); 
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');

app.use(express.json()); 
app.use(express.urlencoded({extended:true}));
const port = 7647

app.use(session({
    secret: 'CSCI4131FinalProj-Todo', 
    resave: false, 
    saveUninitialized: false, 
}));

var mysql = require("mysql");
let connection = null
const saltRounds = 10;

const mysqlConfig = {
  host: "cse-mysql-classes-01.cse.umn.edu",
  user: "C4131S25S01U12",
  password: "194",
  database: "C4131S25S01U12",
  port: 3306
}
DB = mysql.createConnection(mysqlConfig);

app.post('/registerAcc', (req, res) => {
    console.log("/registerAcc")
    console.log("req.body: ", req.body)
    const {username, email, password} = req.body; 
    const sql = 'INSERT INTO Users (username, email, passwordHash) VALUES (?, ?, ?)'; 
    let newAcc = [];

    try{
        bcrypt.hash(password, saltRounds, (err, passwordHash) => {
            if (err) {
                console.error(err);
                return;
            }
            newAcc = [
                username,
                email,
                passwordHash
            ];
            
            DB.query(sql, newAcc, (err, results) => {
                if (err) {
                  console.log(err)
                  return res.status(500).json({ success: false });
                } else {
                  return res.status(200).json({ success: true });
                }
              });
        });
    } catch (err) {
        console.log("hasing error: ",err)
        return 
    }
});

app.get("/getProfInfo", (req,res) => {
  const user = req.session.user;

  if (!user) {
    return res.status(401).json({ success: false });
  }

  res.status(200).json({ success: true, user : user });
})

app.post('/login', async (req, res) => {
    console.log("/login POST")
    const { email, password } = req.body;

    const sql = 'SELECT * FROM Users WHERE email = ?';
    DB.query(sql, [email], async (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false });
        }

        const user = results[0];
        try {
            const match = await bcrypt.compare(password, user.passwordHash);
            if (match) {
                console.log("user: ", user)
                const {passwordHash, ...acc_to_send} = user
                req.session.user = acc_to_send
                // console.log("acc_to_send", acc_to_send)
                console.log("req.session.user", req.session.user)
                res.status(200).json({ success: true, user: acc_to_send});
            } else {
                res.status(401).json({ success: false});
            }
        } catch (err) {
            console.log(err)
            res.status(500).json({ success: false});
        }
    });
});

app.get('/getTodoList', (req, res) => {
  console.log("getTodoList")
  const user = req.session.user
  if (!user || user === undefined || user === null){
    return res.status(404).json({ success: false , results: Null});
  } else if (!user.userID || user.userID === undefined || user.userID === null){
    return res.status(404).json({ success: false , results: Null});
  }
  const userID = user.userID

  const sql = 'SELECT * FROM todoList where userID = ? ORDER BY deadline';
  DB.query(sql, (err, [userID], results) => {
    if (err) {
      console.error("Database select error:", err);
      return res.status(500).json({ success: false , results: Null});
    }
    console.log("results form server: ", results.length, results)
    return res.status(200).json({ success: true, results: results }); 
  });
});

app.post('/addtodo', (req, res) => {
  console.log("/addtodo")
  console.log("req.body: ", req.body)
  const user = req.session.user
  if (!user || user === undefined || user === null){
    return res.status(404).json({ success: false , results: Null});
  } else if (!user.userID || user.userID === undefined || user.userID === null){
    return res.status(404).json({ success: false , results: Null});
  }
  const userID = user.userID
  
  const {task, deadline, done} = req.body; 
  const sql = 'INSERT INTO todoList (userID, task, deadline, done) VALUES (?, ?, ?, ?)'; 
  const values = [
    userID,
    task,
    deadline,
    done 
  ];

  DB.query(sql, values, (err, results) => {
    if (err) {
      return res.status(500).json({ success: false});
    } else {
      return res.status(200).json({ success: true});
    }
  });
});

app.delete('/deletetodo/:id', (req, res) => {
  console.log("/deletetodo")
  const todoID = req.params.id
  console.log("delete todo ID: ", todoID)

  const user = req.session.user
  if (!user || user === undefined || user === null){
    return res.status(404).json({ success: false , results: Null});
  } else if (!user.userID || user.userID === undefined || user.userID === null){
    return res.status(404).json({ success: false , results: Null});
  }
  const userID = user.userID

  DB.query(`DELETE FROM todoList WHERE taskID = ? AND userID = ?`, [todoID, userID], (err, result) => {
      if (err) {
        console.log("failed to removed ", err)
        return res.status(500).json({ success: false});
      } else if (result.affectedRows > 0) {
        console.log("successfully removed ", result)
        return res.status(200).json({ success: true});
      } else {
        console.log("failed to removed ", todoID)
        return res.status(404).json({ success: false});
      }
  });
});

app.put('/updatetodo', (req, res) => {
  const { done, todoID } = req.body; 
  console.log("updatetodo: ", todoID, done)

  const user = req.session.user
  if (!user || user === undefined || user === null){
    return res.status(404).json({ success: false , results: Null});
  } else if (!user.userID || user.userID === undefined || user.userID === null){
    return res.status(404).json({ success: false , results: Null});
  }
  const userID = user.userID

  const sql = 'UPDATE todoList SET done = ? WHERE taskID = ? and userID = ?'
  DB.query(sql, [done, todoID, userID], (err, result) => {
    if (err) {
        console.log(err);
        return res.status(500).json({ success: false});
    } else if (result.affectedRows > 0) {
        return res.status(200).json({ success: true});
    } else {
        return res.status(404).json({ success: false});
    }
  });
});

app.post('/logout', (req, res) => {
    console.log("/logout")
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false });
        }
        res.status(200).json({ success: true });
    });
});

app.use(express.static(path.join(__dirname, 'static')));
app.get('/TodoList.html', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'static', 'html', 'TodoList.html'));
});
app.get('/TodoList.css', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'static', 'css', 'TodoList.css'));
});
app.get('/TodoList.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'js', 'TodoList.js'));
});

app.use(express.static(path.join(__dirname, 'static')));
app.get('/login.html', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'static', 'html', 'login.html'));
});
app.get('/login.css', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'static', 'css', 'login.css'));
});
app.get('/login.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'js', 'login.js'));
});

app.use(express.static(path.join(__dirname, 'static')));
app.get('/registration.html', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'static', 'html', 'registration.html'));
});
app.get('/registration.css', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'static', 'css', 'registration.css'));
});
app.get('/registration.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'js', 'registration.js'));
});

app.listen(port, () => {
  console.log(`server listening on http://localhost:${port}/`)
})
  
