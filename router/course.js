const express = require("express");
const courseController = require("../controllers/course");
const multiparty = require("connect-multiparty");
const md_auth = require("../middlewares/athenticated");


const api = express.Router();
const md_upload =multiparty({uploadDir: "./uploads/course"});

//ENDPOINTS
api.post("/course", [md_auth.asureAuth, md_upload], courseController.createCourse);
api.get("/courses", courseController.getCourse);
api.patch("/course/:id", [md_auth.asureAuth , md_upload], courseController.updateCourse);
api.delete("/course/:id", [md_auth.asureAuth], courseController.deleteCourse);
module.exports = api;