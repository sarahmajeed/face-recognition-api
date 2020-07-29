const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const saltRounds = 10;
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: 'software',
    database: 'smartbrain'
  }
});

console.log(db.select('id').from('users').then(data => {
  console.log(data);
}));

const app = express();

app.use(express.json());
app.use(cors());

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
  ],
  login: [
    {
      id: '987',
      hash: '',
      email: "John@gmail.com"
    }

  ]
}

app.get('/', (req, res) => {
  res.send(database.users)
})

app.post('/signin', (req, res) => {
  // Load hash from your password DB.
  // bcrypt.compare('software', '$2b$10$tEUoRi8//vPORBwVluPryuen1na55qmlTQpTFTJyGOaLtIHBQUlTu', function (err, result) {
  //   console.log('first guess', result);
  // });
  // bcrypt.compare('hello', '$2b$10$tEUoRi8//vPORBwVluPryuen1na55qmlTQpTFTJyGOaLtIHBQUlTu', function (err, result) {
  //   console.log('second guess', result);
  // });
  console.log(req.body);
  if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
    res.json('Success');
  }
  else {
    res.status(400).json('Fail')
  }

})

app.post('/signup', (req, res) => {
  const { name, email } = req.body
  // bcrypt.hash(password, saltRounds).then(function (hash) {
  //   console.log(hash);
  // });
  db('users')
    .returning('*')
    .insert({
      email: email,
      name: name,
      joined: new Date()
    })
    .then(user => res.json(user[0]))
    .catch(err => console.log(err.message))
})

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  db
    .select('*')
    .from('users')
    .where({ id })
    .then(user => {
      if (user.length) {
        res.json(user[0])
      } else {
        res.status(400).json('not found')
      }

    }).catch(err => res.status(400).json('error getting user'))
})


app.put('/image', (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach(user => {
    if (id === `${user.id}`) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  })
  if (found === false) {
    res.status(400).json('not found')
  }
})

app.listen(5000, () => console.log('Listening to port 5000'))

/*
  / --> res = this is working
  /signin --> POST = success/fail
  /signup --> POST = return added user
  /profile/:userid --> GET = user
  /image --> PUT --> Updated user object, count
*/
