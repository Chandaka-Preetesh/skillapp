import express from "express";
import { testFunction } from "../controlers/testControlers.js";
const router=express.Router();

router.get("/test",testFunction);

export default router;