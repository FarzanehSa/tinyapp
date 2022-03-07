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

// startpoint urlsDB 🟣
const urlDatabase = {
  // "b2xVn2": "http://www.lighthouselabs.ca",
  // "9sm5xK": "http://www.google.com"
};

// startpoint userDB 🟣
const users = {
  //  "userRandomID": {
  //    id: "userRandomID",
  //    email: "user@example.com",
  //    password: "purple-monkey-dinosaur"
  //  },
  //  "user2RandomID": {
  //    id: "user2RandomID",
  //    email: "user2@example.com",
  //    password: "dishwasher-funk"
  //  }
};

// error Database 🟣
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
  },
  e4: {
    code: 403,
    h3: "Invalid login",
    h5: "No user with that email!",
    image: "error"
  },
  e5: {
    code: 403,
    h3: "Incorrect Password",
    h5: "Try again!",
    image: "error"
  },
};

// generating random alphanumeric length 6 for shortURL & userID 🟣
const generateRandomString = function() {
  return Math.random().toString(36).slice(2,8);
};

// check if eamil already exist in userDB, return userID or false 🟣
const getUserByEmail = function(userDB, userEmail) {
  for (const user in userDB) {
    if (users[user].email === userEmail) return users[user];
  }
  return false;
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
  res.render("urls_index", templateVars);
});
    
// render registration template 🟣
app.get("/register", (req, res) => {
  const templateVars = {
    user: undefined
  };
  res.render("registeration", templateVars);
});

// render login template 🟣
app.get("/login", (req, res) => {
  const templateVars = {
    user: undefined
  };
  res.render("login", templateVars);
});

// render new template with user Variable 🟠
app.get("/urls/new", (req, res) => {
  // if (!req.cookies.user_id) {
  //   res.redirect('/login');
  // }
  const templateVars = {
    user: users[req.cookies.user_id]
  };
  res.render("urls_new", templateVars);
});

// render show template with url & user Variables 🟣
// edit button in index template lead here
app.get("/urls/:shortURL", (req,res) => {
  // if shortURL is not in DB, render error template with user and error variable
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
    res.render("error", templateVars);
  }
});

// link on the shortURL will redirect to it's longURL path 🟣
app.get("/u/:shortURL", (req,res) => {
  res.redirect(`${urlDatabase[req.params.shortURL]}`);
});

// get longURL from form in new template, generate shortURL and add them in urlDB  then redirect 🟣
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

// get email & password from form in regestration template 🟣
app.post("/register", (req,res) => {
  const newEmail = req.body.email;
  const newPass = req.body.password;
  // If email/password are empty, send back response with 400 status code
  if (!newEmail || !newPass) {
    const templateVars = {
      user: users[req.cookies.user_id],
      error: errors.e2
    };
    res.statusCode = errors.e2.code;
    res.render("error", templateVars);
    // If email already registerd, send response back with 400 status code
  } else if (getUserByEmail(users, newEmail)) {
      const templateVars = {
        user: undefined,
        error: errors.e3
      };
      res.statusCode = errors.e3.code;
      res.render("error", templateVars);
    // otherwise generate id, add to userDB then redirect
    } else {
        const userID = generateRandomString();
        users[userID] = {
          id: userID,
          email: newEmail,
          password: newPass,
        };
      res.cookie('user_id',userID);
      res.redirect("/urls");
      }
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

// login check 3 false situation, blank input or email not exist or password not match otherwise set cookie. 🟣
app.post("/login", (req, res) => {
  const curEmail = req.body.email;
  const curPass = req.body.password;
  // If email/password are empty, send back response with 400 status code
  if (!curEmail || !curPass) {
    const templateVars = {
      user: undefined,
      error: errors.e2
    };
    res.statusCode = errors.e2.code;
    res.render("error", templateVars);
  // if email is not exist, send back response with 403 status code
  } else if (!getUserByEmail(users, curEmail)) {
    const templateVars = {
      user: undefined,
      error: errors.e4
    };
    res.statusCode = errors.e4.code;
    res.render("error", templateVars);
  } else {
      const user = getUserByEmail(users, curEmail);
      // if password does not match, send back response with 403 status code
      if (user.password !== curPass) {
        const templateVars = {
          user: undefined,
          error: errors.e5
        };
        res.statusCode = errors.e5.code;
        res.render("error", templateVars);
      } else {
        // set cookie and redirect
        res.cookie('user_id', user.id);
        res.redirect("/urls");
      }
    }
  });
  
// clear cookie 🟣
app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect("/urls");
});