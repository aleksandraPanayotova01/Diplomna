const lecturerService = require('../services/lecturerService');
const periodService = require('../services/periodService');
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
    showLecturerAddStudentMarksForm: async (req, res) => {
        try {
            const lecturerProfileId = req.session.lecturer_profile_id; // Adjust if needed
            // const consultations = await lecturerService.getLecturerConsultations(lecturerProfileId);
            res.render('lecturer/lecturerAddStudentMarksForm');//, { consultations }
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
    }, getLecturerProfileInfo: async (req, res) => {
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
            // const body = req.body;
            // const lecturerProfileId = req.session.lecturer_profile_id;
            // const consultationsLecturer = await lecturerService
            //     .getLecturerConsultations(lecturerProfileId);
            // res.json(consultationsLecturer);
            // console.log(consultationsLecturer);
            // console.log(body);
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
            const { subject, group, facultyNumber, grade } = req.body;
            await lecturerService
                .addMark(subject, group, facultyNumber, grade);
            res.redirect("/lecturer/add/marks");
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },


}