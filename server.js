const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const helmet = require('helmet');
const router = require('./routes/routes');
const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner');
require('dotenv').config();

const app = express();

app.use(helmet());

app.use(helmet.frameguard({ action: 'sameorigin' }));
app.use(helmet.referrerPolicy({ policy: 'same-origin' }));

app.use(cors({ origin: '*' })); // For FCC testing purposes only

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// setting up the static folder
app.use(express.static(path.join(__dirname, 'public')));

// pointing to the view folder
app.set('views', path.join(__dirname, 'views'));

// render engine
app.set('view engine', 'ejs');

// For FCC testing purposes
fccTestingRoutes(app);

// Routing for the application
app.use('/', router);

// 404 Not Found Middleware
app.use(function(req, res, next) {
  res
    .status(404)
    .type('text')
    .send('Not Found');
});

// Start our server and tests!
app.listen(process.env.PORT || 3000, function() {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
  console.log('Database Connected');
  console.log(`Listening on port ${process.env.PORT}`);
  if (process.env.NODE_ENV === 'test') {
    console.log('Running Tests...');
    setTimeout(function() {
      try {
        runner.run();
      } catch (e) {
        const error = e;
        console.log('Tests are not valid:');
        console.log(error);
      }
    }, 1500);
  }
});

module.exports = app; // for testing
