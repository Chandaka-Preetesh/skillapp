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
        CREATE TABLE  IF NOT EXISTS cources2 (
        courceid SERIAL PRIMARY KEY,
        title varchar(60),
        description TEXT,
        price NUMERIC (10,2),
        duration varchar(40),
        createdAt TIMESTAMP DEFAULT NOW(),
        userid INTEGER  REFERENCES users2(userid) ON DELETE CASCADE
    )   
    `
    await sql`
  CREATE TABLE IF NOT EXISTS cource_post_details2 (
    courseid INTEGER REFERENCES cources(courceid) ON DELETE CASCADE,
    userid INTEGER REFERENCES users2(userid) ON DELETE CASCADE,
    isLike BOOLEAN DEFAULT false,
    isRated INTEGER DEFAULT 0,
    lastUpdated TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (courseid, userid)
  )
`



console.log("database intialised");
    }
    catch (error) {
        console.log("unable to intialise",error);
    }
}

