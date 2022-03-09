const { assert } = require('chai');

const { getUserByEmail, urlsForUser } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

const testUrls = {
  '7aaszx': { longURL: 'https://www.rogers.com', userID: 'abcdef' },
  abc123: { longURL: 'https://www.tsn.ca', userID: '123456' },
  dju0z3: { longURL: 'http://www.microsoft.com', userID: '4tt55p' },
  lz1kn9: { longURL: 'http://www.google.com', userID: '4tt55p' },
  efg456: { longURL: 'https://www.google.ca', userID: '123456' },
  im7sx5: { longURL: 'http://www.yahoo.ca', userID: '4tt55p' },
  qitqkd: { longURL: 'https://www.compasscard.ca', userID: 'abcdef' }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedUserID = "userRandomID";
    assert.equal(user.id, expectedUserID);
  });
  it('should return undefined when email not exist', function() {
    const user = getUserByEmail("info@example.com", testUsers);
    assert.isUndefined(user);
  });
});

describe('urlsForUser', function() {
  it('should return URLs where userID equals id', function() {
    const urls = urlsForUser("4tt55p", testUrls)
    const expectedUrls = {
      lz1kn9: { longURL: 'http://www.google.com', userID: '4tt55p' },
      im7sx5: { longURL: 'http://www.yahoo.ca', userID: '4tt55p' },
      dju0z3: { longURL: 'http://www.microsoft.com', userID: '4tt55p' }
    };
    assert.deepEqual(urls, expectedUrls);
  });
  it('should return empty object if that id has no related url ', function() {
    const urls = urlsForUser("4tt00", testUrls)
    assert.deepEqual(urls, {});
  });
});