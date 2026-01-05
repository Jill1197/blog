const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const router = express.Router();
const db = new sqlite3.Database('./db.sqlite');

function requireLogin(req, res, next) {
  if (!req.session.admin) return res.redirect('/admin/login');
  next();
}

// Login
router.get('/login', (req, res) => res.render('admin/login', { title: 'Admin Login' }));
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM admins WHERE username=?', [username], (err, admin) => {
    if (admin && bcrypt.compareSync(password, admin.password)) {
      req.session.admin = admin.username;
      return res.redirect('/admin');
    }
    res.redirect('/admin/login');
  });
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/admin/login'));
});

// List posts
router.get('/', requireLogin, (req, res) => {
  db.all('SELECT * FROM posts ORDER BY id DESC', [], (err, posts) => {
    res.render('admin/list', { posts, title: 'Manage Posts' });
  });
});

// Create
router.get('/create', requireLogin, (req, res) => res.render('admin/create', { title: 'Create Post' }));
router.post('/create', requireLogin, (req, res) => {
  const { title, content, image_url } = req.body;
  const slug = title.toLowerCase().trim().replace(/[^\w\s-]/g,'').replace(/\s+/g,'-');
  db.run(
    'INSERT INTO posts (title, slug, content, image_url) VALUES (?, ?, ?, ?)',
    [title, slug, content, image_url || null],
    function(err) {
      if(err) return console.error(err.message);
      res.redirect('/admin');
    }
  );
});

// Edit
router.get('/edit/:id', requireLogin, (req, res) => {
  db.get('SELECT * FROM posts WHERE id=?', [req.params.id], (err, post) => {
    res.render('admin/edit', { post, title: 'Edit Post' });
  });
});
router.post('/edit/:id', requireLogin, (req, res) => {
  const { title, content, image_url } = req.body;
  db.run(
    'UPDATE posts SET title=?, content=?, image_url=? WHERE id=?',
    [title, content, image_url || null, req.params.id],
    function(err) {
      if(err) return console.error(err.message);
      res.redirect('/admin');
    }
  );
});

// Delete
router.get('/delete/:id', requireLogin, (req, res) => {
  db.run('DELETE FROM posts WHERE id=?', [req.params.id], function(err){
    if(err) return console.error(err.message);
    res.redirect('/admin');
  });
});

module.exports = router;
