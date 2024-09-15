const express = require("express");
const router = express.Router();

const lecturerController = require('../controllers/lecturerController');
const adminController = require('../controllers/adminController');
const checkUser = require('../middlewares/requireLogin');

// .post(lecturerController.addConsultation);
router
    .route("/addConsultation")
    // .all(checkUser.checkIfLecturerIsLogged)
    .get(lecturerController.showAddConsultationForm)
    .post(lecturerController.addConsultation);
router
    .route("/showConsultations")
    // .all(checkUser.checkIfLecturerIsLogged)
    .get(lecturerController.showConsultations)

router
    .route("/get/consultations")
    // .all(checkUser.checkIfLecturerIsLogged)
    .get(lecturerController.getLecturerConsultations);
router
    .route("/get/periods")
    // .all(checkUser.checkIfLecturerIsLogged)
    .get(lecturerController.getPeriodsForLecturer);
// router
//     .route("/get/periods2")
//     .get(lecturerController.getPeriodsForLecturer2);
router
    .route("/get/lecturerInfo")
    // .all(checkUser.checkIfLecturerIsLogged)
    .get(lecturerController.getLecturerProfileInfo);
router
    .route("/schedule")
    // .all(checkUser.checkIfLecturerIsLogged)
    .get(lecturerController.showLecturerSchedule);
router
    .route("/homePage")
    // .all(checkUser.checkIfLecturerIsLogged)
    .get(lecturerController.showLecturerHomePage)
router
    .route("/profile")
    // .all(checkUser.checkIfLecturerIsLogged)
    .get(lecturerController.showLecturerProfile)
router
    .route("/add/marks")
    // .all(checkUser.checkIfLecturerIsLogged)
    .get(lecturerController.showLecturerAddStudentMarksForm)
    .post(lecturerController.addMark);

router
    .route("/get/subjects")
    // .all(checkUser.checkIfLecturerIsLogged)
    .get(lecturerController.getLecturerSubjects);
router
    .route("/get/groups/:subjectId")
    // .all(checkUser.checkIfLecturerIsLogged)
    .get(lecturerController.getLecturerGroups);
router
    .route("/get/groupfacNums/:groupHalf")
    // .all(checkUser.checkIfLecturerIsLogged)
    .get(lecturerController.getGroupFacNums);
module.exports = router;