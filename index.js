const express = require("express");
const app = express();
const router = express.Router();
const path = require("path");
const cors = require("cors");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const productRoute = require("./routes/products");
const cartRoute = require("./routes/cart");
const port = parseInt(process.env.PORT) || 3001;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(
  express.json(),
  cors(),
  router,
  express.urlencoded({
    extended: true,
  })
);
app.use(authRoute);
app.use(userRoute);
app.use(productRoute);
app.use(cartRoute);

app.listen(port, (err) => {
  if (err) {
    res.json({
      status: 400,
      msg: "Cannot run sever",
    });
  }
  console.log(`Sever is running on http://localhost:${port}`);
});

app.get("/", (req, res) => {
  try {
    res.sendFile(path.join(__dirname, "./public", "/index.html"));
  } catch (e) {
    {
      res.json({
        status: 400,
        msg: "Home page not found",
        err : e
      });
    }
  }
});

// router.get("/error", (req, res) => {
//     res.sendFile(path.join(__dirname, "./views", "/404.html"));
// });

app.get("*", (req, res) => {
  res.status(404).sendFile(path.join(__dirname, "./views", "/404.html"));
});

const { errorHandling } = require("./middleware/errorHandling");
//   Place the below code at the bottom of index.js so that it catches all errors.
// Taking care of all errors
app.use(errorHandling);
