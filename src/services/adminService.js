const bcrypt = require('bcrypt');
const adminRepository = require('../database/repositories/adminRepository');
module.exports = {
    getAdminProfileInfo: async (profileId) => {
        return await adminRepository.getAdminProfileInfo(profileId);
    },
    getFaculties: async () => {
        return await adminRepository.getFaculties();
    },
    registerStudent: async (userInformation) => {
        const checkIfUserExists = await adminRepository.checkIfUserExists(userInformation.username);
        if (!checkIfUserExists) {
            if (userInformation.password == userInformation.passwordRepeat) {
                const regexUsername = /^[A-Za-z0-9_-]+$/;
                const regexPassword = /^.{8,}$/;

                if (regexUsername.test(userInformation.username) && regexPassword.test(userInformation.password)) {
                    userInformation.password = await bcrypt.hash(userInformation.password, 12);//hashing the password
                    userInformation.egn = await bcrypt.hash(userInformation.egn, 12);//hashing the student egn

                    // console.log(userInformation);
                    const user = await adminRepository.createStudentProfile(userInformation);

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
    },
}