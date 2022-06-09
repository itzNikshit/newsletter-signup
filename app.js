const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/",function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req,res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const mail = req.body.mail;

  const data = {
    members: [
      {
        email_address: mail,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  }

  const jsonData = JSON.stringify(data);
  const url = "https://us14.api.mailchimp.com/3.0/lists/4dfa9ab1df";
  const options = {
    method: "POST",
    auth: "nikshit:fc04f248518c356789f6f4e1ef56ff28-us14"
  }

  const request = https.request(url, options, function(ans) {
    if(ans.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    // ans.on("data", function(data) {
    //   console.log(JSON.parse(data));
    // });
  });

  request.write(jsonData);
  request.end();
  // console.log(jsonData);
  // console.log(firstName);
  // console.log(lastName);
  // console.log(mail);
});

app.post("/failure", function(req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is listening on port 3000.");
});

// api key
// fc04f248518c356789f6f4e1ef56ff28-us14

// list id
// 4dfa9ab1df

/*
  process to deploy the server on heroku
  a) change listen server from 3000 to process.env.PORT so that heroku can dynamically get a port for us
  b) next make a file named "Procfile" and edit it using atom
  c) in the file, type = "web: node app.js"
  d) next in command line, login to heroku using command "heroku login"
  e) after login initialize git using "git init"
  f) after that, create new git repository using "git add ."
  g) after this, use git commit -m "custom message here" to commit the changes to the repository
  h) now create a new app using "heroku create" command which will make a new url for your app
  i) but this will not have any content as we havent pushed the local files to their servers
  j) so, use command git push heroku master, this will upload local files to heroku servers
  k) this will deploy our app on heroku servers, we got the link
*/
