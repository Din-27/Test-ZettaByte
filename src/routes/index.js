const express = require('express')
const { auth } = require('../middlewars/auth')
const { register, login, getUsers, getUser } = require('../controllers/user')
const { addArticle, updateArticle, deleteArticle, getArticles, getArticle, findAll, findAllPublished } = require('../controllers/article')
const { addComment, updateComment, deleteComment, getComments, getComment } = require('../controllers/comment')
const router = express.Router()

router.post('/sign-up', register)
router.post('/sign-in', login)
router.get('/get-users', getUsers)
router.get('/get-user/:id', getUser)

router.get('/', findAll)
router.get('/published', findAllPublished)

router.post('/add-article', auth, addArticle)
router.patch('/update-article/:id', auth, updateArticle)
router.delete('/delete-article/:id', auth, deleteArticle)
router.get('/get-articles', getArticles)
router.get('/get-article/:id', getArticle)

router.post('/add-comment', auth, addComment)
router.patch('/update-comment/:id', auth, updateComment)
router.delete('/delete-comment/:id', auth, deleteComment)
router.get('/get-comments', getComments)
router.get('/get-comment/:id', getComment)

module.exports = router