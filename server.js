const http = require('http');
const url = require('url');
const fs = require('fs');
const express = require("express");
const app = express(); 
const path = require('path');

app.use(express.json()); 
app.use(express.urlencoded({extended:true}));
const port = 7647

var mysql = require("mysql");
let connection = null

const mysqlConfig = {
  host: "cse-mysql-classes-01.cse.umn.edu",
  user: "C4131S25S01U12",
  password: "194",
  database: "C4131S25S01U12",
  port: 3306
}
DB = mysql.createConnection(mysqlConfig);


app.get('/getTodoList', (req, res) => {
  console.log("getTodoList")
  const sql = 'SELECT * FROM todoList ORDER BY deadline';
  DB.query(sql, (err, results) => {
    if (err) {
      console.error("Database select error:", err);
      return res.status(500).json({ success: false , results: Null});
    }
    console.log("results form server: ", results.length, results)
    return res.status(200).json({ success: true, results: results }); 
  });
});


app.post('/addtodo', (req, res) => {
  console.log("req.body: ", req.body)
  const {task, deadline, done} = req.body; 
  const sql = 'INSERT INTO todoList (task, deadline, done) VALUES (?, ?, ?)'; 
  const values = [
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
  const todoID = req.params.id;
  console.log("delete todo ID: ", todoID)

  DB.query(`DELETE FROM todoList WHERE taskID = ?`, [todoID], (err, result) => {
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

app.put('/updatetodo/:id', (req, res) => {
    const todoID = req.params.id;
    const { done } = req.body; 
    console.log("updatetodo: ", todoID, done)

    const sql = 'UPDATE todoList SET done = ? WHERE taskID = ?'
    DB.query(sql, [done, todoID], (err, result) => {
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
});

