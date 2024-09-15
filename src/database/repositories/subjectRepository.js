const { pool } = require("../db-config");
module.exports = {
    checkIfSubjectExists: async (subjectName) => {
        try {
            const [result] = await pool.query(`
                SELECT * FROM subject WHERE subject_name=?`, [subjectName]);
            if (result.length === 0) {
                return false;
            }
            else {
                return true;
            }
        } catch (err) {
            console.error(err);
            throw (err);
        }
    },
    createSubject: async (subjectInformation) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            await pool.query(`
                INSERT INTO subject(subject_name,subject_abbreviation)
                VALUES (?,?)`, [subjectInformation.subjectName, subjectInformation.subjectAbbreviation]);

            await connection.commit();
        } catch (err) {
            await connection.rollback();//
            console.error(err);
            throw (err);//
        } finally {
            connection.release();//
        }
    },
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
                period_type_id_fk, subject_semester_number)
                VALUES(?,?,?,?)
                `, [subjectInformation.groupHalfId,
            getSubjectId[0][0]['subject_id'],
            subjectInformation.periodTypeId,
            subjectInformation.semNumber]);
            return result;
        } catch (err) {
            console.error('Error fetching periods for student:', err);
            throw err;
        }
    }, addSubjectName: async (subjectInformation) => {
        try {
            await pool.query(`
                INSERT INTO subject(subject_name,subject_abbreviation)
                VALUES(?,?)
                `, [subjectInformation.subjectName,
            subjectInformation.subjectAbbreviation])
        }
        catch (err) {
            console.error('Error fetching periods for student:', err);
            throw err;
        };
    }
}