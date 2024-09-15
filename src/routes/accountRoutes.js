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
    // .get(accountController.showStudentLogin)
    .post(accountController.studentLogin);
router
    .route("/lecturerLogin")
    // .get(accountController.showLecturerLogin)
    .post(accountController.lecturerLogin);

router
    .route("/adminRegister")
    .get(accountController.showAdminRegisterForm)
    .post(accountController.adminRegister);
// ** LOGOUT **
router
    .route("/logout")
    .post(accountController.logoutUser);
module.exports = router;