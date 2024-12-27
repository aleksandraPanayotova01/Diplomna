const subjectRepository = require('../database/repositories/subjectRepository');
module.exports = {
    // addSubject: async (subjectInformation) => {
    //     const addedSubject = await subjectRepository.checkIfSubjectExists(subjectInformation);
    //     if (!addedSubject) {//checks if the subject is already added
    //         await subjectRepository.createSubject(subjectInformation);
    //     } else {
    //         req.flash('error', 'Предмет с това име и съкращение вече съществува за избраната специалност.');
    //         return res.redirect('/admin/add/subject');
    //     }
    // },
    addSubjectToGroup: async (subjectInformation) => {
        return await subjectRepository.addSubjectToHalf(subjectInformation);
    },
    addSubjectName: async (subjectInformation) => {
        try {
            const subjectExists = await subjectRepository.checkIfSubjectExists(
                subjectInformation
            );

            if (subjectExists) {
                throw new Error("Subject with the same name and abbreviation already exists for this specialty.");
            }

            return await subjectRepository.addSubjectName(subjectInformation);
        } catch (err) {
            console.error("Error adding subject:", err);
            throw err;
        }
    }, updateSubjectName: async (subjectInformation) => {
        return await subjectRepository.updateSubjectName(subjectInformation);
    },
    deleteSubjectName: async (subjectInformation) => {
        try {
            const subjectExists = await subjectRepository.checkIfSubjectExists(
                subjectInformation
            );

            if (!subjectExists) {
                throw new Error("Subject with this name and abbreviation does not exists for this specialty.");

            }

            return await subjectRepository.deleteSubjectName(subjectInformation);
        } catch (err) {
            console.error("Error deleting subject:", err);
            throw err;
        }
    },

}