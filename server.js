const exp = require("express");
const app = exp();
const mclient = require("mongodb").MongoClient;

let cors = require("cors");
let expressAsyncHandler = require("express-async-handler");

app.use(exp.json());

app.use(cors(
    {
        origin:'*'
    }
)); // Added () to invoke cors function

require("dotenv").config(); // Added dotenv configuration

// dealing with page reference we use path and below code
// app.use(exp.static(path.join(__dirname,'./build')))

let DBurl = process.env.DBurl;

mclient
  .connect(DBurl)
  .then((client) => {
    let dbObj = client.db("srikar");
    let messages = dbObj.collection("messages");
    app.set("messages", messages);
    console.log("success");
  })
  .catch((err) => {
    console.log("error in DB connection ", err);
  });

app.post(
  "/submit",
  expressAsyncHandler(async (request, response) => {
    console.log("sri");
    let data = request.body;
    let messages = request.app.get("messages");
    await messages.insertOne(data, () => {
      response.send({ message: "thank you for sharing your thoughts" });
    });
  })
);

app.use((request, response, next) => {
  response.send({ message: `path ${request.url} is invalid` });
});

app.use((error, request, response, next) => {
  response.send({ message: error.message });
});

let port=process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listening on port number ${process.env.PORT}`);
});
