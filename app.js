//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

// mongoose node connection string
mongoose.connect("mongodb://127.0.0.1:27017/WikiDB", { useNewUrlparser: true });

// mongoose schema
const articleSchema = {
  title: "string",
  content: "string",
};

// mongoose model
const Article = mongoose.model("Article", articleSchema);

// chained requests targeting all articles

app
  .route("/articles")
  .get(function (req, res) {
    Article.find()
      .then(function (foundArticles) {
        res.send(foundArticles);
      })
      .catch(function (err) {
        res.send(err);
      });
  })
  .post(function (req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    newArticle
      .save()
      .then(function (newArticle) {
        res.send("Successfully added a new articles.");
      })
      .catch(function (err) {
        res.send(err);
      });
  })
  .delete(function (req, res) {
    Article.deleteMany()
      .then(function () {
        res.send("Successfully deleted all articles.");
      })
      .catch(function (err) {
        res.send(err);
      });
  });

//   chained request a specific article with express routing
app
  .route("/articles/:articleTitle")
  .get(function (req, res) {
    Article.findOne({ title: req.params.articleTitle })
      .then(function (foundArticle) {
        res.send(foundArticle);
      })
      .catch(function (err) {
        res.send("There was no article with that title found.");
      });
  })
  .put(function (req, res) {
    Article.findOneAndUpdate(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true }
    )
      .then(function (updatedArticle) {
        if (updatedArticle) {
          res.send("You have successfully updated your article");
        } else {
          res.send("There was no article with that title found.");
        }
      })
      .catch(function (err) {
        res.send("An error occurred while updating the article.");
      });
  })
  .patch(function (req, res) {
    Article.findOneAndUpdate(
      { title: req.params.articleTitle },
      { $set: req.body }
    )
      .then(function (updatedArticle) {
        if (updatedArticle) {
          res.send("You have successfully updated your title");
        } else {
          res.send("not updated.");
        }
      })
      .catch(function (err) {
        res.send("An error occurred while updating the article.");
      });
  })
  .delete(function (req, res) {
    Article.deleteOne({ title: req.params.articleTitle })
      .then(function () {
        res.send("Successfully deleted article.");
      })
      .catch(function (err) {
        res.send(err);
      });
  });

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
