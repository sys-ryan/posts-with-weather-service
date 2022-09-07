import * as mysql from 'mysql2';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(__dirname, '..', '.test.env') });

const con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  port: +process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

global.beforeEach(async () => {
  con.connect((err) => {
    if (err) {
      throw err;
    }
    con.query('DELETE FROM posts');
    con.query('DELETE FROM weather');
  });
});
