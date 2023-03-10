// import library
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const { Server } = require("socket.io");

const stripe = require("stripe")(
  "sk_test_51LRcSxIMvmMrGIG9T6xb0U2DYo4qsQ6xPvNOl2KEJY7uwWy7U9B6ySPEerpzwt1QqmQafKGSCBSsNk2cs91YKSvC005ty5W4nM"
);

// heheh

// import route
const userRoute = require("./routes/user");
// const postRoute = require("./routes/post");
// const messageRoute = require("./routes/message");
// const chatRoute = require("./routes/chat");
// const messageV2Route = require("./routes/messageV2");
const categoryRoute = require("./routes/category");
const productRoute = require("./routes/product");
const bannerRoute = require("./routes/banner");
const orderRoute = require("./routes/order");

var bodyParser = require("body-parser");

// app start up and port
const app = express();
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(express.json());

// Enviroment avarible ENV
dotenv.config();

app.use("/images", express.static(path.join(__dirname, "public/images")));

// connect database
mongoose.connect(process.env.MONGO_URL, () => {
  console.log("Connected to MongoDB");
});

//middleware
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan("common"));

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "public/images");
//     },
//     filename: (req, file, cb) => {
//         cb(null, req.body.name);
//         // cb(null, file.originalname);
//     },
// });

// const upload = multer({ storage: storage });
// app.post("/api/upload", upload.single("file"), (req, res) => {
//     try {
//         return res.status(200).json("File uploded successfully");
//     } catch (error) {
//         return res.status(500).json(error.message);
//     }
// });

// request http
app.get("/", (req, res) => {
  res.send("alo");
});
app.use("/api/users", userRoute);
// app.use("/api/posts", postRoute);
// app.use("/api/messages", messageRoute);
// app.use("/api/chats", chatRoute);
app.use("/api/categorys", categoryRoute);
app.use("/api/products", productRoute);
app.use("/api/banners", bannerRoute);
app.use("/api/orders", orderRoute);

// app.use("/api/messsagesV2", messageV2Route);

app.get("/api/config", (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

app.post("/api/create-payment-intent", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "EUR",
      amount: req.body.amount,
      automatic_payment_methods: { enabled: true },
    });

    // Send publishable key and PaymentIntent details to client
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
});

const server = app.listen(1800, () => {
  console.log("Server is running... ");
});

// const io = new Server(server, {
//   cors: {
//     origin: [
//       process.env.CLIENT_HOST,
//       "http://localhost:3000",
//       "https://frost-social.vercel.app",
//       "https://frost-social-4f5kdlt7u-noothelee.vercel.app",
//       "https://frost-social-git-main-noothelee.vercel.app/",
//     ],
//     methods: ["GET", "POST", "PUT", "PATCH"],
//     allowedHeaders: ["Content-type"],
//   },
// });

// io.on("connect", (socket) => {
//   socket.on("new-post", (newPost) => {
//     console.log("new-post", newPost);
//     socket.broadcast.emit("new-post", newPost);
//   });
//   socket.on("new-comment", (newComment) => {
//     //console.log("new-post", newPost);
//     socket.broadcast.emit("new-comment", newComment);
//   });
//   socket.on("new-message", (newMessage) => {
//     // console.log(newMessage);
//     socket.broadcast.emit("new-message", newMessage);
//   });
// });
