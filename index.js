const Joi = require('joi');
const keys=require('./config/keys');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
var cors = require('cors');
app.use(cors());
app.use(express.static('public'));
app.use(fileUpload());
require('./routes/index')(app);

app.use('/public', express.static(__dirname + "/public"));

app.post('/api/upload', (req, res) => {
  if (!req.files) {
      return res.status(500).send({ msg: "file is not found" })
  }
  const myFile = req.files.file;
  myFile.mv(`${__dirname}/public/${myFile.name}`, function (err) {
      if (err) {
          console.log(err)
          return res.status(500).send({ msg: "Error occured" });
      }
      return res.send({name: myFile.name, path: `/${myFile.name}`});
  });
})

if (!keys.jwtPrivateKey) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined.');
  process.exit(1);
}
let dbUri = keys.dburl;
const connect = (databaseUrl =dbUri) => {
  return mongoose
      .connect(databaseUrl)
      .then(() => console.log('Database connected'))
      .catch(err => console.error('Database connection failed', err));
};
connect();

app.listen(keys.port, () => console.log(`Listening on port ${keys.port}...`));
