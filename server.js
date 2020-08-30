const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const saltRounds = 10;
const knex = require("knex");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "software",
    database: "smartbrain",
  },
});

console.log(
  db
    .select("id")
    .from("users")
    .then((data) => {
      console.log(data);
    })
);

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
      joined: new Date(),
    },
    {
      id: 124,
      name: "Sally",
      email: "Sally@gmail.com",
      password: "bananas",
      entries: 0,
      joined: new Date(),
    },
  ],
  login: [
    {
      id: "987",
      hash: "",
      email: "John@gmail.com",
    },
  ],
};

app.get("/", (req, res) => {
  res.send("hello world");
});

app.post("/signin", (req, res) => {
  const { email, password } = req.body;

  db("login")
    .where({
      email: email,
    })
    .select("email", "hash")
    .then((data) => {
      const isValid = data[0].compareSync(password, data[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where({
            email: email,
          })
          .then((user) => {
            res.json(user[0]);
          })
          .catch((err) => res.status(400).json("Unable to get user"));
      } else {
        res.status(400).json("wrong credentials");
      }
    })
    .catch((err) => res.status(400).json("wrong credentials"));
});

app.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  const hash = bcrypt.hashSync(password, saltRounds);
  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        return trx("users")
          .returning("*")
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date(),
          })
          .then((user) => res.json(user[0]))
          .catch((err) => console.log(err.message));
      })
      .then(trx.commit)
      .catch(trx.rollback);
  });
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({ id })
    .then((user) => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json("not found");
      }
    })
    .catch((err) => res.status(400).json("error getting user"));
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0]);
    })
    .catch((err) => res.status(400).json("unable to get entries"));
});

var port = process.env.PORT || 5000;

app.listen(port || 5000, () => console.log(`Listening to port ${port}`));

/*
  / --> res = this is working
  /signin --> POST = success/fail
  /signup --> POST = return added user
  /profile/:userid --> GET = user
  /image --> PUT --> Updated user object, count
*/
