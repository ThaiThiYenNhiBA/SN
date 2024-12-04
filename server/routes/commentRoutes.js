const express = require('express');
const { addComment, getComments } = require('../controllers/commentController');
const router = express.Router();

router.post('/comment', addComment);
router.get('/comments/:postId', getComments);

module.exports = router;
