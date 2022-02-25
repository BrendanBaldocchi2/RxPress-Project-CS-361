const express = require('express');
var exphbs = require('express-handlebars')
var bodyParser = require('body-parser');
var fs = require('fs');




var postData = require('./postData.json')
console.log("== postData:", postData)

var port = process.env.PORT || 3000;
var app = express();

app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }))

app.use(express.static('public'));
app.use(bodyParser.json());
app.set("view engine", 'handlebars') 
         


app.get('/', function (req, res, next) {
    res.status(200).render('postPage', {
      posts: postData
    })
});

app.get('/posts/:n', function (req, res, next) {
  var postNum = req.params.n;
  var postNumData = postData[postNum];

  if (postNumData) {
    console.log("  -- postNumData:", postNumData)

    res.status(200).render('singlePost', {
      index: postNumData.index,
      title: postNumData.title,
      minBody: postNumData.minBody,
      body: postNumData.body,
    })
  } else {
    next();
  }
});

app.post('/posts/add', function (req, res, next) {
  console.log("  -- req.body:", req.body)

  var title = req.body.title;
  var body = req.body.body;
  var minBody = req.body.minBody;
  var index = req.body.index;
  console.log("  -- title:", title);
  console.log("  -- body:", body);
  console.log("  -- minBody:", minBody);
  console.log("  -- index:", index);

  if (title && body) {
    postData.push({
      title: title,
      body: body,
      minBody: minBody,
      index: index
    });

    fs.writeFile(
      __dirname + '/postData.json',
      JSON.stringify(postData, null, 2),
      function (err) {
        if (!err) {
          res.status(200).send("Post was successfully added.")
        } else {
          res.status(500).send("Error adding post to DB.")
        }
      }
    )
  } else {
    res.status(400).send("Request body needs `Title` and `Body`.")
  }
});

app.post('/posts/remove', function (req, res, next) {
  console.log("  -- req.body:", req.body)

  var index = req.body.index;
  console.log("  -- index:", index);

  if (index) {
    if (index > -1) {
      postData.splice(index, 1);
    }

    for (let i = 0; i < postData.length; i++) {
      postData[i].index = i;
    }

    fs.writeFile(
      __dirname + '/postData.json',
      JSON.stringify(postData, null, 2),
      function (err) {
        if (!err) {
          res.status(200).send("Post was successfully added.")
        } else {
          res.status(500).send("Error adding post to DB.")
        }
      }
    )
  } else {
    res.status(400).send("Request body needs `Index`.")
  }
});

app.get("*", function (req, res, next) {
  res.status(404).render('404', {})
});

app.listen(port, function (err) {
  if (err) {
    throw err;
  }
  console.log("== Server listening on port", port);
});