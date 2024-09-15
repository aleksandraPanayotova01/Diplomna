const studentRepository = require('../database/repositories/studentRepository');

module.exports = {
    addStudent: async (studentInformation) => {
        const checkIfStudentExists = await studentRepository.checkIfStudentExists(studentInformation.student_fac_num);

        if (!checkIfStudentExists) {
            const student = await studentRepository.createStudent(studentInformation);

            return student;

        } else {
            return "Студентът вече съществува";

        }
    }, getMarks: async () => {
        return await studentRepository.getMarks();
    },
    addMark: async (markInformation) => {
        return await studentRepository.addMark(markInformation);
    },
    getFacNums: async (groupHalfId) => {
        return await studentRepository.getFacNums(groupHalfId);
    },
    getStudentMarks: async (studentProfileId)=>{
        return await studentRepository.getStudentMarks(studentProfileId);
    },
    getStudentProfileId:async(facNumber)=>{
        return await studentRepository.getStudentProfileId(facNumber);;
    }
    
}