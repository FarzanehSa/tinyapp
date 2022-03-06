const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static("public")); // dir public is root for images that we have.

// generating random alphanumeric length 6 for shortURL & userID 🟣
const generateRandomString = function() {
  return Math.random().toString(36).slice(2,8);
};

// startpoint urlsDB 🟣
const urlDatabase = {
  // "b2xVn2": "http://www.lighthouselabs.ca",
  // "9sm5xK": "http://www.google.com"
};

// startpoint userDB 🟣
const users = { 
//   "userRandomID": {
//     id: "userRandomID", 
//     email: "user@example.com", 
//     password: "purple-monkey-dinosaur"
//   },
//  "user2RandomID": {
//     id: "user2RandomID", 
//     email: "user2@example.com", 
//     password: "dishwasher-funk"
//   }
};

const errors = {
  e1: {
    code: 404,
    h3: "Unable to find URL",
    h5: "Please check that the URL entered is correct.",
    image: "pageNotFound"
  },
  e2: {
    code: 400,
    h3: "Username and Password are required",
    h5: "Please go back and fill out both fields.",
    image: "error"
  },
  e3: {
    code: 400,
    h3: "Email is already registered",
    h5: "Please login with your email or register new email.",
    image: "error"
  }
};



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// render index template with DB & user Variables 🟣
app.get("/urls", (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id],
    urls: urlDatabase
  };
  console.log(users)
  res.render("urls_index", templateVars);
});

// render registration template 🟠 ❓ pass user
app.get("/register", (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id]
  };
  res.render("registeration", templateVars);
});

// render new template with user Variable 🟣
app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id]
  };
  res.render("urls_new", templateVars);
});

// render show template with url & user Variables 🟣
// edit button in index template lead here
app.get("/urls/:shortURL", (req,res) => {
  // if shortURL is not in DB, render error template with user variable
  if (urlDatabase[req.params.shortURL]) {
    const templateVars = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL],
      user: users[req.cookies.user_id]
    };
    res.render("urls_show", templateVars);
  } else {
    const templateVars = {
      user: users[req.cookies.user_id],
      error: errors.e1
    };
    res.statusCode = errors.e1.code;
    res.render("urls_error", templateVars);
  }
});

// get longURL from form in new template, generate shortURL and add them in urlDB  then redirect 🟣
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

// link on the shortURL will redirect to it's longURL path 🟣
app.get("/u/:shortURL", (req,res) => {
  res.redirect(`${urlDatabase[req.params.shortURL]}`);
});

// get email pass from form in regestration template, generate id, add to userDB then redirect 🟠
app.post("/register", (req,res) => {
  const userID = generateRandomString();
  users[userID] = {
    id: userID,
    password: req.body.password,
    email: req.body.email,
  }
  res.cookie('user_id',userID);
  console.log(users); // 🚨
  res.redirect("/urls");
});

// delete button in index template - Delete row in urlDB then redirect 🟣
app.post("/urls/:shortURL/delete", (req,res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

// edit button in show template - Edit longURL in urlDB & redirect 🟣
app.post("/urls/:id", (req,res) => {
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect("/urls");
});

// set cookie w/ username 🟢🟠
app.post("/login", (req, res) => {
  // res.cookie('username', req.body.username);
  res.redirect("/urls");
});

// clear cookie 🟢🟠 ❓ clear or not?
app.post("/logout", (req, res) => {
  // res.clearCookie('username');
  res.clearCookie('user_id');
  res.redirect("/urls");
});