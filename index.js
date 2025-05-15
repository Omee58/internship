const express = require("express");
const app = express();
const path = require("path");
const CookieParser = require("cookie-parser");
const middelware = require("./middelwares/middelware");
const controller = require("./controllers/user.controller");
require("dotenv").config();
const PORT = process.env.PORT || 3030;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(CookieParser());

app.get("/", controller.indexPage);

app.post("/login", middelware.SetTocken, controller.loginUser);

app.get(
  "/profile",
  middelware.isUserLogin,
  middelware.FindUser,
  controller.profilePage
);

app.get("/register", controller.registerPage);

app.post(
  "/register",
  middelware.UserExist,
  middelware.RegisterUser,
  controller.registerUser
);

app.get("/update", middelware.FindUser, controller.updatePage);
app.post("/update", middelware.FindUser, controller.updateUser);


app.get("/delete/:id", controller.deletePage);

app.get("/logout", controller.logoutPage);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});