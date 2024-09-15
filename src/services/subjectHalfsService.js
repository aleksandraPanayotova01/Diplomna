const subjectHalfsRepository = require('../database/repositories/subjectHalfsRepository');
module.exports = {
    addSubject: async (subjectInformation) => {
        // const addedSubjectHalfs = await subjectRepository.checkIfSubjectExists(subjectInformation.subjectName);
        if (!addedSubject) {//checks if the subject is already added
            await subjectHalfsRepository.createSubject(subjectInformation);
        }
    }
}