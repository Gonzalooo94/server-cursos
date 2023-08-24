const express = require("express");
const bodyPaser = require("body-parser");
const cors = require("cors");
const { API_VERSION } = require("./constants");

 const app = express();

 // Import routings

 const authRoutes = require("./router/auth"); 
 const userRoutes = require("./router/user");
 const menuRoutes = require("./router/menu");
 const courseRoutes = require("./router/course");
 const blogRoutes = require("./router/post");
 const NewsletterRoutes = require("./router/newsletter");


 //Configure bodyPaser
 app.use(bodyPaser.urlencoded({ extended: true}));
 app.use(bodyPaser.json());

 // Configure static folder
 app.use(express.static("uploads"));

 // Configure Header HTTP-CORS.
app.use(cors());

// Configure routings
app.use(`/api/${API_VERSION}`, authRoutes);
app.use(`/api/${API_VERSION}`, userRoutes);
app.use(`/api/${API_VERSION}`, menuRoutes);
app.use(`/api/${API_VERSION}`, courseRoutes);
app.use(`/api/${API_VERSION}`, blogRoutes);
app.use(`/api/${API_VERSION}`, NewsletterRoutes);
 module.exports = app;