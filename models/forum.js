import Mongoose from "mongoose";

//Defining Schema
const signupSchema = new Mongoose.Schema({
  name: { type: String, required: true, trim: true },
  mnumber: { type: Number, required: true, trim: true },
  email: {type: String, required: true, trim: true, unique: true },
  addr: { type: String, required: true, trim: true },
  dob: { type: Date, required: true, trim: true },
  uname: { type: String, required: true, trim: true, unique: true },
  password: { type: String, required: true, trim: true },
  loginLogs: [{ type: Date, unique: false }],
  dt: { type: Date, default: Date.now },
});

const contSchema = new Mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  comment: { type: String, required: true, trim: true },
  dt: { type: Date, default: Date.now },
});

const catoSchema = new Mongoose.Schema({
  cat_name: { type: String, required: true, trim: true },
  info: { type: String, required: true, trim: true },
  images: { type: String, trim: true },
});

const queSchema = new Mongoose.Schema({
  question_title: { type: String, required: true, trim: true },
  question_body: { type: String, required: true, trim: true },
  question_type: { type: String, required: true, trim: true },
  uname: { type: String, required: true, trim: true },
  views: { type: Number },
  likes: [{ type: Mongoose.Schema.Types.ObjectId, ref: "account", unique: false}],
  dt: { type: Date, default: Date.now },
});

const ansSchema = new Mongoose.Schema({
  answers: { type: String, required: true, trim: true },
  question_id: { type: String, required: true, trim: true },
  posted_by: { type: String, required: true, trim: true },
  dt: { type: Date, default: Date.now },
});

const userSchema = new Mongoose.Schema({
  ip: { type: String, required: true, trim: true },
  post_id: { type: String, required: true, trim: true },
  expire_at: { type: Date, default: Date.now, expires: 3600 },
  // This will Expire after 1 houre
});

const otpSchema = new Mongoose.Schema({
  otp: {type: Number, required: true},
  user: {type:Mongoose.Schema.Types.ObjectId, ref: "account"},
  expire_at: { type: Date, default: Date.now, expires: 300 },
  // Otp will expire in 5 minutes
})

const sch = {
  signup: Mongoose.model("account", signupSchema),
  cont: Mongoose.model("contact", contSchema),
  cato: Mongoose.model("categories", catoSchema),
  ques: Mongoose.model("forum_question", queSchema),
  ans: Mongoose.model("forum_answer", ansSchema),
  user: Mongoose.model("users_ip", userSchema),
  otp: Mongoose.model("otp", otpSchema)
};

export default sch;
