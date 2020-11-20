const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const db = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'test',
    database: 'hotel'
});

app.post('/register', (req, res) => {

    const {firstName, lastName, email, password} = req.body

    db.query("INSERT INTO Customer (FirstName, LastName, Email, Password) VALUES (?,?,?,?)", 
    [firstName, lastName, email, password],
    (err, result) => {
        console.log(err);
        console.log(result);
    });
});

app.get('/login', (req, res) => {

    const {email, password} = req.body

    db.query("SELECT * FROM Customer WHERE Email = ? AND Password = ?", 
    [email, password],
    (err, result) => {
        if(err) {
            res.send({err: err})
        }

        if (result) {
            res.send(result);
        } else {
            res.send({message: "Oops wrong email or password!"});
        }         
    }
    );
});

app.listen(port, () => console.log(`Listening on port ${port}`))
