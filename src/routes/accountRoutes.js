const express = require("express");
const router = express.Router();
const accountController = require('../controllers/accountController');

router
    .route("/")
    .get(accountController.showLoginPage);
router
    .route("/adminLogin")
    .get(accountController.showAdminLogin)
    .post(accountController.adminLogin);
router
    .route("/studentLogin")
    .post(accountController.studentLogin);
router
    .route("/lecturerLogin")
    .post(accountController.lecturerLogin);

// ** LOGOUT **
router
    .route("/logout")
    .post(accountController.logoutUser);
module.exports = router;