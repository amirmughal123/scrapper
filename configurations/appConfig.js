const database = 'mongodb+srv://learning:learning@learning-cllcx.mongodb.net/test?retryWrites=true&w=majority';
const port = process.env.PORT || 4000;
const statusCodes = {
  INTERNAL_SERVER_ERROR: 500,
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  UNAUTHORIZED: 401
};

export default {
  database,
  port,
  statusCodes
 };
