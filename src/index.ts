import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import router from "./router";


const PORT = 8080;

const app = express();

app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

app.use("/", router());
