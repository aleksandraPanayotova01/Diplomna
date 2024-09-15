const path = require("path");
const express = require("express");
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
// const bootstrap = require('bootstrap')

require("dotenv").config();

const app = express();

app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(session(
    {
        name: process.env.SESSION_NAME,
        resave: false,
        saveUninitialized: false, // Will not save empty sessions
        secret: process.env.SECRET,//process.env.SESSION_SECRET
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000, // One week
            httpOnly: true, // Prevents client side scripts from accessing data
            sameSite: true
        }
    }
));
app.use(flash());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const adminRouter = require('./routes/adminRoutes');
const accountRouter = require('./routes/accountRoutes');
const lecturerRouter = require('./routes/lecturerRoutes');
const studentRouter = require('./routes/studentRoutes');

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

app.use("/", accountRouter);
app.use("/lecturer", lecturerRouter);
app.use("/admin", adminRouter);
app.use("/student", studentRouter);

app.get('*', (req, res) => {
    res.send("404 NOT FOUND");
})

app.listen(3000, () => {
    console.log("ON PORT 3000!");
})