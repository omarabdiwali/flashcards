const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.REACT_APP_CLIENT_ID);
const option = { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }

require('dotenv').config();

mongoose.connect(process.env.REACT_APP_URI, option, (err) => {
  if (err) {
    console.log(err);
  }
});

let UserSchema = new Schema({
  name: String,
  email: String,
  image: String,
  cards: [{ folder: String, cards: Array, date: Date }]
});

let Users = mongoose.model('Users', UserSchema);

app.use(express.static('.'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.REACT_APP_SECRET));

app.post('/delete', async (req, res) => {
  const { folder, index } = req.body;
  const id = req.signedCookies['user'];

  Users.findById(id, (err, doc) => {
    if (err) return console.log(err);
    let current = doc.cards;
    current.splice(index, 1);
    doc.cards = current;
    doc.save((err) => {
      if (err) return console.log(err);
      res.send({response: `Deleted '${folder}' folder!`})
    })
  })
})

app.post('/create', async (req, res) => {
  const { name } = req.body;
  const id = req.signedCookies['user'];

  Users.findById(id, (err, doc) => {
    if (err) return console.log(err);
    let folder = { folder: name, cards: [], date: new Date() };
    doc.cards.push(folder);
    
    doc.save(err => {
      if (err) return console.log(err);
      res.send({ response: `Created '${name}' folder!` });
    })
  })
})

app.post('/update', async (req, res) => {
  const { index, folder } = req.body;
  const id = req.signedCookies['user'];

  Users.findById(id, (err, doc) => {
    if (err) return console.log(err);
    doc.cards[index].folder = folder;
    doc.save(err => {
      if (err) return console.log(err);
      res.send({ response: "Folder name has been updated." });
    })
  })
})

app.post('/create/card', async (req, res) => {
  const { index, question, answer } = req.body;
  const id = req.signedCookies['user'];

  Users.findById(id, (err, doc) => {
    if (err) return console.log(err);
    let current = doc.cards[index].cards;
    doc.cards[index].cards = [ ...current, { question: question.toString(), answer: answer.toString() } ];
    doc.save(err => {
      if (err) return console.log(err);
      res.send({ response: "Created card." });
    })
  })
})

app.post('/delete/card', async (req, res) => {
  const { folder, index } = req.body;
  const id = req.signedCookies['user'];

  Users.findById(id, (err, doc) => {
    if (err) return console.log(err);
    let newCards = doc.cards;
    let cards = doc.cards[folder].cards;
    cards.splice(index, 1);
    newCards[folder].cards = [...cards];
    doc.cards = [...newCards];
    
    doc.save(err => {
      if (err) return console.log(err);
      res.send({ response: "Card has been deleted!" });
    })
  })
})

app.post('/update/card', async (req, res) => {
  const { index, cardIndex, question, answer } = req.body;
  const id = req.signedCookies['user'];
  let newCard = { question: question, answer: answer };

  Users.findById(id, async (err, doc) => {
    if (err) return console.log(err);
    let newCards = doc.cards;
    let folderCards = doc.cards[index].cards;
    folderCards.splice(cardIndex, 1);
    folderCards.splice(cardIndex, 0, newCard);
    newCards[index].cards = [ ...folderCards ];
    doc.cards = [ ...newCards ];

    doc.save(err => {
      if (err) return console.log(err);
      res.send({ response: "Card has been updated!" });
    })
  })
})

app.post('/api/v1/auth/google', async (req, res) => {
  const { token } = req.body;
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.REACT_APP_CLIENT_ID
  });

  const { name, email, picture } = ticket.getPayload();
  let query = { email: email };
  let data = { name: name, email: email, image: picture };

  Users.findOneAndUpdate(query, data, { upsert: true, new: true, setDefaultsOnInsert: true }, (err, doc) => {
    if (err) {
      return res.send(500, { error: err });
    }
    let date = new Date();
    date.setDate(date.getDate() + 7);
    res.cookie('user', doc._id, {signed: true, expires: date});
    res.send({ response: "Logged In!" });
  })
})

app.get('/logout', async (req, res) => {
  res.clearCookie("user");
  res.send({ response: "Logged Out!" });
})

app.get('/folders', async (req, res) => {
  const id = req.signedCookies['user'];
  Users.findById(id, (err, doc) => {
    if (err) return console.log(err);
    res.send({ names: doc.cards });
  })
})

app.post('/folder/cards', async (req, res) => {
  const { index } = req.body;
  const id = req.signedCookies['user'];

  Users.findById(id, (err, doc) => {
    if (err) return console.log(err);
    let cards = doc.cards[index];
    res.send({ cards: cards });
  })
})

app.get('/me', async (req, res) => {
  let response = "Logged Out!";
  try {
    const user = req.signedCookies['user'];
    if (user) {
      response = "Logged In!"
    }
    else {
      res.clearCookie("user");
    }
  } catch (err) {
    res.clearCookie("user");
  }
  res.send({ response: response });
})

app.listen(process.env.REACT_APP_PORT, () => console.log(`Running on port ${process.env.REACT_APP_PORT}`));