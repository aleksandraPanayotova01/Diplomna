const lecturerRepository = require('../database/repositories/lecturerRepository');
module.exports = {
    addLecturer: async (lecturerInformation) => {
        const lecturer = await lecturerRepository.createLecturer(lecturerInformation);
        return lecturer;
    },addConsultation: async(consultationInformation) => {
        const consultation = await lecturerRepository.addConsultation(consultationInformation);
        return consultation;
    }
    ,getLecturerSubjects: async (lecturerProfileId)=>{
            return await lecturerRepository.getLecturerSubjects(lecturerProfileId);
    },
    getLecturerConsultations: async (lecturerProfileId)=>{
        return await lecturerRepository.getLecturerConsultations(lecturerProfileId);
    },
    getLecturerLectures: async (lecturerProfileId)=>{
        return await lecturerRepository.getLecturerLectures(lecturerProfileId);
    },getLecturerGroups:async(lecturerId,subjectId)=>{
        return await lecturerRepository.getLecturerGroups(lecturerId,subjectId);
    },
    getGroupFacNums:async(groupHalf)=>{
        return await lecturerRepository.getGroupFacNums(groupHalf);
    },
    addMark:async( subject,group,facultyNumber,grade )=>{
        return await lecturerRepository.addMark( subject,group,facultyNumber,grade );
    
    }
}