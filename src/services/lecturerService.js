const lecturerRepository = require('../database/repositories/lecturerRepository');
module.exports = {
    addLecturer: async (lecturerInformation) => {
        const lecturer = await lecturerRepository.createLecturer(lecturerInformation);
        return lecturer;
    }, addConsultation: async (consultationInformation) => {
        const startTime = consultationInformation.consultationStart;
        const endTime = consultationInformation.consultationEnd;
        const start = new Date(`1970-01-01T${startTime}:00`);
        const end = new Date(`1970-01-01T${endTime}:00`);
        const checkIfConsultationsOverlap = await lecturerRepository.checkIfConsultationsOverlap(consultationInformation);
        if (start > end) {
            throw new Error("Start time is bigger");
        } else {
            if (!checkIfConsultationsOverlap) {
                const consultation = await lecturerRepository.addConsultation(consultationInformation);
                return consultation;
            } else {
                throw new Error("Consultations overlap.");
            }
        }
    },
    checkIfConsultationAlreadyExists: async (consultationInformation) => {
        const startTime = consultationInformation.consultationStart;
        const endTime = consultationInformation.consultationEnd;
        const start = new Date(`1970-01-01T${startTime}:00`);
        const end = new Date(`1970-01-01T${endTime}:00`);
        if (start > end) {
            throw new Error("Start time is bigger");
        } else {
            const consultation = await lecturerRepository.addConsultation(consultationInformation);
            return consultation;
        }
    },
    deleteConsultation: async (consultationId) => {
        return await lecturerRepository.deleteConsultation(consultationId);
    }
    , getLecturerSubjects: async (lecturerProfileId) => {
        return await lecturerRepository.getLecturerSubjects(lecturerProfileId);
    },
    getLecturerConsultations: async (lecturerProfileId) => {
        return await lecturerRepository.getLecturerConsultations(lecturerProfileId);
    },
    getLecturerLectures: async (lecturerProfileId) => {
        return await lecturerRepository.getLecturerLectures(lecturerProfileId);
    }, getLecturerGroups: async (lecturerId, subjectId) => {
        return await lecturerRepository.getLecturerGroups(lecturerId, subjectId);
    },
    getGroupFacNums: async (groupHalf) => {
        return await lecturerRepository.getGroupFacNums(groupHalf);
    },
    addMark: async (subject, group, facultyNumber, grade) => {
        return await lecturerRepository.addMark(subject, group, facultyNumber, grade);

    },
    getGroupHalfMarks: async (groupHalfId) => {
        return await lecturerRepository.getGroupHalfMarks(groupHalfId);
    },
}