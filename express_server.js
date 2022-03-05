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

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// render to 'index view' with DB & Username Variables 🟢
app.get("/urls", (req, res) => {
  const templateVars = {
    username: req.cookies.username,
    urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// render to 'new view' with Username Variables 🟢
app.get("/urls/new", (req, res) => {
  const templateVars = {
    username: req.cookies.username
  };
  res.render("urls_new", templateVars);
});

// render to 'show view' or 'error view' with Username Variables 🟢
app.get("/urls/:shortURL", (req,res) => {
  // if the shortURL is not in DB, render error view
  if (urlDatabase[req.params.shortURL]) {
    const templateVars = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL],
      username: req.cookies.username
    };
    res.render("urls_show", templateVars);
  } else {
    const templateVars = {username: req.cookies.username};
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

// set cookie w/ username 🟢
app.post("/login", (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect("/urls");
});

// clear cookie 🟢
app.post("/logout", (req, res) => {
  res.clearCookie('username');
  res.redirect("/urls");
});