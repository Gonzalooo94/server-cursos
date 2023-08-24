const express = require("express");
const PostController = require("../controllers/post");
const md_auth = require("../middlewares/athenticated");
const multiparty = require("connect-multiparty");


const md_upload = multiparty({ uploadDir: "./uploads/blog"});
const api = express.Router();

// Routes...

api.post("/post", [md_auth.asureAuth,md_upload], PostController.createPost);
api.get("/post", PostController.getPosts);
api.patch("/post/:id", [md_auth.asureAuth , md_upload], PostController.updatePost);
api.delete("/post/:id", [md_auth.asureAuth, md_upload], PostController.deletePost);
api.get("/post/:path", PostController.getPost);
api.get("/posts/:title", PostController.seekPost);

module.exports= api;