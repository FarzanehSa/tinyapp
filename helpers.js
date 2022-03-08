// check if eamil already exist in userDB, return userID or false ⚪️
const getUserByEmail = function(userDB, userEmail) {
  for (const user in userDB) {
    if (userDB[user].email === userEmail) return userDB[user];
  }
};

module.exports = { getUserByEmail };