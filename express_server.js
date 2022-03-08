const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static("public")); // dir public is root for images that we have.

// startpoint urlsDB 🟢
const urlDatabase = {
  abc123: {
    longURL: "https://www.tsn.ca",
    userID: "123456"
  },
  efg456: {
    longURL: "https://www.google.ca",
    userID: "123456"
  }
};

// startpoint userDB 🟢
const users = {
  "123456": {
    id: "123456",
    email: "1@g.com",
    password: '$2a$10$W8FvFYIGVqZ7seHc0upQ0ODgTAuZhQGzvhOKjMLdxDMv.LWVpS0ea'
  },
  "abcdef": {
    id: "abcdef",
    email: "2@g.com",
    password: '$2a$10$B2ov0fKHaEzgyit4AhT6IepvK7BzseRz8A8zR/./.TCWthjv5MyfC'
  }
};

// error Database 🟢
const errors = {
  e1: {
    code: 404,
    h3: "Unable to find URL",
    h5: "Please check that the URL entered is correct.",
    image: "urlNotFound"
  },
  e2: {
    code: 400,
    h3: "Email and Password are required",
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
  e6: {
    code: 405,
    h3: "Access Denied",
    h5: "This URL doesn't belong to you!",
    image: "accessDenied"
  },
  e7: {
    code: "",
    h3: "Please Login or Register first!",
    h5: "",
    image: "initial"
  },
  e9: {
    code: 404,
    h3: "Page Not Found",
    h5: "",
    image: "pageNotExist"
  },
};

// generating random alphanumeric length 6 for shortURL & userID 🟢
const generateRandomString = function() {
  return Math.random().toString(36).slice(2,8);
};

// check if eamil already exist in userDB, return userID or false 🟢
const getUserByEmail = function(userDB, userEmail) {
  for (const user in userDB) {
    if (users[user].email === userEmail) return users[user];
  }
  return false;
};

// takes urlDB & id, returns DB of URLs where userID equals id 🟢
const urlsForUser = function(urlDB, id) {
  const urlsFiltered = {};
  for (const url in urlDB) {
    if (urlDB[url].userID === id) {
      urlsFiltered[url] = urlDB[url];
    }
  }
  return urlsFiltered;
};

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// render index template with DB of user's URLs & user Variables 🟢
// If user is not logged in, shows message
app.get("/urls", (req, res) => {
  const curUser = users[req.cookies.user_id];
  if (curUser) {
    const templateVars = {
      user: curUser,
      urls: urlsForUser(urlDatabase, curUser.id)
    };
    res.render("urls_index", templateVars);
    console.log("🔘 cookie  ",req.cookies);  // 🚨🚨🚨
    console.log("-----------------------");  // 🚨🚨🚨
    console.log("🔘 users  ",users);         // 🚨🚨🚨
    console.log("-----------------------");  // 🚨🚨🚨
    console.log("🔘 urlDB  ",urlDatabase);   // 🚨🚨🚨
    console.log("-----------------------");  // 🚨🚨🚨
    console.log("🔶 Filtered DB  ",urlsForUser(urlDatabase, users[req.cookies.user_id].id));  // 🚨🚨🚨
    console.log("-----------------------");  // 🚨🚨🚨
  } else {
    const templateVars = {
      user: undefined,
      error: errors.e7
    };
    res.render("error", templateVars);
  }
});
    
// render registration template 🟢
app.get("/register", (req, res) => {
  // if user logged in before just redirect to /urls
  if (users[req.cookies.user_id]) {
    res.redirect("/urls");
  } else {
    const templateVars = {
      user: undefined
    };
    res.render("registeration", templateVars);
  }
});

// render login template 🟢
app.get("/login", (req, res) => {
  // if user logged in before just redirect to /urls
  if (users[req.cookies.user_id]) {
    res.redirect("/urls");
  } else {
    const templateVars = {
      user: undefined
    };
    res.render("login", templateVars);
  }
});

// render new template with user Variable 🟢
app.get("/urls/new", (req, res) => {
  // If someone is not logged in, can not go to url/new and will redirect to /login
  if (!users[req.cookies.user_id]) {
    res.redirect('/login');
  } else {
    const templateVars = {
      user: users[req.cookies.user_id]
    };
    res.render("urls_new", templateVars);
  }
});

// render show template with url & user Variables 🟢
// edit button in index template lead here
// If user is not logged in, shows message
// if asked shortURL is not for curUser shows error
app.get("/urls/:shortURL", (req,res) => {
  const curUser = users[req.cookies.user_id];
  if (curUser) {
    if (urlDatabase[req.params.shortURL]) {
      // check url belongs to current user
      if (urlDatabase[req.params.shortURL].userID === curUser.id) {
        const templateVars = {
          shortURL: req.params.shortURL,
          longURL: urlDatabase[req.params.shortURL].longURL,
          user: curUser
        };
        res.render("urls_show", templateVars);
      // not same user, shows error access denied
      } else {
        const templateVars = {
          user: curUser,
          error: errors.e6
        };
        res.statusCode = errors.e6.code;
        res.render("error", templateVars);
      }
    // if shortURL is not in DB, render error template with user and error variable
    } else {
      const templateVars = {
        user: curUser,
        error: errors.e1
      };
      res.statusCode = errors.e1.code;
      res.render("error", templateVars);
    }
  // not logged in before
  } else {
    const templateVars = {
      user: undefined,
      error: errors.e7
    };
    res.render("error", templateVars);
  }
});

// link on the shortURL will redirect to it's longURL path 🟢
app.get("/u/:shortURL", (req,res) => {
  if (urlDatabase[req.params.shortURL]) {
    res.redirect(`${urlDatabase[req.params.shortURL].longURL}`);
  } else {
    const templateVars = {
      user: users[req.cookies.user_id],
      error: errors.e1
    };
    res.statusCode = errors.e1.code;
    res.render("error", templateVars);
  }
});

// get longURL from form in new template, generate shortURL and add them in urlDB  then redirect 🟢
app.post("/urls", (req, res) => {
  // shows error if someone without login try to creat new shortURL
  // it only can happen via terminal so error designed for terminal
  const curUser = users[req.cookies.user_id];
  if (!curUser) {
    res.send("Access Denied, Login First!\n");
    res.statusCode = 405;
  } else {
    const shortURL = generateRandomString();
    urlDatabase[shortURL] = {
      longURL: req.body.longURL,
      userID: curUser.id
    };
    console.log("🔳 new  ",urlDatabase[shortURL]);      // 🚨🚨🚨
    res.redirect(`/urls/${shortURL}`);
  }
});

// get email & password from form in regestration template 🟠
app.post("/register", (req,res) => {
  const newEmail = req.body.email;
  const newPass = bcrypt.hashSync(req.body.password, 10);
  // If email/password are empty, send back response with 400 status code
  if (!newEmail || !newPass) {
    const templateVars = {
      user: undefined,
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

// delete button in index template - Delete row in urlDB then redirect 🟢
app.post("/urls/:shortURL/delete", (req,res) => {
  const curUser = users[req.cookies.user_id];
  // login required
  if (!curUser) {
    res.send("Access Denied, Login First!\n");
    res.statusCode = 405;
  // prevent to delete otherone's url, from cURL command in terminal
  } else if (urlDatabase[req.params.shortURL].userID === curUser.id) {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
  } else {
    res.send("Access Denied, This URL doesn't belong to you!\n");
    res.statusCode = 405;
  }
});

// edit button in show template - Edit longURL in urlDB & redirect 🟢
app.post("/urls/:id", (req,res) => {
  const curUser = users[req.cookies.user_id];
  // login required
  if (!curUser) {
    res.send("Access Denied, Login First!\n");
    res.statusCode = 405;
  // prevent to Edit otherone's url, from cURL command in terminal
  } else if (urlDatabase[req.params.id].userID === curUser.id) {
    urlDatabase[req.params.id].longURL = req.body.longURL;
    res.redirect("/urls");
  } else {
    res.send("Access Denied, This URL doesn't belong to you!\n");
    res.statusCode = 405;
  }
});

// login check 3 false situation, blank input or email not exist or password not match otherwise set cookie. 🟠
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
    if (!bcrypt.compareSync(curPass, user.password)) {
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
  
// clear cookie 🟢
app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect("/urls");
});

// this matches all routes and all methods- centralized error handler 🟢
app.use((req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id],
    error: errors.e9
  };
  res.statusCode = errors.e9.code;
  res.status(404).render("error", templateVars);
});