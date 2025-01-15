const bcrypt = require('bcrypt');
const periodRepository = require('../database/repositories/periodRepository');

module.exports = {
    getWeekdays: async () => {
        return await periodRepository.getWeekdays();;
    },
    getRooms: async () => {
        console.log("INSIDE SERVICE FOR ROOMS");
        return await periodRepository.getRooms();
    },
    getPeriod: async (periodInformation) => {
        return await periodRepository.getPeriod(periodInformation);
    },
    checkIfPeriodExists: async (periodInformation) => {
        return await periodRepository.checkIfPeriodExists(periodInformation);
    },
    //    getLecturers: async () => {
    //         return await periodRepository.getLecturers();
    //     }, 
    getPeriodsForStudent: async (studentProfileId) => {
        return await periodRepository.getPeriodsForStudent(studentProfileId);
    },
    getPeriodsForLecturer: async (profileId) => {
        return await periodRepository.getPeriodsForLecturer(profileId);
    },
    getStudentGroupAndHalf: async (studentProfileId) => {
        return await periodRepository.getStudentGroupAndHalf(studentProfileId);
    },
    getGroupHalfs: async (specialty_id, course) => {//,
        return await periodRepository.getGroupHalfs(specialty_id, course);//,courseNumber
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
        // const checkIfStartTimeEarlier = periodRepository.checkIfStartTimeEarlier(periodInformation);
        const startTime=periodInformation.period_start_time;
        const endTime=periodInformation.period_end_time;
        const start = new Date(`1970-01-01T${startTime}:00`);
        const end = new Date(`1970-01-01T${endTime}:00`);
        if(start>end){
        throw new Error("Start time is bigger");
        }
        else{
            if (periodInformation.periodType === '1') {//in a lecture more than 1 group share lecturer and room
                isAvailabile = await periodRepository.checkAvailabilityLecture(periodInformation);
                console.log("Лекцията е свободна!", isAvailabile);
            } else {
                isAvailabile = await periodRepository.checkAvailabilityExcercise(periodInformation);
                console.log("Упражнението е свободно!", isAvailabile);
            } if (isAvailabile) {
                return await periodRepository.addPeriod(periodInformation);
            }
        }
      
    },
    updatePeriod: async (periodInformation) => {
        let isAvailabile;
        if (periodInformation.periodType === '1') {//in a lecture more than 1 group share lecturer and room
            isAvailabile = await periodRepository.checkAvailabilityLecture(periodInformation);
            console.log("Лекцията е свободна!", isAvailabile);
        } else {
            isAvailabile = await periodRepository.checkAvailabilityExcercise(periodInformation);
            console.log("Упражнението е свободно!", isAvailabile);
        } if (isAvailabile) {
            return await periodRepository.updatePeriod(periodInformation);
        }
    },
    deletePeriod: async (periodInformation) => {
        return await periodRepository.deletePeriod(periodInformation);
    },

    getStudentProfileInfo: async (studentProfileId) => {
        return await periodRepository.getStudentProfileInfo(studentProfileId);
    },
    getLecturerProfileInfo: async (lecturerProfileId) => {
        return await periodRepository.getLecturerProfileInfo(lecturerProfileId);
    },
    // getStudentLecturers:async(studentProfileId)=>{
    //     return await periodRepository.getStudentLecturers(studentProfileId);
    // }
    // getAdminProfileInfo: async (profileId) => {
    //     return await periodRepository.getAdminProfileInfo(profileId);
    // },

}