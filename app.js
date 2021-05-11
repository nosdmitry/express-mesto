const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const { routes } = require('./routes');

const {
  PORT = 3000,
  MONGO_URL = 'mongodb://localhost:27017/mestodb',
} = process.env;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const app = express();

app.use(helmet());
app.use(limiter);
app.use(cookieParser());
app.disable('x-powered-by');
app.use(express.json());
// app.use((req, res, next) => {
//   req.user = {
//     _id: '6084fd8c7ef7452941ce7275',
//   };
//   next();
// });

app.use(routes);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
});

async function main() {
  try {
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
  } catch (err) {
    console.log(`Connection error, ${err}`);
  }
}

main();
