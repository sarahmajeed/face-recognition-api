const express = require('express');

const app = express();

app.use(express.json())

const database = {
  users: [
    {
      id: 123,
      name: "John",
      email: "John@gmail.com",
      password: "cookies",
      entries: 0,
      joined: new Date()
    },
    {
      id: 124,
      name: "Sally",
      email: "Sally@gmail.com",
      password: "bananas",
      entries: 0,
      joined: new Date()
    }
  ]
}

app.get('/', (req, res) => {
  res.send(database.users)
})

app.post('/signin', (req, res) => {
  if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
    res.json('Success');
  }
  else {
    res.status(400).json('Fail')
  }

})

app.post('/register', (req, res) => {
  const { name, email, password } = req.body
  database.users.push({
    id: 125,
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date()
  })
  res.json(database.users);
})

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  })
  if (found === false) {
    res.status(400).json('not found')
  }
})

app.put('/image', (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  })
  if (found === false) {
    res.status(400).json('not found')
  }
})

app.listen(5000, () => console.log('Listening to port 5000'));

/*
  / --> res = this is working
  /signin --> POST = success/fail
  /register --> POST = return added user
  /profile/:userid --> GET = user
  /image --> PUT --> Updated user object, count
*/
