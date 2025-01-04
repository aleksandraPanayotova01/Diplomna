const lecturerService = require('../services/lecturerService');
const periodService = require('../services/periodService');
const studentService = require('../services/studentService');
const accountService = require('../services/accountService');
module.exports = {
    showAddConsultationForm: (req, res) => {
        res.render("lecturer/addConsultationForm")//view/filename
    },
    showLecturerSchedule: (req, res) => {
        res.render("lecturer/lecturerSchedule")//view/filename
    },
    showLecturerHomePage: (req, res) => {
        res.render("lecturer/lecturerHomePage")//view/filename
    },
    showConsultations: async (req, res) => {
        try {
            const lecturerProfileId = req.session.lecturer_profile_id; // Adjust if needed
            const consultations = await lecturerService.getLecturerConsultations(lecturerProfileId);
            res.render('lecturer/consultations', { consultations });
        } catch (error) {
            console.error('Error fetching consultations:', error);
            res.status(500).send('Error fetching consultations');
        }//view/filename
    },
    showdeleteConsultations: async (req, res) => {
        try {
            const lecturerProfileId = req.session.lecturer_profile_id; // Adjust if needed
            const consultations = await lecturerService.getLecturerConsultations(lecturerProfileId);
            res.render('lecturer/deleteConsultationForm', { consultations });
        } catch (error) {
            console.error('Error fetching consultations:', error);
            res.status(500).send('Error fetching consultations');
        }//view/filename
    },
    deleteConsultation: async (req, res) => {
        try {
            // const body = req.body;
            const { consultationId } = req.body;
            // console.log(body);
            if (!consultationId) {
                return res.status(400).json({ message: "Consultation ID is required." });
            }
            // console.log("Consultation info:", consultationInformation);
            await lecturerService.deleteConsultation(consultationId);
            res.redirect("/lecturer/deleteConsultation");
        } catch (error) {
            console.log(error);
        }

    },
    showLecturerAddStudentMarksForm: async (req, res) => {
        try {
            const faculties = await accountService.getFaculties();
            console.log(faculties);
            res.render('lecturer/lecturerAddStudentMarksForm', { faculties });//, { consultations }
        } catch (error) {
            console.error('Error fetching consultations:', error);
            res.status(500).send('Error fetching consultations');
        }//view/filename
    },
    showLecturerProfile: async (req, res) => {
        try {
            const lecturerProfileId = req.session.lecturer_profile_id;
            const lecturerProfileInfo = await periodService
                .getLecturerProfileInfo(lecturerProfileId);
            console.log(lecturerProfileInfo);
            res.render("lecturer/lecturerProfileInformation", { lecturerProfileInfo });
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },
    showReviewMarks: async (req, res) => {
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
            }//facNums added dynamicaly after geting groupHalfId
            console.log("Student marks info:", studentMarksInfo);

            res.render("lecturer/reviewMarksForm", { studentMarksInfo });
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },
    showGroupHalfSubjectForm: async (req, res) => {
        try {
            const specialties = await accountService.getSpecialties();
            const courses = await accountService.getCourses();
            const groups = await accountService.getGroupNumbers();
            const groupHalves = await accountService.getGroupHalfs();
            const groupHalfSubjectInfo = {
                specialties,
                courses,
                groups,
                groupHalves
            }//facNums added dynamicaly after geting groupHalfId
            console.log("Student marks info:", groupHalfSubjectInfo);

            res.render("lecturer/reviewGroupHalfSubjects", { groupHalfSubjectInfo });
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },
    reviewMarksResult: async (req, res) => {
        try {

            const studentMarksInfo = { specialty, courseNumber, groupNumber, groupHalfLetter } = req.body;
            // console.log(facultyNumbersSelect);
            // const studentProfileId =
            //     await studentService.getStudentProfileId(facultyNumbersSelect);
            // console.log("studentProfileId", studentProfileId);
            const groupHalfId = await accountService.getGroupHalfId(studentMarksInfo);
            console.log("groupHalfId", groupHalfId[0].group_half_id);
            const studentMarks = await lecturerService.getGroupHalfMarks(groupHalfId[0].group_half_id);

            console.log(studentMarks);
            // res.render('admin/studentMarksResult', { marks, facultyNumbersSelect });
            res.render("lecturer/reviewMarksResultForm", { studentMarks });
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },
    getLecturerProfileInfo: async (req, res) => {
        const lecturerProfileId = req.session.lecturer_profile_id;
        const lecturerProfileInfo = await periodService
            .getLecturerProfileInfo(lecturerProfileId);
        res.json(lecturerProfileInfo);
        console.log(lecturerProfileInfo);
    },
    addConsultation: async (req, res) => {
        const body = req.body;
        try {
            const lecturerProfileId = req.session.lecturer_profile_id;
            const consultationInformation = {
                consultationStart: body.consultationStart,
                consultationEnd: body.consultationEnd,
                weekday: body.weekday,
                room: body.room,
                lecturerProfileId
                // subject: body.subject
            };
            console.log(body);
            console.log("Consultation info:", consultationInformation);
            await lecturerService.addConsultation(consultationInformation);
            res.redirect("/lecturer/addConsultation");
        } catch (error) {
            console.log(error);
        }

    },
    getLecturerConsultations: async (req, res) => {
        try {
            const lecturerProfileId = req.session.lecturer_profile_id; // Adjust as needed
            const consultations = await lecturerService.getLecturerConsultations(lecturerProfileId);
            res.json(consultations);
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },
    getLecturerSubjects: async (req, res) => {
        try {
            const lecturerProfileId = req.session.lecturer_profile_id;
            const subjectsLecturer = await lecturerService
                .getLecturerSubjects(lecturerProfileId);
            res.json(subjectsLecturer);
            console.log(subjectsLecturer);
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    }, getPeriodsForLecturer: async (req, res) => {
        try {
            const profileId = req.session.profile_id;
            console.log(profileId);
            const periodsForLecturer = await periodService.getPeriodsForLecturer(profileId);
            console.log(periodsForLecturer.length);
            res.json(periodsForLecturer);

        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },
    getPeriodsForLecturer2: async (req, res) => {///
        try {
            const profileId = req.session.profile_id;
            console.log(profileId);
            const periodsForLecturer = await periodService.getPeriodsForLecturer(profileId);
            console.log(periodsForLecturer);
            res.json(periodsForLecturer);

        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },
    getLecturerGroups: async (req, res) => {
        try {
            const lecturerId = req.session.lecturer_profile_id;
            const { subjectId } = req.params;
            const groups = await lecturerService.getLecturerGroups(lecturerId, subjectId);
            res.json(groups);
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },
    getGroupFacNums: async (req, res) => {
        try {
            // const lecturerId = req.session.lecturer_profile_id;
            const { groupHalf } = req.params;
            const fac_nums =
                await lecturerService.getGroupFacNums(groupHalf);
            res.json(fac_nums);
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },
    addMark: async (req, res) => {
        try {
            // const lecturerId = req.session.lecturer_profile_id;
            const body = req.body;
            markInformation = {
                semester: body.selectCourse,
                groupNumber: body.selectGroup,
                groupHalf: body.selectGroupHalf,
                subject: body.selectSubject,//subject id
                facNum: body.facultyNumbersSelect,
                mark: body.selectMarks
            }
            console.log(markInformation);
            await studentService.addMark(markInformation);
            res.redirect("/lecturer/add/marks");
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    }, getMarks: async (req, res) => {
        try {
            const marks = await studentService.getMarks();
            res.json(marks);
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },
    getSpecialties: async (req, res) => {//controller name
        try {
            const specialties = await accountService.getSpecialties();//service name
            // console.log(specialties);
            res.json(specialties);
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },
    getDepartments: async (req, res) => {//controller name
        try {

            const departments = await accountService.getDepartments();//service name

            res.json(departments);
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },
    getGroupHalfs: async (req, res) => {
        try {
            const { specialty, course } = req.body; // Extract specialty_id and course from request body

            if (!specialty || !course) {
                return res.status(400).json({ error: "Specialty ID and course are required." });
            }

            console.log(`Specialty ID: ${specialty}, Course: ${course}`);

            // Fetch group halves using specialty_id and course
            const groupHalfs = await periodService.getGroupHalfs(specialty, course);

            if (groupHalfs.length === 0) {
                return res.status(404).json({ message: "No group halves found for this specialty and course." });
            }

            res.json(groupHalfs);
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },
    getFacultyNumbers: async (req, res) => {
        try {
            const fac_nums = await studentService.getFacNums(req.body.groupHalfId);
            res.json(fac_nums);
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },
    getSubjectsHalf: async (req, res) => {
        try {
            const { groupHalfId } = req.body;
            console.log(groupHalfId);
            const subjectsHalf = await periodService.getSubjectsHalf(groupHalfId);
            console.log(subjectsHalf);
            res.json(subjectsHalf);
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },
}