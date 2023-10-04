import {Pool} from 'pg';

let conn;

if (!conn) {
  conn = new Pool({
    user: process.env.REACT_APP_DB_USER,
    password: process.env.REACT_APP_DB_PASSWORD,
    host: process.env.REACT_APP_DB_HOST,
    port: 5432,
    database: REACT_APP_DATABASE,
  });
}

export { conn };