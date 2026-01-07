const express = require('express');
const path = require('path');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false
}));

// EJS + Layouts
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// ให้ทุกหน้าเข้าถึงตัวแปร admin
app.use((req, res, next) => {
  res.locals.admin = req.session.admin || null;
  next();
});

app.get('/privacy-policy', (req, res) => {
    res.render('privacy', {
        siteName: 'jav789vk.zyx'
    });
});

// About Us
app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Us',
    admin: req.session?.admin || false
  });
});

// Contact
app.get('/contact', (req, res) => {
  res.render('contact', {
    title: 'Contact Us',
    admin: req.session?.admin || false
  });
});

// Privacy Policy
app.get('/privacy', (req, res) => {
  res.render('privacy', {
    title: 'Privacy Policy',
    siteName: 'My Blog',
    admin: req.session?.admin || false
  });
});


// Routes
app.use('/', require('./routes/home'));
app.use('/admin', require('./routes/admin'));

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running: http://localhost:${PORT}`));
