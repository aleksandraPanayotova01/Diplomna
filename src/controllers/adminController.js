const accountService = require('../services/accountService');
const buildingService = require('../services/buildingService');
const periodService = require('../services/periodService');
const session = require('express-session');
const flash = require('connect-flash');
const studentService = require('../services/studentService');
const lecturerService = require('../services/lecturerService');
const subjectService = require('../services/subjectService');

module.exports = {
    // showLoginPage: (req, res) => {
    //     res.render("partials/loginPage")//view/filename
    // },
    showAdminHomePage: (req, res) => {
        res.render("admin/adminHomePage")//view/filename
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
    showAddGroupsForm: async (req, res) => {
        const faculties = await accountService.getFaculties();
        res.render("admin/addGroupsForm", { faculties });
    },
    showAddSubjectToHalfsForm: async (req, res) => {
        const titles = await accountService.getTitles();
        const faculties = await accountService.getFaculties();
        const subjects = await accountService.getSubjects();
        const lecturers = await accountService.getLecturers();
        res.render("admin/addSubjectsToHalfsForm", {
            titles, faculties, subjects,
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
            const lecturers = await periodService.getLecturers();
            res.json(lecturers);
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },
    getGroupHalfs: async (req, res) => {
        try {
            // const {specialty}=req.params;
            const groupSpecialtyName = req.body;
            console.log(groupSpecialtyName);
            // const courseNumber = req.body;
            console.log(groupSpecialtyName);
            const groupHalfs =
                await periodService.getGroupHalfs(groupSpecialtyName.specialty,
                    groupSpecialtyName.course
                );// ,courseNumber.courseNumber
            res.json(groupHalfs);
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    }, getSubjectsHalf: async (req, res) => {
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
            res.json(weekdays);
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },
    getRooms: async (req, res) => {
        try {
            const rooms = await periodService.getRooms();
            res.json(rooms);
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },
    getLecturers: async (req, res) => {
        try {
            const lecturers = await periodService.getLecturers();
            res.json(lecturers);
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },
    getPeriodTypes: async (req, res) => {
        try {
            const periodTypes = await periodService.getPeriodTypes();
            res.json(periodTypes);
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

    },addSubjectName: async (req, res) => {
        const body = req.body;
        try {
            const subjectInformation = {
                subjectName:body.subjectName,
                subjectAbbreviation:body.subjectAbbreviation
            }
            console.log("Body: ", body);
            console.log("Subject information: ", subjectInformation);
            await subjectService.addSubjectName(subjectInformation);
            res.redirect("/admin/add/subjectToHalfs");
        } catch (error) {
            console.log(error);
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
    }, addPeriod: async (req, res) => {
        try {
            // Destructure the necessary values from the request body
            const { period_start_time, period_end_time,
                weekday, room, lecturer, selectSubject,
                period_type, selectGroupHalf } = req.body;

            // Log the incoming request body (for debugging purposes)


            // Prepare the information needed to get the groupHalfSubjectId
            const groupHalfSubjectInformation = {
                selectSubject,
                selectGroupHalf
            };

            // Call the getGroupHalfSubjectId function to retrieve the groupHalfSubjectId
            const groupHalfSubjectIdResult = await periodService.getGroupHalfSubjectId(groupHalfSubjectInformation);

            // Extract the groupHalfSubjectId from the result
            const groupHalfSubjectId = groupHalfSubjectIdResult[0]?.group_half_subject_id; // Adjust based on the structure of your result

            if (!groupHalfSubjectId) {
                throw new Error("groupHalfSubjectId not found");
            }

            // Log the groupHalfSubjectId (for debugging purposes)
            // console.log("Body: ", req.body);
            // console.log("groupHalfSubjectId: ", groupHalfSubjectId);

            // Prepare the periodInformation object, now including the groupHalfSubjectId
            const periodInformation = {
                period_start_time,
                period_end_time,
                weekday,
                room,
                lecturer,
                group_half_subject_id_fk: groupHalfSubjectId, // Use the correct field name in your table
                period_type,
                groupHalfId: selectGroupHalf

            };

            // Log the final periodInformation object (for debugging purposes)
            // console.log("Period information: ", periodInformation);

            // Call the service to add the period
            await periodService.addPeriod(periodInformation);

            // Redirect to the period schedule page after successful addition
            res.redirect("/admin/add/periodSchedule");
        } catch (error) {
            // Log any errors that occur during the process
            console.error(error);

            // Send a 500 status code indicating an internal server error
            res.status(500).send("Internal Server Error");
        }
    }, addMark: async (req, res) => {
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


}