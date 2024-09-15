const express = require("express");
const router = express.Router();
const studentController = require('../controllers/studentController');
const checkUser = require('../middlewares/requireLogin');

router
    .route("/schedule")
    // .all(checkUser.checkIfStudentIsLogged)
    .get(studentController.showStudentSchedule);
router
    .route("/get/periods")
    // .all(checkUser.checkIfStudentIsLogged)
    .get(studentController.getPeriodsForStudent);
router
    .route("/get/studentGroup")
    // .all(checkUser.checkIfStudentIsLogged)
    .get(studentController.getStudentGroupAndHalf);
router
    .route("/profile")
    // .all(checkUser.checkIfStudentIsLogged)
    .get(studentController.showStudentProfile)
router
    .route("/marks")
    // .all(checkUser.checkIfStudentIsLogged)
    .get(studentController.showStudentMarksForm)
// router
//     .route("/get/profileInfo")
//     .get(studentController.getStudentProfileInfo)
router
    .route("/homePage")
    // .all(checkUser.checkIfStudentIsLogged)
    .get(studentController.showStudentHomePage)
module.exports = router;    