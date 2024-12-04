const express = require('express');
const { addLike, removeLike, getLikeCount } = require('../controllers/likeController');
const router = express.Router();

router.post('/addlike', addLike);
router.delete('/deletelike', removeLike);
router.get('/likeCount/:postId', getLikeCount);


module.exports = router;
