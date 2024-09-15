const accountService = require('../services/accountService');
const periodService = require('../services/periodService');
module.exports = {
    showLoginPage: (req, res) => {
        res.render("partials/loginPage")//view/filename
    },
    showStudentRegisterForm: async (req, res) => {
        const faculties = await accountService.getFaculties();
        res.render("admin/studentRegistrationForm", { faculties });
    },
    showLecturerRegisterForm: async (req, res) => {
        const faculties = await accountService.getFaculties();
        const titles = await accountService.getTitles();
        res.render("admin/lecturerRegistrationForm", { faculties, titles });
    },
    showAdminRegisterForm: async (req, res) => {
        res.render("admin/adminRegistrationForm");
    },

    showAdminLogin: (req, res) => {
        res.render("admin/adminLoginForm");
    },
    adminRegister: async (req, res) => {
        const body = req.body;
        const adminInformation = {
            username: body.username,
            password: body.password,
            passwordRepeat: body.passwordRepeat,
            name: body.name,
            fathers_name: body.fathersName,
            surname: body.surname,
            userType: 'admin'
        }
        console.log(adminInformation);
        try {
            const admin = await accountService.registerAdmin(adminInformation);

            if (admin === "Username and password taken") {
                req.flash("error", "Потребителското име e заетo");
                res.redirect("/admin/adminRegister");
            } else if (admin === "False regex") {
                req.flash("error", "Невалидни потребителски данни");
                res.redirect("/admin/adminRegister");
            } else if (admin === "Password does not match") {
                req.flash("error", "Невалидни потребителски данни");
                res.redirect("/admin/adminRegister");
            } else {
                req.flash("success", "Успешно създаден профил");
                res.redirect(`/admin/adminRegister`);
            }
        } catch (error) {
            req.flash("error", "Неуспешно създаване на потребител");
            res.redirect("admin/adminRegister");
        }
    },
    studentRegister: async (req, res) => {
        const userBody = req.body;

        const userInformation = {//student
            username: userBody.username,
            password: userBody.password,
            passwordRepeat: userBody.passwordRepeat,
            facNumber: userBody.facultyNum,
            egn: userBody.egn,
            groupNumber: userBody.group,
            groupHalf: userBody.half,
            courseNumber: userBody.courseNum,
            specialtyName: userBody.selectSpecialty,
            name: userBody.name,
            fathers_name: userBody.fathersName,
            surname: userBody.surname,
            userType: 'student'
        }

        try {
            const user = await accountService.registerStudent(userInformation);
            // console.log(userInformation);
            if (user === "Username and password taken") {
                req.flash("error", "Потребителското име e заетo");
                res.redirect("/admin/studentRegister");
            } else if (user === "False regex") {
                req.flash("error", "Невалидни потребителски данни");
                res.redirect("/admin/studentRegister");
            } else if (user === "Password does not match") {
                req.flash("error", "Невалидни потребителски данни");
                res.redirect("/admin/studentRegister");
            } else {
                req.flash("success", "Успешно създаден профил");

                res.redirect(`/admin/studentRegister`);
            }
        } catch (error) {
            req.flash("error", "Неуспешно създаване на потребител");
            res.redirect("/admin/studentRegister");
        }
    },
    lecturerRegister: async (req, res) => {
        const userBody = req.body;

        const userInformation = {
            username: userBody.username,
            password: userBody.password,
            passwordRepeat: userBody.passwordRepeat,
            title: userBody.title,
            department: userBody.department,
            egn: userBody.egn,
            name: userBody.firstName,
            fathers_name: userBody.fathersName,
            surname: userBody.surname,
            userType: 'lecturer'
        }

        try {
            // console.log(userInformation);
            const user = await accountService.registerLecturer(userInformation);

            if (user === "Username and password taken") {
                req.flash("error", "Потребителското име e заетo");
                res.redirect("/admin/lecturerRegister");
            } else if (user === "False regex") {
                req.flash("error", "Невалидни потребителски данни");
                res.redirect("/admin/lecturerRegister");
            } else if (user === "Password does not match") {
                req.flash("error", "Невалидни потребителски данни");
                res.redirect("/admin/lecturerRegister");
            } else {
                req.flash("success", "Успешно създаден профил");

                res.redirect(`/admin/lecturerRegister`);
            }
        } catch (error) {
            req.flash("error", "Неуспешно създаване на потребител");
            res.redirect("/admin/lecturerRegister");
        }
    },
    studentLogin: async (req, res) => {
        const userBody = req.body;

        const userCredentials = {
            username: userBody.username,
            password: userBody.password

        }

        try {
            const user = await accountService.loginStudent(userCredentials);

            if (user) {

                req.session.student_profile_id = user.student_profile_id;
                req.session.profile_id = user.profile_id;
                req.session.profile_status_id = user.profile_status_id_fk;
                // const studentProfileStatusId = req.session.profile_status_id;
                // if (studentProfileStatusId === '1') {
                res.redirect('/student/homePage');//vremenno
                // } else {
                // req.flash("error", "Профилът не е активен");
                // }
            } else {
                req.flash("error", "Грешно потребителско име или парола");
                res.redirect("/");
            }
        } catch (error) {
            console.log(error);

            req.flash("error", "Грешно потребителско име или парола");
            res.redirect("/");
        }
    },
    lecturerLogin: async (req, res) => {
        const lecturerBody = req.body;

        const lecturerCredentials = {
            username: lecturerBody.username,
            password: lecturerBody.password
        }

        try {
            const lecturer = await accountService.loginLecturer(lecturerCredentials);
            if (lecturer) {
                req.session.lecturer_profile_id = lecturer.lecturer_profile_id;
                req.session.profile_id = lecturer.profile_id;
                req.session.profile_status_id = lecturer.profile_status_id_fk;
                // const lecturerProfileStatusId = req.session.profile_status_id;
                // if (lecturerProfileStatusId === '1') {
                res.redirect('/lecturer/homePage');//vremenno
                // } else {
                // req.flash("error", "Профилът не е активен");
                // }
            } else {
                req.flash("error", "Грешно потребителско име или парола");
                res.redirect("/");
            }
        } catch (error) {
            console.log(error);
            req.flash("error", "Грешно потребителско име или парола");
            res.redirect("/");
        }
    },
    adminLogin: async (req, res) => {
        const body = req.body;

        const adminCredentials = {
            username: body.username,
            password: body.password
        }

        try {
            const admin = await accountService.loginAdmin(adminCredentials);
            if (admin) {
                req.session.admin_profile_id = admin.admin_profile_id;
                req.session.profile_id = admin.profile_id;
                req.session.profile_status_id = admin.profile_status_id_fk;
                res.redirect('/admin/homePage');
            } else {
                req.flash("error", "Грешно потребителско име или парола");
                res.redirect("/");
            }
        } catch (error) {
            console.log(error);
            req.flash("error", "Грешно потребителско име или парола");
            res.redirect("/");
        }
    }, showAdminProfile: async (req, res) => {
        try {
            const profileId = req.session.profile_id;
            const profileInfo = await periodService
                .getAdminProfileInfo(profileId);
            console.log(profileInfo);
            res.render("admin/adminProfileInformation", { profileInfo });
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    }
    ,
    // accountController.js

    // Function to show the review schedules form
    showReviewSchedulesForm: async (req, res) => {
        try {
            // Fetch data needed for the form
            const specialties = await accountService.getSpecialties();
            const courses = await accountService.getCourses();
            const groups = await accountService.getGroupNumbers();
            const groupHalves = await accountService.getGroupHalfs();
            const lecturers = await accountService.getLecturers();
            res.render('admin/reviewSchedules', {
                specialties,
                courses,
                groups,
                groupHalves,
                lecturers
            });
        } catch (err) {
            console.error('Error displaying review schedules form: ', err);
            res.status(500).send('Server Error');
        }
    },
    showReviewSubjectHalfsForm: async (req, res) => {
        try {
            // Fetch data needed for the form
            const specialties = await accountService.getSpecialties();
            const courses = await accountService.getCourses();
            const groups = await accountService.getGroupNumbers();
            const groupHalves = await accountService.getGroupHalfs();
            // console.log("specialties", specialties);
            res.render('admin/reviewSubjectsHalfs', {
                specialties,
                courses,
                groups,
                groupHalves
            });
        } catch (err) {
            console.error('Error displaying reviewSubjectHalfs form: ', err);
            res.status(500).send('Server Error');
        }
    },

    // Function to review schedules based on user input
    reviewSchedules: async (req, res) => {
        try {
            const { viewBy, specialty, courseNumber, groupNumber,
                groupHalfLetter, lecturer } = req.body;
            console.log(viewBy, specialty, courseNumber, groupNumber, groupHalfLetter, lecturer);

            if (viewBy === 'group') {
                // Get the group half ID
                const groupHalfIds = await accountService.getGroupHalfId({
                    specialty,
                    courseNumber,
                    groupNumber,
                    groupHalfLetter
                });
                console.log("GroupHalfId:", groupHalfIds);

                // Assuming groupHalfIds is an array, you might need to handle multiple IDs
                if (groupHalfIds.length > 0) {
                    const periods = await accountService.getScheduleByGroup(groupHalfIds[0].group_half_id); // Adjust if necessary
                    console.log("Group Schedule:", periods.length);

                    // Pass periods data to the EJS template
                    res.render('admin/scheduleResults',
                        { periods: JSON.stringify(periods) });
                } else {
                    // // Handle case where no group half IDs are found


                }
            } else if (viewBy === 'lecturer') {
                // Handle lecturer case

                console.log('Lecturer:');
                console.log(lecturer);
                const periods = await accountService.getScheduleByLecturer(lecturer); // Adjust if necessary
                console.log("Lecturer Schedule:", periods.length);

                res.render('admin/scheduleLecturerResults', { periods: JSON.stringify(periods) });
                // res.render('admin/scheduleResults', { schedule: JSON.stringify(schedule) });
            } else {
                res.redirect('/reviewSchedules');
            }
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    },
    ///////////
    reviewHalfSubjects: async (req, res) => {
        try {
            const { specialty, courseNumber, groupNumber, groupHalfLetter } =
                req.body;
            console.log(specialty, courseNumber, groupNumber, groupHalfLetter);


            // Get the group half ID
            const groupHalfId = await accountService.getGroupHalfId({
                specialty,
                courseNumber,
                groupNumber,
                groupHalfLetter
            });
            console.log("GroupHalfId:", groupHalfId);

            // Assuming groupHalfIds is an array, you might need to handle multiple IDs
            if (groupHalfId.length > 0) {
                // const groupHalfId = await accountService.getGroupHalfId(groupHalfInfo);
                const subjects = await periodService.getSubjectsHalf(groupHalfId[0].group_half_id); // Adjust if necessary
                console.log("Group Schedule:", subjects.length);

                // Pass periods data to the EJS template
                res.render('admin/reviewSubjectsResult',
                    { subjects: JSON.stringify(subjects), specialty, courseNumber, groupNumber, groupHalfLetter });
            }
            // res.render('admin/scheduleResults', { schedule: JSON.stringify(schedule) });
            else {
                res.redirect('/reviewSubjectsHalfs');
            }
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    },


    logoutUser: async (req, res) => {
        req.session.destroy();
        res.redirect('/');
    }
}