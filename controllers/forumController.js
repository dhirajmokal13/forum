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
      console.log(err);
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
          req.session.login = true;
          req.session.uname = luname;
          res.redirect(current_page);
        } else {
          res.send("Invalid credentials");
        }
      } else {
        res.send("Username not found");
      }
    } catch (err) {
      console.log(err);
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
    res.send("hi")
    try {
      const forum_questions = await sch.ques.find().sort({ views: -1 }).limit(5);
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
      res.send(error);
    }
  };
  //Signup form data fetch start here

  //catogories page start here all catogories
  static catogories = async (req, res) => {
    try {
      const catogories = await sch.cato.find();
      catogories.forEach(async (it) => {
        let ques = await sch.ques.find({ question_type: it.cat_name }).count();
        //console.log(acc[0].name)
        let name = it._id;
        //console.log(name)
        //let no_of_quest = { name: ques };
      });
      res.render("catogories", {
        current: req.url,
        session: req.session,
        catogories: catogories,
        all: true,
        title: `Forum | All Categories`,
      });
    } catch (error) {
      console.log(error);
    }
  };
  //all catogories end here

  //single catogory start here
  static one_catogories = async (req, res) => {
    try {
      const catogories = await sch.cato.find();
      const forum_questions = await sch.ques.find({
        question_type: req.params.cat_name,
      });
      res.render("catogories", {
        current: req.url,
        session: req.session,
        catogories: catogories,
        cat_name: req.params.cat_name,
        all: false,
        forum_questions,
        moment,
        title: `Category | ${req.params.cat_name}`
      });
    } catch (err) {
      console.log(err);
    }
  };

  //Question post
  static question_post = async (req, res) => {
    try {
      const { question_title, question_type, question_body } = req.body;
      const doc = new sch.ques({
        question_title: js_functions.replace_special_chars(question_title),
        question_body: js_functions.replace_special_chars(question_body),
        question_type: question_type,
        uname: req.session.uname,
        views: 0,
        likes: 0,
      });
      const result = await doc.save();
      res.redirect(req.url);
    } catch (err) {
      console.log(err);
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
      const main_question = await sch.ques.findOne({ _id: req.params.id });
      res.render("answers", {
        current: req.url,
        session: req.session,
        catogories: catogories,
        main_question: main_question,
        id: req.params.id,
        moment,
        answers,
        title: `Answers | ${main_question.question_title}`
      });
      await sch.ques.updateOne({ _id: req.params.id }, { $inc: { views: 1 } });
    } catch (error) {
      console.log(error);
    }
  };

  static post_answers = async (req, res) => {
    try {
      const { answers, current_page, id } = req.body;
      const doc = new sch.ans({
        answers: js_functions.replace_special_chars(answers),
        question_id: id,
        posted_by: req.session.uname,
      });
      await doc.save();
      res.redirect(current_page);
    } catch (err) {
      console.log(err);
    }
  };
  static notfound = async (req, res) => {
    res.status(404).send("Page Not Found");
  };
}

export default forumController;
