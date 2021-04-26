const express = require('express');
const mongoose = require('mongoose');
const { routes } = require('./routes');

const {
  PORT = 3000,
  MONGO_URL = 'mongodb://localhost:27017/mestodb',
} = process.env;

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '6084fd8c7ef7452941ce7275',
  };
  next();
});

app.use(routes);

async function main() {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
  console.log('DB connected');
  await app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
  });
}

main();
