// Setting Dependencies
const path = require('path');
const express = require('express');
const helemt = require('helmet');
const cookiePraser = require('cookie-parser');

const app = express();

// Requied Middlewares
app.use(express.static('public'));
app.use(express.json());
// extended true => encoded data prased with qs library
// extended false => encoded data prased with queryString library
app.use(express.urlencoded({ extended: false }));
app.use(cookiePraser());
app.use(helemt());

// Just non-sense
// app.use((req, res, next) => {
//   if (req.query.msg === 'fail')
//     res.locals.msg = 'Sorry';
//   else
//     res.locals.msg = 'Hi!!';
//   next();
// });

// Setting view Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + '/views'));

// Rendering the Login Page
app.get('/login', (req, res, next) => {
  // the query string is insecure data
  // console.log(req.query);
  // Query String is the insecure data
  if (Object.keys(req.query).length) {
    console.log(req.query);
    res.render('passwordError', {
      msg: 'Password Incorrect'
    });
  } else {
    res.render('login', {
      msg:'Enter username and password'
    });
  }
});

// Getting post request from login.ejs
app.post('/process_login', (req, res, next) => {

  // username and password in req comes from the input field name properties
  // and prases by the urlencoded to req.body
  const username = req.body.username;
  const password = req.body.password;

  // Checking the database to see if they are valid
  // OR we do OAuth or Token
  // If valid then we store the username in cookies
  res.cookie('username', username);

  if (password === 'x')
    res.redirect('/welcome');
  else {
    // msg is key and fail is value
    // Path below or route is '/login'
    res.redirect('/login?msg=passwordFail&status=signup');
  }
});

// welcome route for login user
app.get('/welcome', (req, res, next) => {
  // We can't access the username by req.body.username
  // Because it's totally new Request
  // So we take the advantage of cookies
  // For parsing cookies we need cookiePraser
  const index = req.cookies.username.indexOf('@');
  const user = req.cookies.username.slice(0, index);

  res.render('welcome', {
    user
  });

});


// Runs first before all routes and check for all the get post that have id
// as a key in params
app.param('id', (req, res, next, valueOfid) => {
  console.log(valueOfid);
  // if id has something with story
  // Or id has something to do with blog
  next();
});

app.get('/story/:storyid', (req, res, next) => {
  // req.params object
  res.send(`<h3>Story ${ req.params.storyid }</h3>`);
});

/**
 * It will never run because of the above route but if we put next(), then it will work
 */
app.get('/story/:blogid', (req, res, next) => {
  // req.params object
  res.send(`<h3>Story 2 ${ req.params.blogid }</h3>`);
});

app.get('/story/:storyid/:link', (req, res, next) => {
  // req.params object
  res.send(`<h3>Story ${ req.params.storyid } -- ${ req.params.link }</h3>`)
});

// Downloading the statement
app.get('/statement', (req, res) => {
  // But will render the image and user are force to download it via save as image
  const index = req.cookies.username.indexOf('@');
  const user = req.cookies.username.slice(0, index);
  // Setting the headers content-deposition to attachment and file name second arguments
  res.download(path.join(__dirname + '/userStatements/BankStatementChequing.png'), `${ user }.png`, (err) => {
    if (!res.headersSent)
      console.log('/download/error');
    process.exit(1);
  });
});

// Logout Route in welcome Page
app.get('/logout', (req, res, next) => {
  // We have clear cookies
  // And redirect to login Route
  res.clearCookie('username');
  res.redirect('/login');
});

app.listen(3000);
