const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();
const db = new sqlite3.Database('./db.sqlite');

// Home
router.get('/', (req, res) => {
  db.all('SELECT * FROM posts ORDER BY id DESC', [], (err, posts) => {
    res.render('index', { posts, title: 'Home' });
  });
});

// Single Post
router.get('/post/:slug', (req, res) => {
  db.get('SELECT * FROM posts WHERE slug=?', [req.params.slug], (err, post) => {
    if (!post) return res.send('Post not found');
    res.render('post', { post, title: post.title });
  });
});

// Privacy
router.get('/privacy', (req, res) => res.render('privacy', { title: 'Privacy Policy' }));

module.exports = router;
