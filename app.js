const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog');

//express app
const app = express();

//connect to mongodb
const dbURI = 'mongodb+srv://naor:naor1234@cluster0.2wh2b.mongodb.net/node-tuts?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));


//register view engine
app.set('view engine', 'ejs');

//middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

/*
//mongoose and mongo sanbox routes

//add new blog
app.get('/add-blog', (req, res) => {
    const blog = new Blog({
        title: 'new blog2',
        snippet: 'about my new blog',
        body: 'more about my blog'
    });

    blog.save()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        });
});
//find all blog
app.get('/all-blogs', (req, res) => {
    Blog.find()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        });
});
//find singel blog by his id
app.get('/singel-blog', (req, res) => {
    Blog.findById("5ff5f8c8dfaa7b0c44646f49")
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        });
});
*/

//routes
app.get('/', (req, res) => {
    res.redirect('/blogs');
});
app.get('/about', (req, res) => {
    //res.send('<p> about page</p>');
    //res.sendFile('./views/about.html',{root: __dirname})
    res.render('about', { title: "About" });
});



//blog routes
app.get('/blogs', (req, res) => {
    Blog.find().sort({ createdAt: -1 })
        .then((result) => {
            res.render('index', { title: 'All Blogs', blogs: result });
        })
        .catch((err) => {
            console.log(err);
        });
});
app.post('/blogs', (req, res) => {
    const blog = new Blog(req.body);
    blog.save()
        .then((result) => {
            res.redirect('/blogs');
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get('/blogs/create', (req, res) => {
    res.render('create', { title: "Crate new blog" });
});



//404 page
app.use((req, res) => {
    //res.status(404).sendFile('./views/404.html',{root: __dirname});
    res.status(404).render('404', { title: "404" });
});