import express from "express";
import helmet from "helmet";
import morgan  from "morgan";
import cors from "cors";
import dotenv from "dotenv";

import testRouter from "./routes/testRoute.js";
import { sql } from "./config/idb.js";

dotenv.config();

const PORT=process.env.PORT || 3000;

const app = express();

app.use(express.json());


//adding security middleware 
app.use(helmet());
//log https request
app.use(morgan("dev")); 

app.use(cors());


app.get("/",(req,res)=>{
    res.send("hello from backend");
} );


app.use("/api/t",testRouter);


async function idatabase () {
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

idatabase();

app.listen(PORT,()=>{
    console.log("server running on port "+PORT);
});