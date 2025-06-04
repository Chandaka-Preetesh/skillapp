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
        CREATE TABLE  IF NOT EXISTS t2 (
        id SERIAL,
        sc NUMERIC(10,2)
    )   
       `
    }
    catch (error) {
        console.log("unable to intialise",error);
    }
}

idatabase();

app.listen(PORT,()=>{
    console.log("server running on port "+PORT);
});