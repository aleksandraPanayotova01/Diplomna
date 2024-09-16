const bcrypt = require('bcrypt');
const periodRepository = require('../database/repositories/periodRepository');
module.exports = {
    getWeekdays: async () => {
        return await periodRepository.getWeekdays();;
    },
    getRooms: async () => {
        return await periodRepository.getRooms();
    },
    getLecturers: async () => {
        return await periodRepository.getLecturers();
    },
    getPeriodsForStudent: async (studentProfileId) => {
        return await periodRepository.getPeriodsForStudent(studentProfileId);
    },
    getPeriodsForLecturer: async (profileId) => {
        return await periodRepository.getPeriodsForLecturer(profileId);
    },
    getStudentGroupAndHalf: async (studentProfileId) => {
        return await periodRepository.getStudentGroupAndHalf(studentProfileId);
    },
    getGroupHalfs: async (groupSpecialtyName, courseNumber) => {//,
        return await periodRepository.getGroupHalfs(groupSpecialtyName, courseNumber);//,courseNumber
    },
    getSubjectsHalf: async (groupHalfId) => {
        return await periodRepository.getSubjectsHalf(groupHalfId);
    },
    // getSubjectsHalf1: async (groupHalfId) => {
    //     return await periodRepository.getSubjectsHalf(groupHalfId);
    // },
    getPeriodTypes: async () => {
        return await periodRepository.getPeriodTypes();
    },
    getGroupHalfSubjectId: async (groupHalfSubjectInformation) => {
        return await periodRepository.getGroupHalfSubjectId(groupHalfSubjectInformation);
    },
    getCourseNumberSpecialty: async (specialty) => {
        return await periodRepository.getCourseNumberSpecialty(specialty);
    },
    addPeriod: async (periodInformation) => {
        let isAvailabile;
        if (periodInformation.periodType === '1') {//in a lecture more than 1 group share lecturer and room
            isAvailabile = await periodRepository.checkAvailabilityLecture(periodInformation);
            console.log("Лекцията е свободна!", isAvailabile);
        } else {
            isAvailabile = await periodRepository.checkAvailabilityExcercise(periodInformation);
            console.log("Упражнението е свободно!", isAvailabile);
        } if (isAvailabile) {
            return await periodRepository.addPeriod(periodInformation);
        }
    },
    getStudentProfileInfo: async (studentProfileId) => {
        return await periodRepository.getStudentProfileInfo(studentProfileId);
    },
    getLecturerProfileInfo: async (lecturerProfileId) => {
        return await periodRepository.getLecturerProfileInfo(lecturerProfileId);
    },
    // getAdminProfileInfo: async (profileId) => {
    //     return await periodRepository.getAdminProfileInfo(profileId);
    // },

}