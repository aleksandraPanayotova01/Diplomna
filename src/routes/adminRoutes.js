const express = require("express");
const router = express.Router();

const adminController = require('../controllers/adminController');
const checkUser = require('../middlewares/requireLogin');

router
    .route("/homePage")
    .all(checkUser.checkIfAdminIsLogged)
    .get(adminController.showAdminHomePage);
router
    .route("/profile")
    .all(checkUser.checkIfAdminIsLogged)
    .get(adminController.showAdminProfile);
router
    .route("/studentRegister")
    .all(checkUser.checkIfAdminIsLogged)
    .get(adminController.showStudentRegisterForm)
    .post(adminController.studentRegister);
router
    .route("/lecturerRegister")
    .all(checkUser.checkIfAdminIsLogged)
    .get(adminController.showLecturerRegisterForm)
    .post(adminController.lecturerRegister);
router
    .route("/adminRegister")
    .all(checkUser.checkIfAdminIsLogged)
    .get(adminController.showAdminRegisterForm)
    .post(adminController.adminRegister);

router
    .route("/add/building")
    .all(checkUser.checkIfAdminIsLogged)
    .get(adminController.showAddBuilding)
    .post(adminController.addBuilding)
router
    .route("/add/subject")
    .all(checkUser.checkIfAdminIsLogged)
    .get(adminController.showAddSubjectForm)
    .post(adminController.addSubjectName)
router
    .route("/add/subjectToHalfs")
    .all(checkUser.checkIfAdminIsLogged)
    .get(adminController.showAddSubjectToHalfsForm)
    .post(adminController.addSubjectToHalfs)
router
    .route("/add/periodSchedule")//add period
    .all(checkUser.checkIfAdminIsLogged)
    .get(adminController.showAddPeriodScheduleForm)
    .post(adminController.addPeriod);
router
    .route("/add/marks")
    .all(checkUser.checkIfAdminIsLogged)
    .get(adminController.showAddStudentMarksForm)
    .post(adminController.addMark);
router
    .route("/get/departments")
    .all(checkUser.checkIfAdminIsLogged)
    .get(adminController.getDepartments);
router
    .route("/get/titles")
    .all(checkUser.checkIfAdminIsLogged)
    .get(adminController.getTitles);
router
    .route("/get/specialties")
    .all(checkUser.checkIfAdminIsLogged)
    .get(adminController.getSpecialties);
router
    .route("/get/lecturers")
    .all(checkUser.checkIfAdminIsLogged)
    .get(adminController.getLecturers);
router
    .route("/get/groupHalfs")
    .all(checkUser.checkIfAdminIsLogged)
    .post(adminController.getGroupHalfs);
router
    .route("/get/subjectsHalf")
    .all(checkUser.checkIfAdminIsLogged)
    .post(adminController.getSubjectsHalf);
router
    .route("/get/weekdays")
    .all(checkUser.checkIfAdminIsLogged)
    .get(adminController.getWeekdays);
router
    .route("/get/rooms")
    .all(checkUser.checkIfAdminIsLogged)
    .get(adminController.getRooms);
router
    .route("/get/marks")//all mark values
    .all(checkUser.checkIfAdminIsLogged)
    .get(adminController.getMarks);
router
    .route("/get/periodTypes")
    .all(checkUser.checkIfAdminIsLogged)
    .get(adminController.getPeriodTypes);
router
    .route("/get/courseNumbers")
    .all(checkUser.checkIfAdminIsLogged)
    .get(adminController.getCourseNumber);
router
    .route("/get/facultyNumbers")
    .all(checkUser.checkIfAdminIsLogged)
    .post(adminController.getFacultyNumbers)
router
    .route("/get/facultyNumbers1")
    .all(checkUser.checkIfAdminIsLogged)
    .post(adminController.getFacultyNumbers1)
router
    .route("/reviewSchedules")
    .all(checkUser.checkIfAdminIsLogged)
    .get(adminController.showReviewSchedulesForm)
    .post(adminController.reviewSchedules);
router
    .route("/review/subjectsHalf")
    .all(checkUser.checkIfAdminIsLogged)
    .get(adminController.showReviewSubjectHalfsForm)
    .post(adminController.reviewHalfSubjects);

router
    .route("/review/studentMarks")
    .all(checkUser.checkIfAdminIsLogged)
    .get(adminController.showStudentMarksForm1)
    .post(adminController.resultStudentMarks);

module.exports = router;