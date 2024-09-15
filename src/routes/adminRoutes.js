const express = require("express");
const router = express.Router();

const adminController = require('../controllers/adminController');
const accountController = require('../controllers/accountController');
const studentController = require('../controllers/studentController');
const checkUser = require('../middlewares/requireLogin');

// router
//     .route("/")
//     .get(adminController.showLoginPage);
router
    .route("/homePage")
    .all(checkUser.checkIfAdminIsLogged)
    .get(adminController.showAdminHomePage);
router
    .route("/profile")
    .all(checkUser.checkIfAdminIsLogged)
    .get(accountController.showAdminProfile);
router
    .route("/studentRegister")
    .all(checkUser.checkIfAdminIsLogged)
    .get(accountController.showStudentRegisterForm)
    .post(accountController.studentRegister);
router
    .route("/lecturerRegister")
    .all(checkUser.checkIfAdminIsLogged)
    .get(accountController.showLecturerRegisterForm)
    .post(accountController.lecturerRegister);
router
    .route("/adminRegister")
    .all(checkUser.checkIfAdminIsLogged)
    .get(accountController.showAdminRegisterForm)
    .post(accountController.adminRegister);

router
    .route("/add/building")
    .all(checkUser.checkIfAdminIsLogged)
    .get(adminController.showAddBuilding)
    .post(adminController.addBuilding)
// router
//     .route("/add/groups")
//     .get(adminController.showAddGroupsForm)

router
    .route("/add/subject")
    // .all(checkUser.checkIfAdminIsLogged)
    .get(adminController.showAddSubjectForm)
    .post(adminController.addSubjectName)
router
    .route("/add/subjectToHalfs")
    // .all(checkUser.checkIfAdminIsLogged)
    .get(adminController.showAddSubjectToHalfsForm)
    .post(adminController.addSubjectToHalfs)
router
    .route("/add/periodSchedule")//add period
    // .all(checkUser.checkIfAdminIsLogged)
    .get(adminController.showAddPeriodScheduleForm)
    .post(adminController.addPeriod);
router
    .route("/add/marks")
    // .all(checkUser.checkIfAdminIsLogged)
    .get(adminController.showAddStudentMarksForm)
    .post(adminController.addMark);
router
    .route("/get/departments")
    // .all(checkUser.checkIfAdminIsLogged)
    .get(adminController.getDepartments);
router
    .route("/get/titles")
    // .all(checkUser.checkIfAdminIsLogged)
    .get(adminController.getTitles);
router
    .route("/get/specialties")
    // .all(checkUser.checkIfAdminIsLogged)
    .get(adminController.getSpecialties);
router
    .route("/get/lecturers")
    // .all(checkUser.checkIfAdminIsLogged)
    .get(adminController.getLecturers);
router
    .route("/get/groupHalfs")
    // .all(checkUser.checkIfAdminIsLogged)
    .post(adminController.getGroupHalfs);
router
    .route("/get/subjectsHalf")
    // .all(checkUser.checkIfAdminIsLogged)
    .post(adminController.getSubjectsHalf);
router
    .route("/get/weekdays")
    // .all(checkUser.checkIfAdminIsLogged)
    .get(adminController.getWeekdays);
router
    .route("/get/rooms")
    // .all(checkUser.checkIfAdminIsLogged)
    .get(adminController.getRooms);
router
    .route("/get/marks")//all mark values
    .all(checkUser.checkIfAdminIsLogged)
    .get(adminController.getMarks);
router
    .route("/get/periodTypes")
    // .all(checkUser.checkIfAdminIsLogged)
    .get(adminController.getPeriodTypes);
//  .post
router
    .route("/get/courseNumbers")
    // .all(checkUser.checkIfAdminIsLogged)
    .get(adminController.getCourseNumber);
router
    .route("/get/facultyNumbers")
    // .all(checkUser.checkIfAdminIsLogged)
    .post(adminController.getFacultyNumbers)
router
    .route("/get/facultyNumbers1")
    // .all(checkUser.checkIfAdminIsLogged)
    .post(adminController.getFacultyNumbers1)
router
    .route("/reviewSchedules")
    // .all(checkUser.checkIfAdminIsLogged)
    .get(accountController.showReviewSchedulesForm)
    .post(accountController.reviewSchedules);
router
    .route("/review/subjectsHalf")
    // .all(checkUser.checkIfAdminIsLogged)
    .get(accountController.showReviewSubjectHalfsForm)
    .post(accountController.reviewHalfSubjects);

router
    .route("/review/studentMarks")
    // .all(checkUser.checkIfAdminIsLogged)
    .get(studentController.showStudentMarksForm1)
    .post(studentController.resultStudentMarks);

module.exports = router;