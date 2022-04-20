const express = require("express");
const bodyParser = require("body-parser");
const { redirect } = require("express/lib/response");
const mongoClient = require("mongodb").MongoClient;
var ObjectID = require("mongodb").ObjectID;

const app = express();
var collection;
app.use(express.static(__dirname + "/views/Public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
dbname = "todolistDB";
mongoClient.connect(
  "mongodb+srv://nileshunique:21021998@cluster0.a6801.mongodb.net/" +
    dbname +
    "?retryWrites=true&w=majority",
  (err, client) => {
    let db = client.db(dbname);
    collection = db.collection("lists");
  }
);

app.get("/", (req, res) => {
  // res.send("hi");
  collection.find().toArray((err, data) => {
    if (err) throw err;
    res.render("index", { today: "Today", list: data });
  });
});

app.post("/", (req, res) => {
  // console.log(req.body);
  if (req.body.toDo != "") {
    collection.insertOne(req.body, (err, result) => {
      if (err) throw err;
    });
    // newItem.push(req.body.toDo);
  }
  res.redirect("/");
  // console.log(newItem);
});

app.post("/delete", (req, res) => {
  // console.log(req.body.delete, req.body.done);
  if (req.body.delete != undefined) {
    collection.deleteOne({ _id: ObjectID(req.body.delete) }, (err, result) => {
      if (err) throw err;
      res.redirect("/");
    });
  } else if (req.body.done != undefined) {
    // console.log(req.body.done);
    collection.find({ _id: ObjectID(req.body.done) }).toArray((err, data) => {
      if (err) throw err;
      // console.log(data);
      if (data[0].class == "done") {
        collection.updateOne(
          { _id: ObjectID(req.body.done) },
          { $unset: { class: "done" } },
          (err, result) => {
            if (err) throw err;
            // console.log(result);
            res.redirect("/");
          }
        );
      } else {
        collection.updateOne(
          { _id: ObjectID(req.body.done) },
          { $set: { class: "done" } },
          (err, result) => {
            if (err) throw err;
            // console.log(result);
            res.redirect("/");
          }
        );
      }
    });
  }
});
app.listen(process.env.PORT || 3000);
