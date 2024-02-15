import express from "express";
import { getUploads } from "../controllers/uploads.js";

const router = express.Router();

router.route("/").post(getUploads);

export { router as uploadRouter };
