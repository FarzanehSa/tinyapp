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

// generating random alphanumeric length 6 for shortURL
function generateRandomString() {
  return Math.random().toString(36).slice(2,8);
}

// startpoint Database
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// render to 'index view' with DB & Username Variables
app.get("/urls", (req, res) => {
  const templateVars = { 
    username: req.cookies.username,
    urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// GET route to show the form
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// render urls/shortURL to the show page or error page
app.get("/urls/:shortURL", (req,res) => {
  if (urlDatabase[req.params.shortURL]) {
    const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};
    res.render("urls_show", templateVars)
  } else {
    res.statusCode = 404;
    res.render("urls_error")
    }
});

// add new url, Add row to urlDB and redirect to show/edit page
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL
  res.redirect(`/urls/${shortURL}`) 
});

// link of the shortURL will redirect to it's longURL
app.get("/u/:shortURL", (req,res) => {
    res.redirect(`${urlDatabase[req.params.shortURL]}`)
});

// delete button from main page - Delete row in urlDB and redirect to main page.
app.post("/urls/:shortURL/delete", (req,res) => {
  delete urlDatabase[req.params.shortURL]
  res.redirect("/urls")
})

// Edit button from main page will redirect to the show/edit page
app.post("/urls/:shortURL", (req,res) => {
  res.redirect(`/urls/${req.params.shortURL}`)
})

// edit longURL & then redirect to main page.
app.post("/urls/:shortURL/edit", (req,res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect("/urls");
})

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  if (username.length !== 0) {
    res.cookie('username', req.body.username);
  }
  res.redirect("/urls");
});