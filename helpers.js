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

module.exports = { generateRandomString, getUserByEmail, urlsForUser };