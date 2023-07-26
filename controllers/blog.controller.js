const blogModel = require("../model/blogModel");
const userModel = require("../model/userModel");
const mongoose = require("mongoose");

exports.createBlog = async (req, res) => {
  try {
    const { title, image, description, user } = req.body;

    if (!title || !image || !description || !user) {
      return res.status(400).send({
        success: false,
        message: "please provide All Fields",
      });
    }

    const existingUser = await userModel.findById(user);

    if (!existingUser) {
      return res.status(404).send({
        success: false,
        message: "unable to find user",
      });
    }

    const newblog = await blogModel({ title, image, description, user });

    const session = await mongoose.startSession();
    session.startTransaction();
    await newblog.save({ session });
    existingUser.blogs.push(newblog);
    await existingUser.save({ session });
    await session.commitTransaction();

    await newblog.save();
    return res.status(200).send({
      success: true,
      message: "Blog created",
      newblog,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Error while creating blog",
      err,
    });
  }
};

exports.getAllBlog = async (req, res) => {
  try {
    const blogs = await blogModel.find({}).populate("user");

    if (!blogs) {
      return res.status(200).send({
        success: false,
        message: "no blogs found",
      });
    }

    return res.status(200).send({
      success: true,
      BlogCount: blogs.length,
      message: " All blogs list",
      blogs,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Error while Getting blogs",
      err,
    });
  }
};

exports.getAllBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await blogModel.findById(id);
    if (!blog) {
      return res.status(404).send({
        success: false,
        message: "blogs not found with this id",
        err,
      });
    }
    return res.status(200).send({
      success: true,
      message: "fetch single blog",
      blog,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Error while fetch blog by id",
      err,
    });
  }
};

exports.UpdateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, image, description } = req.body;
    const blog = await blogModel.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );
    return res.status(200).send({
      success: true,
      message: "  blogs are updated",
      blog,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Error while update blogs",
      err,
    });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blog = await blogModel
      // .findOneAndDelete(req.params.id)
      .findByIdAndDelete(req.params.id)
      .populate("user");
    await blog.user.blogs.pull(blog);
    await blog.user.save();
    return res.status(200).send({
      success: true,
      message: "Blog Deleted!",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Error while delete  blogs",
      err,
    });
  }
};


exports.userBlog = async(req,res) =>{
   try {
      const userBlog = await userModel.findById(req.params.id).populate("blogs");
  
      if (!userBlog) {
        return res.status(404).send({
          success: false,
          message: "blogs not found with this id",
        });
      }
      return res.status(200).send({
        success: true,
        message: "user blogs",
        userBlog,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).send({
        success: false,
        message: "error in user blog",
        error,
      });
    }
}