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
  e10: {
    code: 405,
    h3: "Access Denied",
    h5: "Please login first!",
    image: "accessDenied"
  },
};

// startpoint urlsDB ⚪️
const urlDatabase = {
/*   abc123: {
    longURL: "https://www.tsn.ca",
    userID: "123456",
  },
  efg456: {
    longURL: "https://www.google.ca",
    userID: "123456",
  } */
};

// startpoint userDB ⚪️
const users = {
/*   "123456": {
    id: "123456",
    email: "1@g.com",
    password: '$2a$10$V0zqZ90LapWEVTH8ki5JcOJxmyq6Iziu5jRqJ7OXC9pD8Zo7x5kDm',
    visitorID: "000000",
  },
  "abcdef": {
    id: "abcdef",
    email: "2@g.com",
    password: '$2a$10$K8/2GlqTWqCB8eOte2d.1e5sUOwtcbVpSQdOeqbmGhLsLhfLJQtMi',
    visitorID: "111111",
  } */
};

// url visit history ⚪️
const visitUrlDB = {
/*   xxxooo: {
    1: {visitorID: 'aaa111', time: 0 },
    2: { visitorID: 'ertdhf', time: 0 }
  }, */
};

// Just keep the data of unique visitor of each url ⚪️
const uniqueUsersVisit = {
  // xxxooo: 2,
};

module.exports = { urlDatabase, users, errors, visitUrlDB, uniqueUsersVisit };