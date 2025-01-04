const express = require("express");
const router = express.Router();

const lecturerController = require('../controllers/lecturerController');
const checkUser = require('../middlewares/requireLogin');

router
    .route("/addConsultation")
    .all(checkUser.checkIfLecturerIsLogged)
    .get(lecturerController.showAddConsultationForm)
    .post(lecturerController.addConsultation);
router
    .route("/showConsultations")
    .all(checkUser.checkIfLecturerIsLogged)
    .get(lecturerController.showConsultations)
router
    .route("/deleteConsultation")
    .all(checkUser.checkIfLecturerIsLogged)
    .get(lecturerController.showdeleteConsultations)
    .post(lecturerController.deleteConsultation);
router
    .route("/get/consultations")
    .all(checkUser.checkIfLecturerIsLogged)
    .get(lecturerController.getLecturerConsultations);
router
    .route("/get/periods")
    .all(checkUser.checkIfLecturerIsLogged)
    .get(lecturerController.getPeriodsForLecturer);
// router
//     .route("/get/periods2")
//     .get(lecturerController.getPeriodsForLecturer2);
router
    .route("/get/lecturerInfo")
    .all(checkUser.checkIfLecturerIsLogged)
    .get(lecturerController.getLecturerProfileInfo);
router
    .route("/schedule")
    .all(checkUser.checkIfLecturerIsLogged)
    .get(lecturerController.showLecturerSchedule);
router
    .route("/homePage")
    .all(checkUser.checkIfLecturerIsLogged)
    .get(lecturerController.showLecturerHomePage)
router
    .route("/profile")
    .all(checkUser.checkIfLecturerIsLogged)
    .get(lecturerController.showLecturerProfile)
router
    .route("/add/marks")
    .all(checkUser.checkIfLecturerIsLogged)
    .get(lecturerController.showLecturerAddStudentMarksForm)
    .post(lecturerController.addMark);
router
    .route("/get/marks")
    .all(checkUser.checkIfLecturerIsLogged)
    .get(lecturerController.getMarks)
router
    .route("/get/specialties")
    .all(checkUser.checkIfLecturerIsLogged)
    .get(lecturerController.getSpecialties)


router
    .route("/get/subjects")
    .all(checkUser.checkIfLecturerIsLogged)
    .get(lecturerController.getLecturerSubjects);
router
    .route("/review/marks")
    .all(checkUser.checkIfLecturerIsLogged)
    .get(lecturerController.showReviewMarks)
    .post(lecturerController.reviewMarksResult);
router
    .route("/review/groupHalfSubjects")
    .all(checkUser.checkIfLecturerIsLogged)
    .get(lecturerController.showGroupHalfSubjectForm)
    .post(lecturerController.reviewMarksResult);
// router
//     .route("/review/reviewMarksResult")
//     .all(checkUser.checkIfLecturerIsLogged)
//     .get(lecturerController.showReviewMarksResult)
router
    .route("/get/groups/:subjectId")
    .all(checkUser.checkIfLecturerIsLogged)
    .get(lecturerController.getLecturerGroups);
router
    .route("/get/groupfacNums/:groupHalf")
    .all(checkUser.checkIfLecturerIsLogged)
    .get(lecturerController.getGroupFacNums);
router
    .route("/get/departments")
    .all(checkUser.checkIfLecturerIsLogged)
    .get(lecturerController.getDepartments);
router
    .route("/get/specialties")
    .all(checkUser.checkIfLecturerIsLogged)
    .get(lecturerController.getSpecialties);
router
    .route("/get/groupHalfs")
    .all(checkUser.checkIfLecturerIsLogged)
    .post(lecturerController.getGroupHalfs);
router
    .route("/get/facultyNumbers")
    .all(checkUser.checkIfLecturerIsLogged)
    .post(lecturerController.getFacultyNumbers)
router
    .route("/get/subjectsHalf")
    .all(checkUser.checkIfLecturerIsLogged)
    .post(lecturerController.getSubjectsHalf);
module.exports = router;