const blogController = require("../controllers/blog.controller")

module.exports = function(app){

 app.post("/api/v1/blog/createblog" , blogController.createBlog)

 app.get("/api/v1/blog/allblogs", blogController.getAllBlog)
 app.get ("/api/v1/blog/blogs/:id" , blogController.getAllBlogById)
 app.put("/api/v1/blog/blogs/:id", blogController.UpdateBlog)
 app.delete("/api/v1/blog/blogs/:id", blogController.deleteBlog)
 app.get("/api/v1/blog/blogsbyuser/:id", blogController.userBlog)
}
