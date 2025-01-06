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
    checkIfSubjectIsAddedToLecturer: async (subjectInformation) => {
        return await subjectRepository.checkIfSubjectIsAddedToLecturer(subjectInformation);
    },
    checkIfSubjectIsAddedToGroupHalf: async (subjectInformation) => {
        return await subjectRepository.checkIfSubjectIsAddedToGroupHalf(subjectInformation);
    },
    addSubjectToGroup: async (subjectInformation) => {
        try {
            const subjectAddedToLecturer = await subjectRepository.checkIfSubjectIsAddedToLecturer(subjectInformation);
            const subjectAddedToHalf = await subjectRepository.checkIfSubjectIsAddedToGroupHalf(subjectInformation);
            if (!subjectAddedToLecturer) {
                await subjectRepository.addSubjectToLecturer(subjectInformation);
            }
            if (!subjectAddedToHalf) {
                await subjectRepository.addSubjectToHalf(subjectInformation);
            }

            // return      await subjectRepository.addSubjectToHalf(subjectInformation);
        } catch (err) {
            console.error("Error adding subject:", err);
            throw err;
        }
    },
    updateSubjectGroup: async (subjectInformation) => {
        try {
            await subjectRepository.addSubjectToLecturer(subjectInformation);
            await subjectRepository.addSubjectToHalf(subjectInformation);
        } catch (err) {
            console.error("Error adding subject:", err);
            throw err;
        }
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
    updateSubjectHalfLecturer: async (subjectInformation) => {
        return await subjectRepository.updateGroupHalfLecturer(subjectInformation);
    },
    deleteSubjectToHalf: async (subjectInformation) => {
        return await subjectRepository.deleteSubjectToHalf(subjectInformation);
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