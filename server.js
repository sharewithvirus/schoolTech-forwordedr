require("dotenv").config();
const express = require("express");
const app = express();
var url = require("url");
const cors = require("cors");
const path = require("path")
const axios = require("axios");
const TelegramBot = require("telegram-bot-nodejs");
// const session = require("express-session");
// const cookieParser = require("cookie-parser");
// const MongoStore = require("connect-mongo");
// const mongoose = require("mongoose");

const userRouter = require("./routes/userRoute");
const adminRouter = require("./routes/adminRoute");
const attendanceRouter = require("./routes/attendance");
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerJSDocs = YAML.load("./api.yaml");

const dbUrl = process.env.DATABASE;
// const telegramTokan = `${process.env.BOTTOKEN}`;
const telegramTokan = `5371896188:AAHigi7tC5j5YnuiaioHkqJeiPf6PygkfkM`;

const bot = new TelegramBot(telegramTokan, "chatId here");


app.set("view engine", "ejs");
app.set("/views", path.join(__dirname, "/views"));


// mongoose
//   .connect(dbUrl, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then((data) => {
//     console.log("Database Successfully Connected...");
//   })
//   .catch((e) => {
//     console.log("Something Went Wrong...", e);
//   });

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    //   credentials: true,
  })
);
app.use(express.json());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/attendance", attendanceRouter);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJSDocs));
app.use(express.urlencoded({ extended: true }));
const secret = `${process.env.SECRET}` || "Thisismysecret";
// app.use(
//   session({
//     name: "SessionID",
//     store,
//     secret,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       httpOnly: true,
//       // expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
//       maxAge: Date.now() + 30 * 86400 * 1000,
//     },
//   })
// );

const attendanceData = [];

app.get("/", async (req, res) => {
  try {
    // const admins = await Admin.find({});
    res.send(" for View Data navigate to This URL:- https://schooltech-attendance.herokuapp.com/view-details/ for details")
  } catch {
    console.log(`SomeThing went wrong at this endPoint(/)`);
  }
});

// async function getUpdates() {
//   const response = await bot.getUpdates();
// }

// getUpdates();

app.get("/attendance?", 
async (req, res) => {
  try {
    const { id, time, cid } = req.query;
    let timeNow = new Date();
    const obj = {
      deviceId: id,
      time: time,
      cid: cid,
      htime: timeNow,
    }
    attendanceData.push(obj);
    res.send({
      message: "In",
    });

    chatId = "636502433";
    const bot = new TelegramBot(telegramTokan, chatId);
    async function sendMessage() {
      const response = await bot.sendMessage(
        `
          deviceId : ${id}, time : ${time}, cardId: ${cid},
        `, {
        chatId: "636502433",
      });
    }
    sendMessage();
  }catch {
    console.log(`SomeThing went wrong at this endPoint(/attendance?)`);
  }
});

app.get("/view-details/", async (req, res) => {
  try {
    const data = attendanceData.reverse();
    res.render(
      "pages/indexTable", { data: data}
    );
  }catch{
    console.log(`SomeThing went wrong at this endPoint(/view-details/)`);
  }
});



const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server is running on port ${port}!`));
