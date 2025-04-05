import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { Server } from "socket.io";
import conn from "./db/dbconn.js";
import { join } from 'path'
import web from "./routes/web.js";
import session from "express-session";
import MongoStore from "connect-mongo";
const app = express();
import http from 'http';
import { chatCode } from "./controllers/chatControllers.js";
import path from 'path';
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

chatCode(io);
const port = process.env.PORT || "3000";
const DATABASE_URL = process.env.DATABASE_URL_ONLINE;

// database connection
conn(DATABASE_URL);

app.use(express.urlencoded({ extended: false }))
app.use(express.json());

//static files
app.use('/static', express.static(path.join(process.cwd(), 'public')));

//set template engine
app.set("views", join(process.cwd(), "views"));
app.set("view engine", "ejs");

// Mongodb Session
const sessionStorage = MongoStore.create({
  mongoUrl: DATABASE_URL,
  dbName: 'forums',
  collectionName: 'sessions',
  ttl: 18000,
  autoRemove: 'native',
})

// Session
app.use(session({
  name: 'forumsession',
  secret: 'iamkey',
  resave: false,
  saveUninitialized: true,
  store: sessionStorage,
}))

// Load Routes
app.use("/", web)

server.listen(port, () => console.log(`server listening at http://127.0.0.1:${port}`));
