import express from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import router from "./router";

const PORT = 8080;

const app = express();

app.use(cors({
    credentials: true
}));

app.use(compression());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})

const MONGO_URL = "mongodb+srv://admin:admin@cluster0.pgdl21t.mongodb.net/?retryWrites=true&w=majority"

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error', error => console.log("error", error));

app.use('/', router());