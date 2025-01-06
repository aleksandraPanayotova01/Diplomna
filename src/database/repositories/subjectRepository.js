const { pool } = require("../db-config");
module.exports = {
    checkIfSubjectExists: async (subjectInformation) => {
        try {
            const [rows] = await pool.query(`
                SELECT * FROM subject 
                WHERE (subject_name = ? OR subject_abbreviation = ?) 
                AND specialty_id_fk = ?
            `, [subjectInformation.subjectName,
            subjectInformation.subjectAbbreviation,
            subjectInformation.specialtyId]);
            return rows.length > 0; // Връща true, ако записът съществува
        } catch (err) {
            console.error('Error checking if subject exists:', err);
            throw err;
        }
    },
    checkIfSubjectIsAddedToLecturer: async (subjectInformation) => {
        try {

            const [rows] = await pool.query(`
                SELECT * FROM lecturer_subject 
                WHERE lecturer_id_fk=?
                AND subject_id_fk=?
                AND period_type_id_fk=?
            `, [subjectInformation.lecturerId,
            subjectInformation.subjectId,
            subjectInformation.periodTypeId
            ]);
            console.log("checkIfSubjectIsAddedToLecturer", rows.length > 0);
            return rows.length > 0; // Връща true, ако записът съществува
        } catch (err) {
            console.error('Error checking if subject exists:', err);
            throw err;
        }
    },
    checkIfSubjectIsAddedToGroupHalf: async (subjectInformation) => {
        try {
            const [rows] = await pool.query(`
                SELECT * FROM group_half_subject 
                WHERE group_half_id_fk =?
                AND subject_id_fk=?
                AND period_type_id_fk=?
                AND lecturer_id_fk=?
                AND subject_semester_number=?
            `, [subjectInformation.groupHalfId,
            subjectInformation.subjectId,
            subjectInformation.periodTypeId,
            subjectInformation.lecturerId,
            subjectInformation.semNumber
            ]);
            console.log("checkIfSubjectIsAddedToGroupHalf", rows.length > 0);
            return rows.length > 0; // Връща true, ако записът съществува
        } catch (err) {
            console.error('Error checking if subject exists:', err);
            throw err;
        }
    },
    // createSubject: async (subjectInformation) => {
    //     const connection = await pool.getConnection();
    //     try {
    //         await connection.beginTransaction();
    //         await pool.query(`
    //             INSERT INTO subject(subject_name,subject_abbreviation)
    //             VALUES (?,?)`, [subjectInformation.subjectName, subjectInformation.subjectAbbreviation]);

    //         await connection.commit();
    //     } catch (err) {
    //         await connection.rollback();//
    //         console.error(err);
    //         throw (err);//
    //     } finally {
    //         connection.release();//
    //     }
    // },

    addSubjectToHalf: async (subjectInformation) => {
        try {
            console.log("Added to half");
            const [result] = await pool.query(`
                INSERT INTO group_half_subject
                (group_half_id_fk, subject_id_fk,
                period_type_id_fk,
                lecturer_id_fk,
                subject_semester_number)
                VALUES(?,?,?,?,?)
                `, [subjectInformation.groupHalfId,
            subjectInformation.subjectId,
            subjectInformation.periodTypeId,
            subjectInformation.lecturerId,
            subjectInformation.semNumber]);
            return result;
        } catch (err) {
            console.error('Error fetching periods for student:', err);
            throw err;
        }
    },
    addSubjectToLecturer: async (subjectInformation) => {
        try {
            console.log("Added to lecturer");
            const [result] = await pool.query(`
                INSERT INTO lecturer_subject
                (lecturer_id_fk, subject_id_fk,period_type_id_fk)
                VALUES(?,?,?)
                `, [subjectInformation.lecturerId,
            subjectInformation.subjectId,
            subjectInformation.periodTypeId
            ]);
            return result;
        } catch (err) {
            console.error('Error fetching periods for student:', err);
            throw err;
        }
    },

    addSubjectName: async (subjectInformation) => {
        try {
            console.log("Adding: ", subjectInformation.subjectName,
                subjectInformation.subjectAbbreviation,
                subjectInformation.specialtyId);
            await pool.query(`
                INSERT INTO subject(subject_name,subject_abbreviation,is_active,specialty_id_fk)
                VALUES(?,?,1,?)
                `, [subjectInformation.subjectName,
            subjectInformation.subjectAbbreviation,
            subjectInformation.specialtyId])
        }
        catch (err) {
            console.error('Error fetching periods for student:', err);
            throw err;
        };
    }, updateSubjectName: async (subjectInformation) => {
        try {
            await pool.query(`
                UPDATE subject
                SET subject_name = ?, subject_abbreviation = ?
                WHERE subject_name = ?
            `, [subjectInformation.newName, subjectInformation.newAbbreviation,
            subjectInformation.oldName]);
            // await pool.query(`
            //     UPDATE subject
            //     SET subject_name = ?, subject_abbreviation = ?
            //     WHERE subject_name = ? AND specialty_id_fk=?
            // `, [subjectInformation.newName, subjectInformation.newAbbreviation,
            //      subjectInformation.oldName,subjectInformation.specialtyId]);

            console.log(`Subject name updated from ${subjectInformation.oldName} to ${subjectInformation.newName}`);
        } catch (err) {
            console.error('Error updating subject name:', err);
            throw err;  // Re-throw error to be caught in the controller
        }
    },
    updateGroupHalfLecturer: async (subjectInformation) => {
        try {
            const getGroupHalfSubject = await pool.query(`
                SELECT group_half_subject_id
                WHERE group_half_id_fk=?
                AND subject_id_fk=?
                AND period_type_id_fk=?
                AND lecturer_id_fk=?
                AND subject_semester_number=?
                `, [
                subjectInformation.groupHalfId,
                subjectInformation.subjectId,
                subjectInformation.periodTypeId,
                subjectInformation.lecturerId,
                subjectInformation.semesterNum
            ]);
            const updatePeriod = await pool.query(`
                UPDATE period
                SET lecturer_id_fk=?
                WHERE group_half_subject_id_fk=?
                AND period_type_id_fk=?
                `, [subjectInformation.lecturerId,
            getTitleId[0][0]['group_half_subject_id'],
            subjectInformation.periodTypeId
            ]);
            const [result] = await pool.query(`
                UPDATE group_half_subject
                SET lecturer_id_fk=?
                WHERE group_half_id_fk=?
                AND subject_id_fk=?
                AND period_type_id_fk=? 
                AND subject_semester_number=?
                `, [subjectInformation.lecturerId,
            subjectInformation.groupHalfId,
            subjectInformation.subjectId,
            subjectInformation.periodTypeId,
            subjectInformation.semesterNum
            ]);
            console.log(subjectInformation.lecturerId,
                subjectInformation.groupHalfId,
                subjectInformation.subjectId,
                subjectInformation.periodTypeId,
                subjectInformation.semesterNum);
            return result;
        } catch (err) {
            console.error('Error fetching periods for student:', err);
            throw err;
        }
    },
    deleteSubjectName: async (subjectInformation) => {
        try {
            console.log("Deleting: ", subjectInformation.subjectName,
                subjectInformation.subjectAbbreviation,
                subjectInformation.specialtyId);
            await pool.query(`
                UPDATE subject
                SET is_active = ?
                WHERE subject_name=? AND subject_abbreviation=?
                AND     specialty_id_fk=?
                `, [0, subjectInformation.subjectName,
                subjectInformation.subjectAbbreviation,
                subjectInformation.specialtyId])
        }
        catch (err) {
            console.error('Error fetching periods for student:', err);
            throw err;
        };
    },
    deleteSubjectToHalf: async (subjectInformation) => {
        try {
            console.log("Deleting: ", subjectInformation.groupHalfId,
                subjectInformation.subjectId,
                subjectInformation.periodTypeId,
                subjectInformation.semesterNum);
            const getGroup_half_subject_id = await pool.query(`
                        SELECT group_half_subject_id 
                        FROM  group_half_subject
                            WHERE group_half_id_fk=?
                            AND subject_id_fk=?
                            AND period_type_id_fk=?
                            AND subject_semester_number=?
                     `, [subjectInformation.groupHalfId,
            subjectInformation.subjectId,
            subjectInformation.periodTypeId,
            subjectInformation.semesterNum]);
            console.log("Group_half_subject_id: ",
                getGroup_half_subject_id[0][0]['group_half_subject_id']);
            const deletePeriodSubject = await pool.query(`
                    DELETE FROM period
                    WHERE group_half_subject_id_fk=?
                     `, [getGroup_half_subject_id[0][0]['group_half_subject_id']]);
            await pool.query(`
               DELETE FROM group_half_subject
               WHERE group_half_id_fk=?
               AND subject_id_fk=?
               AND period_type_id_fk=?
               AND subject_semester_number=?
                `, [subjectInformation.groupHalfId,
            subjectInformation.subjectId,
            subjectInformation.periodTypeId,
            subjectInformation.semesterNum]);


        }
        catch (err) {
            console.error('Error fetching periods for student:', err);
            throw err;
        };
    },
}