import mysql from 'mysql2/promise';
import DatabaseConstants from './Constants/DatabaseConstants.js';

const dbConfig = {
  host: DatabaseConstants.host,
  user: DatabaseConstants.user,
  password: DatabaseConstants.password,
  database: DatabaseConstants.database,
};

const db = mysql.createPool(dbConfig);

db.getConnection()
  .then(() => {
    console.log('MySQL Database connected!!!');
  })
  .catch((err) => {
    console.error('MySQL Database connection failed: ', err);
    throw err;
  });
  
export default db;