const express = require("express");
const md_auth = require("../middlewares/athenticated");
const  newsletterController = require("../controllers/newsletter");

const api = express.Router();
api.post("/newsletter", [md_auth.asureAuth], newsletterController.suscribeEmail);
api.get("/newsletter",[md_auth.asureAuth], newsletterController.getEmails);
api.delete("/newsletter/:id", [md_auth.asureAuth], newsletterController.emailDelete);
module.exports= api;