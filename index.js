const express = require("express");
const app = express();
const router = express.Router();
const path = require("path");
const cors = require("cors");
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const productRoute = require('./routes/products');
const cartRoute = require('./routes/cart');
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
    if (err) throw err;
    console.log(`Sever is running on http://localhost:${port}`);
});

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./views", "/index.html"));
});

router.get("/error", (req, res) => {
    res.sendFile(path.join(__dirname, "./views", "/404.html"));
});

app.get("*", (req, res) => {
    res.status(404).sendFile(path.join(__dirname, "./views", "/404.html"))
})

// router.get("/register", (req, res) => {
//     res.sendFile(path.join(__dirname, "./views", "/register.html"));
// });

const {errorHandling} = require('./middleware/errorHandling');
//   Place the below code at the bottom of index.js so that it catches all errors.
  // Taking care of all errors
app.use(errorHandling);