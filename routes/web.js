import express from 'express';
const router = express.Router();
import forumController from "../controllers/forumController.js";
router.get('/', forumController.getAllDoc)
router.post('/login', forumController.login)
router.post('/create-acc', forumController.createAcc)
router.post('/checkuname',forumController.check_uname)
router.post('/contact_form',forumController.contactform)
router.get('/logout', forumController.logout)
router.get('/catogories', forumController.catogories)
router.get('/catogories/:cat_name', forumController.one_catogories)
router.post('/catogories/:cat_name', forumController.question_post)
router.get('/forum/question/:id', forumController.forum_answers)
router.post('/post/answers', forumController.post_answers)
router.all('*', forumController.notfound)
export default router;