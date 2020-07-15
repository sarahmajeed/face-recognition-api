const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Yayyy! I am working')
})

app.listen(5000, () => console.log('Listening to port 5000'));

/*
  / --> res = this is working
  /signin --> POST = success/fail
  /register --> POST = return added user
  /profile/:userid --> GET = user
  /image --> PUT --> Updated user object, count
*/
