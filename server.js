const http = require('http');
const url = require('url');
const fs = require('fs');
const express = require("express");
const app = express(); 
const path = require('path');

app.use(express.json()); 
app.use(express.urlencoded({extended:true}));
const port = 7647

// app.set('views', 'static/views');
app.set('view engine', 'pug');

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


app.get('/getSchedule', (req, res) => {
  console.log("getting schedule")
  const sql = 'SELECT * FROM schedule ORDER BY day, start';
  DB.query(sql, (err, results) => {
    if (err) {
      console.error("Database select error:", err);
      return res.status(500).json({ success: false , results: Null});
    }
    console.log("results form server: ", results.length, results)
    return res.status(200).json({ success: true, results: results }); 
  });
});


app.post('/addSchedule', (req, res) => {
  console.log("req.body: ", req.body)
  const {event, day, start, end, phone, location, url} = req.body; 
  const sql = 'INSERT INTO schedule (event, day, start, end, phone, location, url) VALUES (?, ?, ?, ?, ?, ?, ?)'; // prevent sql injections
  const values = [
    event || null,
    day || null,
    start ? start + ':00' : null, 
    end ? end + ':00' : null, 
    phone || null,
    location || null,
    url || null
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

app.get('/editSchedule/:id', (req, res) => {
  const scheduleID = req.params.id;
	console.log("editSchedule id: " + scheduleID);

  //validating the ID
  const sql = "select * from schedule where id = ?"
  DB.query(sql, scheduleID, (err, result) => {
    if (err || result.length > 1) {
      console.log("attempting to edit invalid schedule ID")
      // console.log(err)
    } else {
      console.log("result from editSchedule: ", result)
      result = result[0]
      // console.log("result from editSchedule: ", result.event)
      // console.log("result from editSchedule: ", result.day)
      // console.log("result from editSchedule: ", result.start)
      // console.log("result from editSchedule: ", result.end)
      // console.log("result from editSchedule: ", result.phone)
      // console.log("result from editSchedule: ", result.location)
      // console.log("result from editSchedule: ", result.url)
      // TODO: update this according to your schedule table or what it is called in your sql
      return res.render(path.join(__dirname, 'views', 'editForm.pug'), result);
    }
  })
});

app.get('/updateScheduleForm.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'js', 'updateScheduleForm.js'));
});

app.post('/updateSchedule/:id', (req, res) => {
  const scheduleID = req.params.id;
  const newData = req.body;

  console.log(`updateScheduleForm for ID: ${scheduleID}`);

  const sql = `UPDATE schedule SET
                 event = ?, day = ?, start = ?, end = ?,
                 phone = ?, location = ?, url = ?
               WHERE id = ?`;

  const values = [
    newData.event,
    newData.day,
    newData.start,
    newData.end,
    newData.phone,
    newData.location,
    newData.url,
    scheduleID
  ];

  DB.query(sql, values, (err, result) => {
    if (err) {
      console.log("fail update.", err)
      return res.status(404).json({ success: false});
    }

    console.log("successful update:", scheduleID);
    return res.status(200).json({ success: true});
  });
});

app.use(express.static(path.join(__dirname, 'static')));
app.get('/aboutme.html', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'static', 'html', 'aboutme.html'));
});
app.get('/aboutme.css', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'static', 'css', 'aboutme.css'));
});
app.get('/aboutme.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'js', 'aboutme.js'));
});

app.get('/myschedule.html', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'static', 'html', 'myschedule.html'));
});
app.get('/myschedule.css', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'static', 'css', 'myschedule.css'));
});
app.get('/myschedule.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'js', 'myschedule.js'));
});

app.get('/myform.html', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'static', 'html', 'myform.html'));
});
app.get('/myform.css', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'static', 'css', 'myform.css'));
});
app.get('/myform.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'js', 'myform.js'));
});

app.get('/stocks.html', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'static', 'html', 'stocks.html'));
});
app.get('/stocks.css', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'static', 'css', 'stocks.css'));
});
app.get('/stocks.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'js', 'stocks.js'));
});

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'static', 'html', '404.html'));
});

app.listen(port, () => {
  console.log(`server listening on http://localhost:${port}/`)
});

