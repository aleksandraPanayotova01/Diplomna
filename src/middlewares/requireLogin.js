
module.exports.checkIfLecturerIsLogged = (req, res, next) => {
    if (!req.session.lecturer_profile_id) {
        req.session.destroy();
        return res.redirect('/');
    }

    next();
}

module.exports.checkIfStudentIsLogged = (req, res, next) => {
    if (!req.session.student_profile_id) {
        req.session.destroy();
        return res.redirect('/');
    }

    next();
}

module.exports.checkIfAdminIsLogged = (req, res, next) => {
    if (!req.session.admin_profile_id) {
        req.session.destroy();
        return res.redirect('/');
    }

    next();
}