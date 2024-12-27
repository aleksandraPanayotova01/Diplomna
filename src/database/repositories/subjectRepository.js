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
            const getSubjectId = await pool.query(`
                SELECT subject_id
                FROM subject
                WHERE subject_abbreviation=?
                `, [subjectInformation.subjectAbbreviation]);
            console.log("Subject id:", getSubjectId[0][0]['subject_id']);
            const addLecturerSubject = await pool.query(`
                INSERT INTO lecturer_subject
                (lecturer_id_fk, subject_id_fk,period_type_id_fk)
                VALUES(?,?,?)
                `, [subjectInformation.lecturerId,
            getSubjectId[0][0]['subject_id'],
            subjectInformation.periodTypeId
            ]);
            const [result] = await pool.query(`
                INSERT INTO group_half_subject
                (group_half_id_fk, subject_id_fk,
                period_type_id_fk,
                lecturer_id_fk,
                subject_semester_number)
                VALUES(?,?,?,?,?)
                `, [subjectInformation.groupHalfId,
            getSubjectId[0][0]['subject_id'],
            subjectInformation.periodTypeId,
            subjectInformation.lecturerId,
            subjectInformation.semNumber]);
            return result;
        } catch (err) {
            console.error('Error fetching periods for student:', err);
            throw err;
        }
    }, addSubjectName: async (subjectInformation) => {
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
}