const accountService = require('../services/accountService');
const periodService = require('../services/periodService');
module.exports = {
    showLoginPage: (req, res) => {
        res.render("partials/loginPage")//view/filename
    },
    showAdminLogin: (req, res) => {
        res.render("admin/adminLoginForm");
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
    },

    logoutUser: async (req, res) => {
        req.session.destroy();
        res.redirect('/');
    }
}