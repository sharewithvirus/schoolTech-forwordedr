require("dotenv").config();
const express = require("express");
const app = express();
var url = require("url");
const cors = require("cors");
const path = require("path")
const axios = require("axios");
const TelegramBot = require("node-telegram-bot-api");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
// const userRouter = require("./routes/userRoute");
// const adminRouter = require("./routes/adminRoute");
// const attendanceRouter = require("./routes/attendance");
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerJSDocs = YAML.load("./api.yaml");
const moment = require("moment");


// -------------Import Models ----------------------

const RawAttendance = require("./models/rawAttendanceModel");
const dbUrl=`${process.env.DB_URL}` //For Local Data Base.
// const dbUrl = process.env.DB-URL;
// const dbUrl="mongodb+srv://appAccess:rJ7CHqX7TslmJKCW@attendance-forworder.sarpw.mongodb.net/schoolTech-Master"
// const telegramToken = `${process.env.BOTTOKEN}`;

// const bot = new TelegramBot(telegramToken, {polling: true});
app.set("view engine", "ejs");
app.set("/views", path.join(__dirname, "/views"));


mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((data) => {
    console.log("Database Successfully Connected...");
  })
  .catch((e) => {
    console.log("Something Went Wrong...", e);
  });

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    //   credentials: true,
  })
);
app.use(express.json());

// app.use("/api/v1/users", userRouter);
// app.use("/api/v1/admin", adminRouter);
// app.use("/attendance", attendanceRouter);
// app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJSDocs));
// app.use(express.urlencoded({ extended: true }));
// const secret = `${process.env.SECRET}` || "Thisismysecret";
const store = new MongoStore({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
});

store.on("error", function (e) {
  console.log("some", e);
});

app.use(cookieParser());

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

// bot.on('message', (message)=> {
//     console.log(message.text);
//     console.log(message.from.id);
// });

// Matches "/echo [whatever]"
// bot.onText(/\/echo (.+)/, (msg) => {
//   let chatId = message.from.id
//   if(msg = "start"){
//     let resp = "Enter Student Sr.No"
//     bot.sendMessage(chatId, resp);
//   }

//   // const chatId = msg.chat.id;
//   // const resp = match[1]; // the captured "whatever"

//   // send back the matched "whatever" to the chat
//   bot.sendMessage(chatId, resp);
// });

// bot.on('message', async(msg) => {
//   const chatId = msg.chat.id;
//   console.log(msg.text)
//   let response = '';
//     if(msg.text = "hello"){
//       response = "Hello From School Tech Attendance Bot, Enter Your Student Sr. No."
//     }else if(msg.text = isNumber){
//       const studentText = await StudentFind({ srNumber : Number });
//       if(studentText){
//         response = `${studentText.studentFirstName} ${studentText.studentMiddleName} ${studentText.studentLastName} is Your Student of School. to Confirm Plz reply with "Yes"`
//       }else{
//         response = "can't find Student in Database";
//       }
//     }

//   // send a message to the chat acknowledging receipt of their message
//   bot.sendMessage(chatId, response);
// });

// app.get("/", async (req, res) => {
//   try {
//     // const admins = await Admin.find({});
//     // res.send(" for View Data navigate to This URL:- https://schooltech-attendance.herokuapp.com/view-details/ for details")
//   } catch {
//     console.log(`SomeThing went wrong at this endPoint(/)`);
//   }
// });

// async function getUpdates() {
//   const response = await bot.getUpdates();
//   console.log(response)
// }
// getUpdates();

app.get("/attendance?", 
async (req, res) => {
  try {
    const { id, time, cid } = req.query;
    let timeNow = new Date();
    const rawAttendance = await new RawAttendance({
      deviceId: id,
      cardId: cid,
      deviceAttendanceTime: moment(time).format(),
      timeToHit: moment(timeNow).format(),
    });
    await rawAttendance.save();
    console.log("Attendance Save")
    res.send({
      message: "In",
    });
    try {
      axios.post(`http://localhost:8000/student-attendance/mark-present/${rawAttendance._id}`, rawAttendance)
    } catch (error) {
      console.log(`Error While Posting Attendance, Error:- ${error}`)
    }

  }catch {
    console.log(`SomeThing went wrong at this endPoint(/attendance?)`);
  }
});

// app.get("/view-details/", async (req, res) => {
//   try {
//     const data = attendanceData.reverse();
//     res.render(
//       "pages/indexTable", { data: data}
//     );
//   }catch{
//     console.log(`SomeThing went wrong at this endPoint(/view-details/)`);
//   }
// });



const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server is running on port ${port}!`));
