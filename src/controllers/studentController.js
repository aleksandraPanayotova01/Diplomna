const periodService = require('../services/periodService');
const studentService = require('../services/studentService');
const accountService = require('../services/accountService');
module.exports = {
    showStudentSchedule: async (req, res) => {
        res.render("student/schedule")//view/filename
    },
    showStudentHomePage: async (req, res) => {
        res.render("student/studentHomePage");//view/filename
    },

    getPeriodsForStudent: async (req, res) => {
        try {
            const studentProfileId = req.session.student_profile_id;
            console.log(studentProfileId);
            const periodsForStudent = await periodService.getPeriodsForStudent(studentProfileId);
            console.log(periodsForStudent);
            res.json(periodsForStudent);

        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },
    getStudentGroupAndHalf: async (req, res) => {
        try {
            const studentProfileId = req.session.student_profile_id;
            const studentGroupAndHalf = await periodService.getStudentGroupAndHalf(studentProfileId);
            console.log(studentGroupAndHalf);
            res.json(studentGroupAndHalf);

        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },
    showStudentMarksForm: async (req, res) => {//in student
        try {
            const studentProfileId = req.session.student_profile_id;
            const marks = await studentService.getStudentMarks(studentProfileId);
            console.log(marks);
            res.render('student/studentMarks', { marks });

        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },
    showStudentMarksForm1: async (req, res) => {//in admin
        try {

            const specialties = await accountService.getSpecialties();
            const courses = await accountService.getCourses();
            const groups = await accountService.getGroupNumbers();
            const groupHalves = await accountService.getGroupHalfs();
            const studentMarksInfo = {
                specialties,
                courses,
                groups,
                groupHalves
            }
            console.log(studentMarksInfo);
            res.render('admin/reviewStudentMarks', { studentMarksInfo });

        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },
    resultStudentMarks: async (req, res) => {
        try {
            const facultyNumbersSelect = req.body;
            console.log(facultyNumbersSelect);
            const studentProfileId =
                await studentService.getStudentProfileId(facultyNumbersSelect);
            console.log("studentProfileId", studentProfileId);
            const marks = await studentService.getStudentMarks(studentProfileId[0].student_profile_id);
            console.log(marks);
            res.render('admin/studentMarksResult', { marks, facultyNumbersSelect });

        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },

    showStudentProfile: async (req, res) => {
        try {
            const studentProfileId = req.session.student_profile_id;
            const studentProfileInfo = await periodService.getStudentProfileInfo(studentProfileId);
            console.log(studentProfileInfo);
            res.render("student/studentProfileInformation", { studentProfileInfo });
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    }
    ,
    showConsultations: async (req, res) => {
        try {
            const studentProfileId = req.session.student_profile_id;
            const studentConsultations = await studentService.
                getStudentConsultations(studentProfileId);
            res.render("student/studentConsultations", { studentConsultations });
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    }
    ,
    searchConsultations: async (req, res) => {
        try {
            const body = req.body;
            const consultations = await studentService.searchConsultations(body.consultationSearch);
            res.json(consultations);
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    }
    // getStudentProfileInfo: async (req, res) => {
    //     try {
    //         const studentProfileId = req.session.student_profile_id;
    //         // const studentGroupAndHalf = await periodService.getStudentGroupAndHalf(studentProfileId);
    //         const studentProfileInfo = await periodService.getStudentProfileInfo(studentProfileId);
    //         res.json(studentProfileInfo);
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).send("Internal Server Error");
    //     }
    // }
}
