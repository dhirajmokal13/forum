import express from "express";
import conn from "./db/dbconn.js";
import {join} from 'path'
import web from "./routes/web.js";
import session from "express-session";
import MongoStore from "connect-mongo";
const app = express();
const port = process.env.PORT || "3000";
const DATABASE_URL = "mongodb+srv://dhirajmokal13:Dhiraj123@cluster0.rae84.mongodb.net/forums?retryWrites=true&w=majority";

// database connection
conn(DATABASE_URL);

app.use(express.urlencoded({extended:false}))

//static files
app.use('/',express.static(join(process.cwd(),"public")));

//set template engine
app.set("view engine","ejs");

// Mongodb Session
const sessionStorage = MongoStore.create({
  mongoUrl: DATABASE_URL,
  dbName: 'forum',
  collectionName: 'sessions',
  ttl: 18000,
  autoRemove: 'native',
})

// Session
app.use(session({
  name: 'forumsession',
  secret:'iamkey',
  resave:false,
  saveUninitialized:true,
  //cookie:{maxAge:10000}
  store: sessionStorage,
}))

// Load Routes
app.use("/",web)
//app.use("/catogories",web)

app.listen(port, () => {
  console.log(`server listening at http://localhost:${port}`);
});
