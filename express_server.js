const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const bcrypt = require("bcryptjs");
const { generateRandomString, getUserByEmail, urlsForUser } = require("./helpers")

const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));
app.use(express.static("public")); // dir public is root for images that we have.

// startpoint urlsDB ⚪️
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

// startpoint userDB ⚪️
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

// error Database ⚪️
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

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// render index template with DB of user's URLs & user Variables ⚪️
app.get("/urls", (req, res) => {
  const curUser = users[req.session.user_id];
  // If user is not logged in, shows message
  if (!curUser) {
  const templateVars = {
    user: undefined,
    error: errors.e7
  };
  return res.render("error", templateVars);
  }
  const templateVars = {
    user: curUser,
    urls: urlsForUser(curUser.id, urlDatabase)
  };
  res.render("urls_index", templateVars);
  console.log("🔘 cookie  ",req.session);  // 🚨🚨🚨
  console.log("-----------------------");  // 🚨🚨🚨
  console.log("🔘 users  ",users);         // 🚨🚨🚨
  console.log("-----------------------");  // 🚨🚨🚨
  console.log("🔘 urlDB  ",urlDatabase);   // 🚨🚨🚨
  console.log("-----------------------");  // 🚨🚨🚨
  console.log("🔶 Filtered DB  ",urlsForUser(users[req.session.user_id].id, urlDatabase));  // 🚨🚨🚨
  console.log("-----------------------");  // 🚨🚨🚨
});

// render new template with user Variable ⚪️
app.get("/urls/new", (req, res) => {
  const curUser = users[req.session.user_id];
  // If someone is not logged in, redirect to /login
  if (!curUser) {
    return res.redirect('/login');
  }
  const templateVars = {
    user: curUser
  };
  res.render("urls_new", templateVars);
});

// render show template with url & user Variables ⚪️
// edit button in index template lead here
app.get("/urls/:shortURL", (req,res) => {
  const curUser = users[req.session.user_id];
  // If user is not logged in, shows message
  if (!curUser) {
    const templateVars = {
      user: undefined,
      error: errors.e7
    };
    return res.render("error", templateVars);
  }
  // if shortURL is not in DB, render error template with user and 404 status code
  if (!urlDatabase[req.params.shortURL]) {
    const templateVars = {
      user: curUser,
      error: errors.e1
    };
    return res.status(404).render("error", templateVars);
  }
  // If not same user, shows error access denied & status code 405
  if (urlDatabase[req.params.shortURL].userID !== curUser.id) {
    const templateVars = {
      user: curUser,
      error: errors.e6
    };
    return res.status(405).render("error", templateVars);
  }
  // after pass all edges
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user: curUser
  };
  res.render("urls_show", templateVars);
});

// link on the shortURL will redirect to it's longURL path ⚪️
// should work for any user (logged in or not)
app.get("/u/:shortURL", (req,res) => {
  if (urlDatabase[req.params.shortURL]) {
    return res.redirect(`${urlDatabase[req.params.shortURL].longURL}`);
  }
  // If link is not valid return error with 404 status code
  const templateVars = {
    user: users[req.session.user_id],
    error: errors.e1
  };
  res.status(404).render("error", templateVars);
});

// get longURL from form in new template, generate shortURL and add them in urlDB  then redirect ⚪️
app.post("/urls", (req, res) => {
  const curUser = users[req.session.user_id];
  // shows error if someone without login try to creat new shortURL
  // it only can happen via terminal so error designed for terminal
  if (!curUser) {
    return res.status(405).send("Access Denied, Login First!\n");
  } 
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: curUser.id
  };
  console.log("🔳 New url pair  ",urlDatabase[shortURL]);      // 🚨🚨🚨
  res.redirect(`/urls/${shortURL}`);
});

// delete button in index template - Delete row in urlDB then redirect ⚪️
app.post("/urls/:shortURL/delete", (req,res) => {
  const curUser = users[req.session.user_id];
  // login required
  if (!curUser) {
    return res.status(405).send("Access Denied, Login First!\n");
  } 
  // prevent to delete otherone's url, from cURL command in terminal
  if (urlDatabase[req.params.shortURL].userID !== curUser.id) {
    return res.status(405).send("Access Denied, This URL doesn't belong to you!\n");
  }
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

// edit button in show template - Edit longURL in urlDB & redirect ⚪️
app.post("/urls/:id", (req,res) => {
  const curUser = users[req.session.user_id];
  // login required
  if (!curUser) {
    return res.status(405).send("Access Denied, Login First!\n");
  } 
  // prevent to Edit otherone's url, from cURL command in terminal
  if (urlDatabase[req.params.id].userID !== curUser.id) {
    return res.status(405).send("Access Denied, This URL doesn't belong to you!\n");
  }
  urlDatabase[req.params.id].longURL = req.body.longURL;
  res.redirect("/urls");
});
    
// render registration template ⚪️
app.get("/register", (req, res) => {
  // if user logged in before just redirect to /urls
  if (users[req.session.user_id]) {
    return res.redirect("/urls");
  }
  const templateVars = {
    user: undefined
  };
  res.render("registeration", templateVars);
});

// render login template ⚪️
app.get("/login", (req, res) => {
  // if user logged in before, redirect to /urls
  if (users[req.session.user_id]) {
    return res.redirect("/urls");
  }
  const templateVars = {
    user: undefined
  };
  res.render("login", templateVars);
});

// get email & password from form in regestration template ⚪️
app.post("/register", (req,res) => {
  const newEmail = req.body.email;
  const newPass = bcrypt.hashSync(req.body.password, 10);
  // If email/password are empty, send back response with 400 status code
  if (!newEmail || !newPass) {
    const templateVars = {
      user: undefined,
      error: errors.e2
    };
    return res.status(400).render("error", templateVars);
  } 
  // If email already registerd, send response back with 400 status code
  if (getUserByEmail(newEmail, users)) {
    const templateVars = {
      user: undefined,
      error: errors.e3
    };
    return res.status(400).render("error", templateVars);
  } 
  // otherwise generate id, add to userDB then redirect
  const userID = generateRandomString();
  users[userID] = {
    id: userID,
    email: newEmail,
    password: newPass,
  };
  req.session.user_id = userID;
  res.redirect("/urls");
});

// login check 3 false situation, blank input or email not exist or password not match otherwise set cookie. ⚪️
app.post("/login", (req, res) => {
  const curEmail = req.body.email;
  const curPass = req.body.password;
  // If email/password are empty, send back response with 400 status code
  if (!curEmail || !curPass) {
    const templateVars = {
      user: undefined,
      error: errors.e2
    };
    return res.status(400).render("error", templateVars);
  }
  // if email is not exist, send back response with 403 status code
  if (!getUserByEmail(curEmail, users)) {
    const templateVars = {
      user: undefined,
      error: errors.e4
    };
    return res.status(403).render("error", templateVars);
  } 
  const user = getUserByEmail(curEmail, users);
  // if password does not match, send back response with 403 status code
  if (!bcrypt.compareSync(curPass, user.password)) {
    const templateVars = {
      user: undefined,
      error: errors.e5
    };
    return res.status(403).render("error", templateVars);
  }
  // set cookie and redirect
  req.session.user_id = user.id;
  res.redirect("/urls");
});
  
// logout & clear cookie ⚪️
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

// this matches all routes and all methods- centralized error handler ⚪️
app.use((req, res) => {
  const templateVars = {
    user: users[req.session.user_id],
    error: errors.e9
  };
  res.status(404).render("error", templateVars);
});