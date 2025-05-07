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

app.delete('/deleteSchedule/:id', (req, res) => {
  const scheduleID = req.params.id;
  console.log("scheduleID: ", scheduleID)

  DB.query(`DELETE FROM schedule WHERE id = ?`, scheduleID, (err, result) => {
      if (err) {
        console.log("failed to removed ", scheduleID)
          res.status(500).json({ success: false});
      } else if (result.affectedRows > 0) {
        console.log("successfully removed ", scheduleID)
        res.status(200).json({ success: true});
      } else {
        console.log("failed to removed ", scheduleID)
        res.status(404).json({ success: false});
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

app.listen(port, () => {
  console.log(`server listening on http://localhost:${port}/`)
});

