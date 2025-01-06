const accountService = require('../services/accountService');
const buildingService = require('../services/buildingService');
const periodService = require('../services/periodService');
const session = require('express-session');
const flash = require('connect-flash');
const studentService = require('../services/studentService');
const adminService = require('../services/adminService');
const lecturerService = require('../services/lecturerService');
const subjectService = require('../services/subjectService');

module.exports = {
    // showLoginPage: (req, res) => {
    //     res.render("partials/loginPage")//view/filename
    // },
    showAdminHomePage: (req, res) => {
        res.render("admin/adminHomePage")//view/filename
    },
    getUserInfo: async (req, res) => {
        const { username } = req.body;//view/filename
        console.log(username);
        if (!username) {
            return res.status(400).json({ error: "Не е предоставено потребителско име." });
        }
        try {
            const userInfo = await adminService
                .getUserInfo(username);
            console.log(userInfo);
            res.json({
                fullName: `${userInfo[0].name} ${userInfo[0].surname}`,
                status: userInfo[0].profile_status_name,
            });
        } catch (err) {
            console.error('Грешка на сървъра:', err);
            res.status(500).json({ error: "Възникна грешка при обработката на заявката." });
        }

    },
    getGroupHalfSubjects: async (req, res) => {
        try {
            const groupHalfInfo = {
                specialty: req.body.specialty,
                courseNumber: req.body.courseNumber,
                groupNumber: req.body.groupNumber,
                groupHalfLetter: req.body.groupHalfLetter
            };
            const groupHalfId = await accountService.getGroupHalfId(groupHalfInfo);
            console.log(groupHalfId[0].group_half_id);
            const subjects = await studentService.getSubjectsHalf(groupHalfId[0].group_half_id);
            console.log(subjects);
            res.json(subjects);
        } catch (err) {
            console.error('Грешка на сървъра:', err);
            res.status(500).json({ error: "Възникна грешка при обработката на заявката." });
        }

    },

    showAdminRegister: (req, res) => {
        res.render("admin/adminRegisterForm");
    },
    showAddBuilding: (req, res) => {
        res.render("admin/addBuildingForm");
    },
    showAddSubjectForm: async (req, res) => {
        res.render("admin/addSubjectForm");
    },

    showUpdatePeriodScheduleForm: async (req, res) => {
        const faculties = await accountService.getFaculties();
        res.render("admin/updatePeriodScheduleForm", { faculties });
    },

    showDeletePeriodScheduleForm: async (req, res) => {
        const faculties = await accountService.getFaculties();
        res.render("admin/deletePeriodScheduleForm", { faculties });
    },

    updateSubjectForm: async (req, res) => {
        res.render("admin/updateSubjectForm");
    },
    deleteSubjectForm: async (req, res) => {
        res.render("admin/deleteSubjectForm");
    },
    showAddGroupsForm: async (req, res) => {
        const faculties = await accountService.getFaculties();
        res.render("admin/addGroupsForm", { faculties });
    },
    showUpdateStatusForm: async (req, res) => {
        // const faculties = await adminService.getUserInfo();
        res.render("admin/updateProfileStatusForm");
    },
    showAddSubjectToHalfsForm: async (req, res) => {
        const titles = await accountService.getTitles();
        // const faculties = await accountService.getFaculties();
        // const subjects = await accountService.getSubjects();
        const lecturers = await accountService.getLecturers();
        // console.log(subjects);
        res.render("admin/addSubjectsToHalfsForm", {
            titles,
            lecturers
        }); //view/filename
    },
    showAddPeriodScheduleForm: async (req, res) => {
        const faculties = await accountService.getFaculties();
        res.render("admin/addPeriodScheduleForm", { faculties });
    },
    showAddStudentMarksForm: async (req, res) => {
        const faculties = await accountService.getFaculties();
        console.log(faculties);
        res.render("admin/addStudentMarksForm", { faculties });
    },
    showUpdateMarkForm: async (req, res) => {

        const specialties = await accountService.getSpecialties();
        const courses = await accountService.getCourses();
        const groups = await accountService.getGroupNumbers();
        const groupHalves = await accountService.getGroupHalfs();
        const studentMarksInfo = {
            specialties,
            courses,
            groups,
            groupHalves,
        }//facNums added dynamicaly after geting groupHalfId
        console.log(studentMarksInfo);
        res.render('admin/updateStudentMarkForm', { studentMarksInfo });
    },
    showAdminProfile: async (req, res) => {
        try {
            const profileId = req.session.profile_id;
            const profileInfo = await adminService
                .getAdminProfileInfo(profileId);
            console.log(profileInfo);
            res.render("admin/adminProfileInformation", { profileInfo });
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    }
    ,
    showStudentRegisterForm: async (req, res) => {
        const faculties = await accountService.getFaculties();
        res.render("admin/studentRegistrationForm", { faculties });
    },
    showUpdateSubjectToHalfsForm: async (req, res) => {
        const specialties = await accountService.getSpecialties();
        const courses = await accountService.getCourses();
        const groups = await accountService.getGroupNumbers();
        const groupHalves = await accountService.getGroupHalfs();
        // console.log("specialties", specialties);
        res.render("admin/updateSubjectToHalfsForm", {
            specialties,
            courses,
            groups,
            groupHalves
        });
    },
    showLecturerRegisterForm: async (req, res) => {
        const faculties = await accountService.getFaculties();
        const titles = await accountService.getTitles();
        res.render("admin/lecturerRegistrationForm", { faculties, titles });
    },
    showAdminRegisterForm: async (req, res) => {
        res.render("admin/adminRegistrationForm");
    },
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
            console.error('Error displaying review schedulreviewScheduleses form: ', err);
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

    showCurriculums: async (req, res) => {
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
                res.redirect('admin/review/subjectsHalf');
            }
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    },
    showLecturersConsultations: async (req, res) => {
        try {
            const allConsultations = await adminService.getLecturersConsultations();
            res.render("admin/reviewLecturerConsultations", { allConsultations });
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },
    showDeleteSubjectToHalfsForm: async (req, res) => {
        try {
            const titles = await accountService.getTitles();
            const lecturers = await accountService.getLecturers();
            res.render("admin/deleteSubjectToHalfsForm", { titles, lecturers });
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },
    showDeleteMarkForm: async (req, res) => {
        try {
            const specialties = await accountService.getSpecialties();
            const courses = await accountService.getCourses();
            const groups = await accountService.getGroupNumbers();
            const groupHalves = await accountService.getGroupHalfs();
            const studentMarksInfo = {
                specialties,
                courses,
                groups,
                groupHalves,
            }

            res.render("admin/deleteMarkForm", { studentMarksInfo });
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },
    searchConsultations: async (req, res) => {
        try {
            const body = req.body;
            const consultations = await adminService.searchConsultations(body.consultationSearch);
            res.json(consultations);
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },
    searchCurriculums: async (req, res) => {
        try {
            const body = req.body;
            const curriculums = await adminService.searchCurriculums(body.curriculumsSearch);
            res.json(curriculums);
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
            }//facNums added dynamicaly after geting groupHalfId
            console.log(studentMarksInfo);
            res.render('admin/reviewStudentMarks', { studentMarksInfo });

        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },
    resultStudentMarks: async (req, res) => {
        try {
            const { specialty, courseNumber, groupNumber, groupHalfLetter,
                facultyNumbersSelect } = req.body;
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
    createGroups: async (req, res) => {
        const groupsBody = req.body;
        const groupsInformation = {
            specialty: groupsBody.selectSpecialty
        }
        console.log(groupsInformation);
        res.redirect("/admin/add/groups");
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
    getTitles: async (req, res) => {//controller name
        try {
            const titles = await accountService.getTitles();//service name
            // console.log(specialties);
            res.json(titles);
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },
    getLecturers: async (req, res) => {
        try {
            const lecturers = await accountService.getLecturers();
            res.json(lecturers);
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
    }, getGroupHalfSubjectId: async (req, res) => {
        try {
            const { selectSubject, selectGroupHalf } = req.body;
            console.log("selectSubjectId", selectSubject);
            console.log("selectGroupHalf", selectGroupHalf);
            console.log("Body: ", req.body);

            const groupHalfSubjectInformation = {
                selectSubject,
                selectGroupHalf
            };
            console.log("groupHalfSubjectInformation: ", groupHalfSubjectInformation);

            const groupHalfSubjectID = await periodService.getGroupHalfSubjectId(groupHalfSubjectInformation);
            res.json(groupHalfSubjectID);
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    }, getCourseNumber: async (req, res) => {
        try {
            const { specialty } = req.body;
            console.log("specialty", specialty);
            const courseNumbersSpecialty = await periodService.getCourseNumberSpecialty(specialty);
            res.json(courseNumbersSpecialty);
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },
    getWeekdays: async (req, res) => {
        try {
            // await subjectService.addSubject(subjectInformation);
            const weekdays = await periodService.getWeekdays();
            console.log(weekdays);
            res.json(weekdays);
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },
    getRooms: async (req, res) => {
        try {
            const rooms = await periodService.getRooms();
            console.log(rooms);
            res.json(rooms);
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },
    // getLecturers: async (req, res) => {
    //     try {
    //         const lecturers = await periodService.getLecturers();
    //         res.json(lecturers);
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).send("Internal Server Error");
    //     }
    // },
    getPeriodTypes: async (req, res) => {
        try {
            const periodTypes = await periodService.getPeriodTypes();
            res.json(periodTypes);
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },
    getPeriod: async (req, res) => {
        try {
            const body = req.body;
            const periodInformation = {
                groupHalfSubjectId: body.groupHalfSubjectId,
                periodType: body.periodType,
            }
            const period = await periodService.getPeriod(periodInformation);
            if (!period) {

                res.redirect("/admin/update/periodSchedule");
                req.flash("error", "Не съществува такъв час");
            }
            res.json(period);
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },
    getMarks: async (req, res) => {
        try {
            const marks = await studentService.getMarks();
            res.json(marks);
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
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
    // getFacultyNumbers: async (req, res) => {
    //     try {
    //         const { specialty, courseNumber, groupNumber, groupHalfLetter } = req.body;
    //         console.log('Specialty:', specialty);
    //         console.log('Course Number:', courseNumber);
    //         console.log('Group Number:', groupNumber);
    //         console.log('Group Half Letter:', groupHalfLetter);

    //         const groupHalfId = await accountService.getGroupHalfId({
    //             specialty,
    //             courseNumber,
    //             groupNumber,
    //             groupHalfLetter
    //         });
    //         const fac_nums = await studentService.getFacNums(groupHalfId);
    //         res.json(fac_nums);
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).send("Internal Server Error");
    //     }
    // },

    getFacultyNumbers: async (req, res) => {
        try {
            const fac_nums = await studentService.getFacNums(req.body.groupHalfId);
            res.json(fac_nums);
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },
    getFacultyNumbers1: async (req, res) => {
        try {
            const groupHalfInfo = {
                specialty: req.body.specialty,
                courseNumber: req.body.courseNumber,
                groupNumber: req.body.groupNumber,
                groupHalfLetter: req.body.groupHalfLetter
            };
            const groupHalfId = await accountService.getGroupHalfId(groupHalfInfo);
            console.log(groupHalfId[0].group_half_id);
            const fac_nums = await studentService.getFacNums(groupHalfId[0].group_half_id);
            console.log(fac_nums);
            res.json(fac_nums);
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },
    addBuilding: async (req, res) => {
        try {
            const buildingName = req.body.buildingName;
            if (buildingName != "") {
                await buildingService.addBuilding(buildingName);
                res.redirect("/admin/add/building");//temporary redirecting after a successful adding of a building
                req.flash("success", "Успешно добавяне на сграда!");
            } else {
                res.redirect("/admin/add/building");
                req.flash("error", "Не може да се добави сграда без име!");
            }
        } catch (error) {
            console.log(error);
            req.flash("error", "Неуспешно добавяне на сграда!");
            res.redirect("/admin/add/building");
        }

    }, addSubjectName: async (req, res) => {
        const body = req.body;
        try {
            const subjectInformation = {
                subjectName: body.subjectName,
                subjectAbbreviation: body.subjectAbbreviation,
                specialtyId: body.selectSpecialty
            }
            console.log("Body: ", body);
            console.log("Subject information: ", subjectInformation);

            // Ако предметът съществува, покажете съобщение за грешка


            await subjectService.addSubjectName(subjectInformation);
            res.redirect("/admin/add/subjectToHalfs");
        } catch (error) {
            console.log(error);
            req.flash('error', 'Моля въведете уникално име и абревиатура за предмета в дадената специалност.');
            res.redirect('/admin/add/subject');
        }
    }, updateSubjectName: async (req, res) => {
        const body = req.body;
        try {
            // Assuming body contains an array of updated subjects
            // const updatedSubjects = body.row;

            // Loop through each subject and update them
            const subjectInformation = {
                oldName: body.oldName,
                newName: body.newName,
                newAbbreviation: body.newAbbreviation
            };
            console.log("Subject info: ", subjectInformation);

            // Call the service to update the subject
            await subjectService.updateSubjectName(subjectInformation);


            // After all updates are done, redirect to the subject update page
            res.redirect("/admin/update/subject");
        } catch (error) {
            console.error("Error in updating subject names:", error);
            res.status(500).send("Error updating subjects");
        }
    },
    updateStatus: async (req, res) => {

        try {
            const { username, status } = req.body;
            const profileId = req.session.profile_id;

            // Define mapping of user types to tables

            // Validate inputs
            if (!username || !status) {
                return res.status(400).send("Всички полета са задължителни.");
            }
            console.log(username, status);
            // Check if user type is valid


            // For admins, ensure only the main admin can update admin statuses
            if (profileId !== 13) {
                return res.status(403).send("Нямате права за промяна на статус на главен администратор.");
            }
            const profileInformation = {
                status,
                username
            }
            const result = await adminService.updateStatus(profileInformation);

            if (result.affectedRows === 0) {
                return res.status(404).send("Потребителят не е намерен.");
            }

            // Send success response
            req.flash("success", "Успешно променен статус");
            res.redirect("/admin/update/status?success=true");

        } catch (error) {
            console.error("Error updating user status:", error);
            req.flash("error", "Неуспешно променен статус");
            res.status(500).send("Възникна грешка при промяната на статуса.");

        }
    },

    // Assuming body contains an array of updated subjects
    // const updatedSubjects = body.row;

    // Loop through each subject and update them

    searchSubject: async (req, res) => {
        try {
            const { subjectSearch } = req.body;  // Extract the subject name from the body
            console.log("Searching for subject:", subjectSearch);

            // Perform the search (this is just an example; adjust to your logic)
            const subjects = await adminService.searchSubjects(subjectSearch);
            console.log("Found subjects:", subjects);

            // Return a JSON response
            res.json({ subjects: subjects });
        } catch (error) {
            console.error("Error fetching subjects:", error);
            res.status(500).send("Internal Server Error");
        }
    },

    searchSubjectSpecialty: async (req, res) => {
        try {
            const { subjectSearch } = req.body;  // Extract the specialty ID from the request body
            console.log("Fetching subjects for specialty ID:", subjectSearch);

            // Assuming you have a service function that retrieves subjects by specialty ID
            const subjects = await adminService.searchSubjectsSpecialty(subjectSearch);

            console.log("Found subjects:", subjects);

            // Return the subjects in JSON format
            res.json({ subjects });
        } catch (error) {
            console.error("Error fetching subjects:", error);
            res.status(500).send("Internal Server Error");
        }
    },



    deleteSubjectName: async (req, res) => {
        const body = req.body;
        console.log("Request Body:", body);  // For debugging

        try {
            // Make sure that the subject name is sent
            if (!body.subjectName || !body.subjectAbbreviation || !body.subjectId) {
                throw new Error("No subject selected.");
            }

            const subjectInformation = {
                subjectName: body.subjectName,
                subjectAbbreviation: body.subjectAbbreviation,
                specialtyId: body.specialtyId
            };

            console.log("Subject Information:", subjectInformation);  // For debugging

            // Call the service to delete the subject
            await subjectService.deleteSubjectName(subjectInformation);

            req.flash('success', 'Предметът е изтрит успешно.');
            res.redirect("/admin/delete/subject");
        } catch (error) {
            console.error("Error deleting subject:", error);
            req.flash('error', error.message || 'Неуспешно изтриване на предмет.');
            res.redirect('/admin/delete/subject');
        }
    },


    addSubject: async (req, res) => {
        const body = req.body;
        try {
            const subjectInformation = {

                department: body.selectDepartment,
                specialty: body.selectSpecialty,
                subjectAbbreviation: body.selectSubject,
                semNumber: body.selectCourse,
                groupHalfId: body.selectGroupHalf,//groupHalfId
                lecturerId: body.selectLecturer,
                periodTypeId: body.selectPeriodType
            }
            console.log("Body: ", body);
            console.log("Subject information: ", subjectInformation);
            await subjectService.addSubjectToGroup(subjectInformation);
            res.redirect("/admin/add/subjectToHalfs");
        } catch (error) {
            console.log(error);
        }
    },
    addSubjectToHalfs: async (req, res) => {
        const body = req.body;

        try {
            const subjectInformation = {
                specialtyId: body.specialtyId,
                subjectId: body.subjectId,
                semNumber: body.selectCourse,
                groupHalfId: body.selectGroupHalf,
                lecturerId: body.selectLecturer,
                periodTypeId: body.selectPeriodType,
            };

            console.log("Body: ", body);
            console.log("Subject information: ", subjectInformation);

            // Check if the subject is already added
            const [subjectAddedToLecturer, subjectAddedToHalf] = await Promise.all([
                subjectService.checkIfSubjectIsAddedToLecturer(subjectInformation),
                subjectService.checkIfSubjectIsAddedToGroupHalf(subjectInformation),
            ]);

            if (!subjectAddedToHalf || !subjectAddedToLecturer) {
                await subjectService.addSubjectToGroup(subjectInformation);
                req.flash('success', 'Успешно добавен предмет.');
            } else if (subjectAddedToHalf && subjectAddedToLecturer) {
                req.flash('error', 'Предметът вече е добавен за избраната група и преподавател.');
            }

            res.redirect("/admin/add/subjectToHalfs");
        } catch (error) {
            console.error("Error in addSubjectToHalfs: ", error);
            req.flash('error', 'Възникна грешка. Моля, опитайте отново.');
            res.redirect("/admin/add/subjectToHalfs");
        }
    },


    addPeriod: async (req, res) => {
        try {
            // Prepare the periodInformation object, now including the groupHalfSubjectId
            const periodInformation = {
                period_start_time, period_end_time,
                weekday, room, lecturer, selectSubject,
                period_type, selectGroupHalf

            } = req.body;
            console.log("controller periodInformation: ", periodInformation)
            const periodExists = await periodService.checkIfPeriodExists(periodInformation);
            if (periodExists) {
                req.flash('error', '"Часът вече съществува.');
                return res.redirect("/admin/add/periodSchedule");
            }
            // Log the final periodInformation object (for debugging purposes)
            // console.log("Period information: ", periodInformation);

            // Call the service to add the period
            await periodService.addPeriod(periodInformation);
            req.flash('success', 'Часът е добавен успешно.');
            // Redirect to the period schedule page after successful addition
            res.redirect("/admin/add/periodSchedule");
        } catch (error) {
            // Log any errors that occur during the process
            console.error(error);

            // Send a 500 status code indicating an internal server error
            res.status(500).send("Internal Server Error");
        }
    },


    updatePeriod: async (req, res) => {
        try {

            const periodInformation = {
                period_start_time, period_end_time,
                weekday, room, lecturer, selectSubject,
                period_type, selectGroupHalf
            } = req.body;
            await periodService.deletePeriod(periodInformation);
            req.flash('success', 'Часът е изтрит успешно.');
            // Redirect to the period schedule page after successful addition
            res.redirect("/admin/delete/periodSchedule");
        } catch (error) {
            req.flash('error', 'Възникна грешка. Моля опитайте отново');
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },
    deletePeriod: async (req, res) => {
        try {
            // Extract and validate input from request body
            const { selectSubject, period_type, selectGroupHalf } = req.body;

            const periodInformation = {
                selectSubject,
                period_type,
                selectGroupHalf
            };

            // Check if the period exists
            const periodExists = await periodService.checkIfPeriodExists(periodInformation);
            if (!periodExists) {
                req.flash('error', 'Не съществува такъв час.');
                return res.redirect("/admin/add/periodSchedule");
            }

            // Delete the period
            await periodService.deletePeriod(periodInformation);

            // Success feedback and redirection
            req.flash('success', 'Часът е изтрит успешно.');
            res.redirect("/admin/add/periodSchedule");
        } catch (error) {
            // Log and handle errors
            console.error("Error in deletePeriod:", error);
            req.flash('error', 'Възникна грешка. Моля опитайте отново.');
            res.status(500).send("Internal Server Error");
        }
    },

    addMark: async (req, res) => {
        try {
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
            res.redirect("/admin/homePage");
        } catch (error) {
            // Log any errors that occur during the process

            console.error(error);
            res.redirect("/admin/homePage");
            // Send a 500 status code indicating an internal server error
            res.status(500).send("Internal Server Error");
        }
    }
    , updateMark: async (req, res) => {
        try {
            const body = req.body;
            markInformation = {
                semester: body.courseNumber,
                groupNumber: body.groupNumber,
                groupHalf: body.groupHalfLetter,
                subject: body.subjectSelect,//subject id
                facNum: body.facultyNumbersSelect,
                mark: body.markSelect
            }
            console.log("Mark information: ", markInformation);
            await studentService.updateMark(markInformation);

            req.flash('success', 'Оценката е променена успешно.');
            const facNum = body.facultyNumbersSelect;
            console.log(facNum);
            const studentProfileId =
                await studentService.getStudentProfileId(facNum);
            console.log("studentProfileId", studentProfileId);
            const marks = await studentService.getStudentMarks(studentProfileId[0].student_profile_id);
            console.log(marks);
            res.redirect('/admin/review/studentMarks');
            // res.redirect("/admin/homePage");
        } catch (error) {
            // Log any errors that occur during the process

            console.error(error);
            req.flash('error', 'Неуспешна промяна на оценка. Опитайте отново.');
            res.redirect("/admin/homePage");
            // Send a 500 status code indicating an internal server error
            // res.status(500).send("Internal Server Error");
        }
    },
    deleteMark: async (req, res) => {
        try {
            const body = req.body;
            markInformation = {
                semester: body.courseNumber,
                groupNumber: body.groupNumber,
                groupHalf: body.groupHalfLetter,
                subject: body.subjectSelect,//subject id
                facNum: body.facultyNumbersSelect,
            }
            console.log("Mark information: ", markInformation);

            const markExists = await studentService.checkIfMarkExists(markInformation);
            console.log(markExists);
            if (!markExists) {
                req.flash('error', 'Mark does not exist.');
                return res.redirect('/admin/review/studentMarks');
            }
            await studentService.deleteMark(markInformation);

            req.flash('success', 'Оценката е изтрита успешно.');
            const facNum = body.facultyNumbersSelect;

            console.log(facNum);
            const studentProfileId =
                await studentService.getStudentProfileId(facNum);
            console.log("studentProfileId", studentProfileId);
            const marks = await studentService.getStudentMarks(studentProfileId[0].student_profile_id);
            console.log(marks);
            res.redirect('/admin/review/studentMarks');

            // res.redirect("/admin/homePage");
        } catch (error) {
            // Log any errors that occur during the process

            console.error(error);
            req.flash('error', 'Неуспешно изтриване на оценка. Опитайте отново.');
            // Send a 500 status code indicating an internal server error
            res.status(500).send("Internal Server Error");
        }
    },
    updateSubjectToHalfs: async (req, res) => {
        try {
            const body = req.body;
            subjectInformation = {
                specialtyId: body.specialtyId,
                semesterNum: body.selectCourse,
                groupHalfId: body.selectGroupHalf,
                subjectId: body.selectSubject,
                periodTypeId: body.selectPeriodType,
                lecturerId: body.selectLecturer
            }
            console.log("Subject information: ", subjectInformation);
            await subjectService.updateSubjectHalfLecturer(subjectInformation);
            req.flash('success', 'Успешна промяна на преподавател за половинка.');
            res.redirect("/admin/update/subjectToHalfs");
            // res.redirect("/admin/homePage");
        } catch (error) {
            console.error(error);
            req.flash('error', 'Неуспешна промяна на преподавател за половинка. Опитайте отново.');
            res.redirect("/admin/homePage");
        }
    },
    deleteSubjectToHalfs: async (req, res) => {
        try {
            const body = req.body;
            subjectInformation = {
                specialtyId: body.specialtyId,
                semesterNum: body.selectCourse,
                groupHalfId: body.selectGroupHalf,
                subjectId: body.selectSubject,
                periodTypeId: body.selectPeriodType,
            }
            console.log("Subject information: ", subjectInformation);
            await subjectService.deleteSubjectToHalf(subjectInformation);
            req.flash('success', 'Успешно изтриване на предмет за половинка.');
            res.redirect("/admin/delete/subjectToHalfs");
            // res.redirect("/admin/homePage");
        } catch (error) {
            console.error(error);
            req.flash('error', 'Неуспешно изтриване на предмет за половинка. Опитайте отново.');
            res.redirect("/admin/homePage");
        }
    },



}