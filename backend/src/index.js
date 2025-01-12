import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import userRouter from "./routes/userRoutes.js";
import itemRouter from "./routes/itemRoutes.js";

dotenv.config("./.env");

const PORT = process.env.PORT || 4000;

const app = express();

app.use(cors());
app.use(bodyParser.json());


//routes
app.use("/api/user", userRouter);
app.use("/api/item", itemRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
