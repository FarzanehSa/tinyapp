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

// generating random alphanumeric length 6 for shortURL 🟢
const generateRandomString = function() {
  return Math.random().toString(36).slice(2,8);
};

// startpoint Database 🟢
const urlDatabase = {
  // "b2xVn2": "http://www.lighthouselabs.ca",
  // "9sm5xK": "http://www.google.com"
};

// 🚨
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
}

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// render to 'index view' with DB & user Variables 🟢🟠
app.get("/urls", (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id],
    urls: urlDatabase
  };
  console.log(users)
  res.render("urls_index", templateVars);
});

// 🚨 
app.get("/register", (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id]
  };
  res.render("urls_register", templateVars);
});

// render to 'new view' with user Variable 🟢🟠
app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id]
  };
  res.render("urls_new", templateVars);
});

// render to 'show view' or 'error view' with url & user Variables 🟢🟠
app.get("/urls/:shortURL", (req,res) => {
  // if the shortURL is not in DB, render error view
  if (urlDatabase[req.params.shortURL]) {
    const templateVars = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL],
      user: users[req.cookies.user_id]
    };
    res.render("urls_show", templateVars);
  } else {
    const templateVars = {user: users[req.cookies.user_id]};
    res.statusCode = 404;
    res.render("urls_error", templateVars);
  }
});

// get longURL from client, generate shortURL and add them in urlDB 🟢
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

// link on the shortURL will redirect to it's longURL path 🟢
app.get("/u/:shortURL", (req,res) => {
  res.redirect(`${urlDatabase[req.params.shortURL]}`);
});

// 🚨
app.post("/register", (req,res) => {
  const userID = generateRandomString();
  users[userID] = {
    id: userID,
    password: req.body.password,
    email: req.body.email,
  }
  res.cookie('user_id',userID);
  console.log(users);
  res.redirect("/urls");
});

// delete button from index page - Delete row in urlDB and redirect to index page 🟢
app.post("/urls/:shortURL/delete", (req,res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

// edit button from index page will redirect to the show/edit page 🟢
app.post("/urls/:shortURL", (req,res) => {
  res.redirect(`/urls/${req.params.shortURL}`);
});

// edit longURL in urlDB & redirect to index page 🟢
app.post("/urls/:shortURL/edit", (req,res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
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