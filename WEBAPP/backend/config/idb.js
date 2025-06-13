import {neon} from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();

const {PGHOST,PGDATABASE,PGUSER,PGPASSWORD}=process.env;

//create connection using environamental varibles
export const sql=neon (
    `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}`
);


export async function idatabase () {
    try {
        await sql `
        CREATE TABLE  IF NOT EXISTS courses2 (
        courseid SERIAL PRIMARY KEY,
        title varchar(60),
        description TEXT,
        price NUMERIC (10,2),
        duration varchar(40),
        type varchar (40),
        createdAt TIMESTAMP DEFAULT NOW(),
        userid INTEGER  REFERENCES users2(userid) ON DELETE CASCADE
    )   
    `
    await sql`
  CREATE TABLE IF NOT EXISTS recent_activity2 (
     id SERIAL PRIMARY KEY,
    userid INTEGER REFERENCES users2(userid) ON DELETE CASCADE,
    type VARCHAR(60),
    activity VARCHAR(200),
    time TIMESTAMP DEFAULT NOW()
  );
`
 await sql`
  CREATE TABLE IF NOT EXISTS skillcoin2 (
    userid INTEGER PRIMARY KEY REFERENCES users2(userid) ON DELETE CASCADE,
     balance NUMERIC(10,2),
    lastupdate TIMESTAMP DEFAULT NOW()
  );
`;

await sql`CREATE TABLE IF NOT EXISTS topics2 (
topicid SERIAL,
topic_name varchar(60)
)`

await sql `CREATE TABLE IF NOT EXISTS course_purchases2 (
id serial,
userid INTEGER  REFERENCES users2(userid) ON DELETE CASCADE,
courseid INTEGER  REFERENCES courses2(courseid) ON DELETE CASCADE,
PRIMARY KEY (userid,courseid),
purchase_date TIMESTAMP DEFAULT NOW()
) `

await sql `CREATE TABLE IF NOT EXISTS course_post_details2 (
      userid INTEGER  REFERENCES users2(userid) ON DELETE CASCADE,
    courseid INTEGER  REFERENCES courses2(courseid) ON DELETE CASCADE,
    PRIMARY KEY (userid,courseid),
    is_liked BOOLEAN DEFAULT FALSE,
    rating  INTEGER DEFAULT 0
) `

    await sql `CREATE TABLE IF NOT EXISTS doubts2 (
  doubtid SERIAL PRIMARY KEY,
  title varchar(60),
  question TEXT,
  topic varchar(60),
  createdAt TIMESTAMP DEFAULT NOW(),
  userid INTEGER  REFERENCES users2(userid) ON DELETE CASCADE
)`;

    await sql`CREATE TABLE IF NOT EXISTS doubt_replies2 (
  doubt_replies_id SERIAL PRIMARY KEY,
  doubtid INTEGER REFERENCES doubts2(doubtid) ON DELETE CASCADE,
  reply TEXT ,
  userid INTEGER  REFERENCES users2(userid) ON DELETE CASCADE,
  createdAt TIMESTAMP DEFAULT NOW()
);`

console.log("database intialised");
    }
    catch (error) {
        console.log("unable to intialise",error);
    }
}

