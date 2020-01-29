import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';

// PORT AND DB STRING
import appConfig from './configurations/appConfig';
import alerts from './configurations/alerts';

const { database, port, statusCodes } = appConfig;
const { errors } = alerts;

const app = express();
app.use(cors());

// const bodyParser = {
//   json: {limit: '50mb', extended: true},
//   urlencoded: {limit: '50mb', extended: true}
// };
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(database, { useNewUrlParser: true, useCreateIndex: true });

var db = mongoose.connection;
// connection test
db.on('error', console.error.bind(console, ' ***** connection error ***** '));
db.once('open', function () {
  console.log(" ***** Learning Database Connected ***** ");
});

// *** ERROR HANDLER ***
const errorHandler = () => {
  // global error handler
  app.use((error, req, res, next) => {
    // set status code and message for sending error response to user
    let status = error.status || statusCodes.INTERNAL_SERVER_ERROR;
    let message = error.original ? error.original.sqlMessage : error.message ? error.message
      : errors.UNEXPECTED_ERROR;

    // send error response with appropriate error status code and message
    res.status(status).send(message);
  });
}

// *** Routes ***
import hotelRoutes from './routes/hotelRoutes';
// --------------------
const routing = () => {
  app.use('/api/v1/hotels', hotelRoutes);
}

routing()

app.get('*', (req, res, next) => {
  return res.send('*** SERVER WORKING ***');
})

errorHandler();

app.listen(port, () => {
  console.log(` ***** server using PORT ${port} ***** `);
});
