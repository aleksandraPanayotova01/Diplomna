const bcrypt = require('bcrypt');
const accountRepository = require('../database/repositories/accountRepository');

module.exports = {
    loginStudent: async (userCredentials) => {
        const user = await accountRepository.getStudentProfile(userCredentials.username);
        if (user) {
            const checkPassword = await bcrypt.compare(userCredentials.password, user.profile_password);
            if (checkPassword != "") {
                return user;
            }
        }
        return false;

    },
    registerStudent: async (userInformation) => {
        const checkIfUserExists = await accountRepository.checkIfUserExists(userInformation.username);
        if (!checkIfUserExists) {
            if (userInformation.password == userInformation.passwordRepeat) {
                const regexUsername = /^[A-Za-z0-9_-]+$/;
                const regexPassword = /^.{8,}$/;

                if (regexUsername.test(userInformation.username) && regexPassword.test(userInformation.password)) {
                    userInformation.password = await bcrypt.hash(userInformation.password, 12);//hashing the password
                    userInformation.egn = await bcrypt.hash(userInformation.egn, 12);//hashing the student egn

                    // console.log(userInformation);
                    const user = await accountRepository.createStudentProfile(userInformation);

                    return user;
                } else {
                    return "False regex";
                }
            } else {
                return "Password does not match";
            }
        } else {
            return "Username and password taken";
        }
    }, loginLecturer: async (userCredentials) => {
        const user = await accountRepository.getLecturerProfile(userCredentials.username);
        if (user) {
            const checkPassword = await bcrypt.compare(userCredentials.password, user.profile_password);
            if (checkPassword != "") {
                return user;
            }
        }
        return false;

    },
    registerLecturer: async (userInformation) => {
        const checkIfUserExists = await accountRepository.checkIfUserExists(userInformation.username);
        if (!checkIfUserExists) {
            if (userInformation.password == userInformation.passwordRepeat) {
                const regexUsername = /^[A-Za-z0-9_-]+$/;
                const regexPassword = /^.{8,}$/;

                if (regexUsername.test(userInformation.username) && regexPassword.test(userInformation.password)) {
                    userInformation.password = await bcrypt.hash(userInformation.password, 12);//hashing the password
                    userInformation.egn = await bcrypt.hash(userInformation.egn, 12);//hashing the lecturer egn

                    const user = await accountRepository.createLecturerProfile(userInformation);
                    return user;
                } else {
                    return "False regex";
                }
            } else {
                return "Password does not match";
            }
        } else {
            return "Username and password taken";
        }
    }, loginAdmin: async (adminCredentials) => {
        const admin = await accountRepository.getAdminProfile(adminCredentials.username);
        if (admin) {
            const checkPassword = await bcrypt.compare(adminCredentials.password, admin.profile_password);
            if (checkPassword != "") {
                return admin;
            }
        }
        return false;

    },
    registerAdmin: async (adminInformation) => {
        const checkIfUserExists = await accountRepository.checkIfUserExists(adminInformation.username);
        if (!checkIfUserExists) {
            if (adminInformation.password == adminInformation.passwordRepeat) {
                const regexUsername = /^[A-Za-z0-9_-]+$/;
                const regexPassword = /^.{8,}$/;
                if (regexUsername.test(adminInformation.username) && regexPassword.test(adminInformation.password)) {
                    adminInformation.password = await bcrypt.hash(adminInformation.password, 12);
                    const admin = await accountRepository.createAdminProfile(adminInformation);
                    return admin;
                } else {
                    return "False regex";
                }
            } else {
                return "Password does not match";
            }
        } else {
            return "Username and password taken";
        }
    },

    getStudents: async () => {
        return await accountRepository.getStudents();
    },
    getFaculties: async () => {
        return await accountRepository.getFaculties();
    },
    getDepartments: async () => {
        return await accountRepository.getDepartments();
    },
    getSpecialties: async () => {
        return await accountRepository.getSpecialties();
    },
    getTitles: async () => {
        return await accountRepository.getTitles();
    },
    getGroups: async () => {
        return await accountRepository.getGroups();
    },
    getGroupNumbers: async () => {
        return await accountRepository.getGroupNumbers();
    },
    getGroupHalfs: async () => {
        return await accountRepository.getGroupHalfs();
    },
    getCourses: async () => {
        return await accountRepository.getCourses();
    },
    getSubjects: async () => {
        return await accountRepository.getSubjects();
    },
    getLecturers: async () => {
        return await accountRepository.getLecturers();
    },
    getAdminProfileInfo:async(profileId)=>{
        return await accountRepository.getAdminProfileInfo(profileId);
    },
    getScheduleByGroup: async (groupHalfId) => {
        return await accountRepository.getScheduleByGroup(groupHalfId);
    },
    getScheduleByLecturer: async (lecturer) => {
        return await accountRepository.getScheduleByLecturer(lecturer);
      
    },
    getGroupHalfId: async (groupHalfInfo)=> 
        {
            return await accountRepository.getGroupHalfId(groupHalfInfo); 
        }, 
    
    



}