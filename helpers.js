// generating random alphanumeric length 6 for shortURL & userID ⚪️
const generateRandomString = function() {
  return Math.random().toString(36).slice(2,8);
};

// check if eamil already exist in userDB, return userID or false ⚪️
const getUserByEmail = function(userEmail, userDB) {
  for (const user in userDB) {
    if (userDB[user].email === userEmail) return userDB[user];
  }
};

// takes urlDB & id, returns DB of URLs where userID equals id ⚪️
const urlsForUser = function(id, urlDB) {
  const urlsFiltered = {};
  for (const url in urlDB) {
    if (urlDB[url].userID === id) {
      urlsFiltered[url] = urlDB[url];
    }
  }
  return urlsFiltered;
};

// takes url and database ⚪️
// returns next available number to use as key!
const nextID = function(url, database) {
  let nextId = 0;
  if (!database[url]) {
    database[url] = {};
    nextId = 1;
  } else {
    const arr = Object.keys(database[url]).map(x => Number(x));
    nextId = Math.max(...arr) + 1;
  }
  return nextId;
};

// takes url and database ⚪️
// returns a number, that how many times url has been visited!
const totalVisit = function(url, database) {
  if (!database[url]) return 0;
  return Object.keys(database[url]).length;
};

// takes id, url and database ⚪️
// If id has not visit that url (returns false) or not (returns true)
const findVisitor = function(id, url, database) {
  if (database[url]) {
    for (const key in database[url]) {
      if (database[url][key].visitorID === id) return true;
    }
  }
  return false;
};

const convertTimestamp = function(timeStamp) {
  const date = timeStamp.getFullYear() + '-' + (timeStamp.getMonth() + 1) + '-' + timeStamp.getDate();
  const time = timeStamp.getHours() + ":" + timeStamp.getMinutes() + ":" + timeStamp.getSeconds();
  return {date, time};
};

module.exports = { generateRandomString, getUserByEmail, urlsForUser, nextID, totalVisit, findVisitor, convertTimestamp };