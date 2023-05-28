import dotenv from "dotenv";
dotenv.config();
import sch from "../models/forum.js";
import bcrypt from "bcrypt";
import moment from "moment";
import js_functions from "../public/js/js_functions.js";

class forumController {
  // contact form start
  static contactform = async (req, res) => {
    try {
      const { cname, cemail, ccomment } = req.body;
      const doc = new sch.cont({
        name: js_functions.replace_special_chars(cname),
        email: js_functions.replace_special_chars(cemail),
        comment: js_functions.replace_special_chars(ccomment),
      });
      const result = await doc.save();
      //res.status(201).redirect(current_page);
      res.status(201).send(true);
    } catch (err) {
      res.status(404).send("Something went to Wrong");
    }
  };
  // contact form end

  //login start here
  static login = async (req, res) => {
    try {
      const { luname, lpass, current_page } = req.body;
      const result = await sch.signup.findOne({ uname: luname });
      if (result != null) {
        const ismatch = await bcrypt.compare(lpass, result.password);
        if (result.uname == luname && ismatch) {
          const questionCount = await sch.ques.find({ uname: luname }).count();
          const answerContributions = await sch.ans
            .find({ posted_by: luname })
            .count();
          req.session.login = true;
          req.session.uname = luname;
          req.session.uid = result._id.toString();
          req.session.tinyApiKey = process.env.TINYMCE_API_KEY;
          req.session.name = result.name;
          req.session.address = result.addr;
          req.session.contributions = {
            questions: questionCount,
            answers: answerContributions,
          };
          res.redirect(current_page);
        } else {
          res.send("Invalid credentials");
        }
      } else {
        res.send("Username not found");
      }
    } catch (err) {
      res.status(404).send("Something went to Wrong");
    }
  };
  //login end here

  //Signup form start here
  static createAcc = async (req, res, next) => {
    try {
      const { sname, smnumber, saddr, sdob, suname, spassword, current_page } =
        req.body;
      const hashpwd = await bcrypt.hash(spassword, 10);
      const doc = new sch.signup({
        name: js_functions.replace_special_chars(sname),
        mnumber: smnumber,
        addr: js_functions.replace_special_chars(saddr),
        dob: sdob,
        uname: js_functions.replace_special_chars(suname),
        password: hashpwd,
      });
      const result = await doc.save();
      res.redirect(current_page);
    } catch (err) {
      console.log(err);
    }
    //Signup form end here
  };

  static logout = (req, res) => {
    req.session.destroy();
    res.redirect("/");
  };

  //Signup form data fetch start here
  static getAllDoc = async (req, res) => {
    try {
      const forum_questions = await sch.ques
        .find()
        .sort({ likes: -1, views: -1 })
        .limit(5)
        .populate({ path: "likes", select: "uname -_id" });
      const catogories = await sch.cato.find();
      res.render("index", {
        forum_questions: forum_questions,
        current: req.url,
        session: req.session,
        catogories: catogories,
        moment,
        title: "Forum | Home",
      });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  };
  //Signup form data fetch start here

  static search = async (req, res) => {
    try {
      const searchQuery = req.params.searchTxt;
      const catogories = await sch.cato.find();
      const serachResult = await sch.ques
        .find({
          $or: [
            { question_title: { $regex: searchQuery, $options: "i" } },
            { question_body: { $regex: `.*${searchQuery}.*`, $options: "i" } },
          ],
        })
        .populate({ path: "likes", select: "uname -_id" });
      res.render("search", {
        current: req.url,
        session: req.session,
        catogories: catogories,
        moment,
        serachResult,
        title: "Forum | Search",
      });
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  };

  //catogories page start here all catogories
  static catogories = async (req, res) => {
    let obj = [];
    try {
      const catogories = await sch.cato.find();
      for (let i = 0; i < catogories.length; i++) {
        let cat = catogories[i].cat_name;
        let no_of_questions = await sch.ques
          .find({ question_type: catogories[i].cat_name })
          .count();
        obj.push(no_of_questions);
      }
      res.render("catogories", {
        current: req.url,
        session: req.session,
        catogories: catogories,
        all: true,
        no_of_questions: obj,
        title: `Forum | All Categories`,
      });
    } catch (error) {
      res.status(500).send("Something went to Wrong");
    }
  };
  //all catogories end here

  //single catogory start here
  static one_catogories = async (req, res) => {
    try {
      const catogories = await sch.cato.find();
      const forum_questions = await sch.ques
        .find({
          question_type: req.params.cat_name,
        })
        .populate({ path: "likes", select: "uname -_id" });
      res.render("catogories", {
        current: req.url,
        session: req.session,
        catogories: catogories,
        cat_name: req.params.cat_name,
        all: false,
        forum_questions,
        moment,
        title: `Category | ${req.params.cat_name}`,
      });
    } catch (err) {
      res.status(500).send("Something went to Wrong");
    }
  };

  //Question post
  static question_post = async (req, res) => {
    try {
      const { question_title, question_type, question_body } = req.body;
      const doc = new sch.ques({
        question_title: js_functions.replace_special_chars(question_title),
        question_body: js_functions.removeScriptTags(question_body),
        question_type: question_type,
        uname: req.session.uname,
        views: 0,
      });
      const result = await doc.save();
      res.redirect(req.url);
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went to Wrong");
    }
  };

  static check_uname = async (req, res) => {
    try {
      let Username = req.body.username;
      const result = await sch.signup.findOne({ uname: Username });
      let found = false;
      if (result == null) {
        found = false;
      } else {
        found = true;
      }
      res.send(found);
    } catch (err) {
      res.send(err);
    }
  };

  static forum_answers = async (req, res) => {
    try {
      const catogories = await sch.cato.find();
      const answers = await sch.ans.find({ question_id: req.params.id });
      const main_question = await sch.ques
        .findOne({ _id: req.params.id })
        .populate({ path: "likes", select: "uname -_id" });
      res.render("answers", {
        current: req.url,
        session: req.session,
        catogories: catogories,
        main_question: main_question,
        id: req.params.id,
        moment,
        answers,
        title: `Answers | ${main_question.question_title}`,
      });
      //start
      let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const check_user_view = await sch.user.findOne({
        ip: ip,
        post_id: req.params.id,
      });
      if (check_user_view == null) {
        await sch.ques.updateOne(
          { _id: req.params.id },
          { $inc: { views: 1 } }
        );
        const doc = new sch.user({ ip, post_id: req.params.id });
        const result = await doc.save();
      }
      //end
    } catch (error) {
      res.status(500).send("Something went to Wrong");
    }
  };

  static manageLikes = async (req, res) => {
    try {
      const uid = req.session.uid;
      const Question = await sch.ques.findById(req.query.questionId);
      const total = Question.likes.length;
      if (Question.likes.includes(uid)) {
        const likesRemove = await sch.ques.findByIdAndUpdate(
          req.query.questionId,
          { $pull: { likes: uid } },
          { new: true }
        );
        if (likesRemove) {
          res.status(200).send({ Operation: "Like", Count: total - 1 });
        }
      } else {
        const likesAdd = await sch.ques.findByIdAndUpdate(
          req.query.questionId,
          { $push: { likes: uid } },
          { new: true }
        );
        if (likesAdd) {
          res.status(200).send({ Operation: "Liked", Count: total + 1 });
        }
      }
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  };

  static post_answers = async (req, res) => {
    try {
      const { answers, current_page, id } = req.body;
      const doc = new sch.ans({
        answers: js_functions.removeScriptTags(answers),
        question_id: id,
        posted_by: req.session.uname,
      });
      await doc.save();
      res.redirect(current_page);
    } catch (err) {
      res.status(500).send("Something went to Wrong");
    }
  };

  static notfound = async (req, res) => {
    res.status(404).send("Page Not Found");
  };

  static deleteQuestion = async (req, res) => {
    try {
      const { qid, uname } = req.query;
      await sch.ques.findByIdAndDelete(qid);
      await sch.ans.deleteMany({ question_id: qid });
      res.send({ responce: "True" });
    } catch (err) {
      res.status(500);
    }
  };
}

export default forumController;
