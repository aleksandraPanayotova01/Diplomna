const subjectRepository = require('../database/repositories/subjectRepository');
module.exports = {
    addSubject: async (subjectInformation) => {
        const addedSubject = await subjectRepository.checkIfSubjectExists(subjectInformation.subjectName);
        if (!addedSubject) {//checks if the subject is already added
            await subjectRepository.createSubject(subjectInformation);
        }
    },
    addSubjectToGroup: async (subjectInformation) => {
        return await subjectRepository.addSubjectToHalf(subjectInformation);
    },addSubjectName: async(subjectInformation)=>{
        return await subjectRepository.addSubjectName(subjectInformation);
    }
    
}