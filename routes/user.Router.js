const userController = require("../controllers/user.controller");

// router object

module.exports = function(app){
  app.get("/api/v1/user/all-user", userController.getAllUsers);

  app.post("/api/v1/user/register", userController.register);

  app.post("/api/v1/user/login", userController.login);
};
