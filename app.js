//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
// mongoose.set('useFindAndModify', false);

const homeContent = "You are a ukulele beyond my microphone. You are a Yukon beyond my Micronesia. You are a union beyond my meiosis. You are a eureka beyond my maitai. You are a Yuletide beyond my minesweeper.You are a euphemism beyond my myna bird."
const aboutContent = "Hi! I am Daisy. Welcome to my Blog. I love to post my thoughts."
const contactContent = "Hi there, Here is Daisy. 😊 You can find me via below methods. Looking forward to eeting you."

const app = express();
dotenv.config();
// view engine setup
app.set("view engine", "ejs");
// body-parser to parse the post data to req.body
app.use(bodyParser.urlencoded({ extended: true }));
// setup public folder for static files
app.use(express.static("public"));

mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

// Post Schema
const postSchema = {
  title: String,
  content: String,
};
// define Post collection
const Post = mongoose.model("Post", postSchema);

app.get("/", function (req, res) {
  // find all the posts in the posts collection and render that in the home.ejs file
  Post.find({}, function (err, posts) {
    res.render("home", {
      homeContent: homeContent,
      posts: posts,
    });
  });
});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  });
  post.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

// Use post ID to find the post
app.get("/posts/:postId", function (req, res) {
  const requestedPostId = req.params.postId;
  Post.findById({ _id: requestedPostId }, function (err, post) {
    if (!err) {
      res.render("post", {
        title: post.title,
        content: post.content,
      });
    } else {
      res.send(err);
    }
  });
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});
