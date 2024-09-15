const { pool } = require("../db-config");
module.exports = {

    getMarks: async () => {
        try {
            const [result] = await pool.query(`
            SELECT *
            FROM mark
            `);
            return result;
        } catch (err) {
            console.error('Error fetching marks for student:', err);
            throw err;
        }
    },
    getFacNums: async (groupHalfId) => {
        try {
            const [result] = await pool.query(`
                SELECT student_fac_num
                FROM student
                WHERE group_half_id_fk = ?
                `, [groupHalfId]);
            return result;
        } catch (err) {
            console.error('Error fetching periods for student:', err);
            throw err;
        }
    },
    addMark: async (markInformation) => {
        try {
            console.log('Subject ID:', markInformation.subject);
            console.log('Group Half ID:', markInformation.groupHalf);
            console.log('Mark:', markInformation.mark);
            const getGhsId = await pool.query
                (`
                SELECT ghs.group_half_subject_id
                FROM group_half_subject ghs
                INNER JOIN subject s
                ON ghs.subject_id_fk=s.subject_id
                INNER JOIN group_half gh
                ON ghs.group_half_id_fk=gh.group_half_id
                INNER JOIN period_type pt
                ON ghs.period_type_id_fk=pt.period_type_id
                WHERE s.subject_id=?
                AND gh.group_half_id=?
                AND pt.period_type_id=?

                `, [markInformation.subject, markInformation.groupHalf, '1']);
            // First, check if the student already has a mark for the subject
            const [existingMark] = await pool.query//check if mark excists
                (`
                SELECT * FROM student_mark
                WHERE student_faculty_num_fk = ?
                AND group_half_sbj_id_fk = ?
            `, [markInformation.facNum,
                getGhsId[0][0]['group_half_subject_id']
                ]);

            if (existingMark.length > 0) {
                // If a record exists, we won't add a new one
                console.log("Student already has a mark for this subject.");
                //throw new Error('Student already has a mark for this subject.');
            }
            // If no mark exists, insert the new mark
            else {
                await pool.query(`
                INSERT INTO student_mark
                (student_faculty_num_fk,
                mark_id_fk,
                group_half_sbj_id_fk)
                VALUES (?,?,?)`,
                    [
                        markInformation.facNum,
                        markInformation.mark,
                        getGhsId[0][0]['group_half_subject_id']
                    ]);
                console.log("Mark is added");
            }
        } catch (err) {
            console.error(err);
            throw (err);
        }
    }

    , getStudentMarks: async (studentProfileId) => {
        try {
            const [result] = await pool.query(`
            SELECT m.mark_value,sj.subject_name
            FROM mark m
            INNER JOIN student_mark sm
            ON sm.mark_id_fk=m.mark_id
            INNER JOIN group_half_subject ghs
            ON sm.group_half_sbj_id_fk=ghs.group_half_subject_id
            INNER JOIN \`subject\` sj
            ON ghs.subject_id_fk=sj.subject_id
            INNER JOIN student s
            ON sm.student_faculty_num_fk=s.student_fac_num
            INNER JOIN student_profile sp
            ON sp.student_fac_num=s.student_fac_num
            WHERE sp.student_profile_id = ?
                `, [studentProfileId]);
            return result;
        } catch (err) {
            console.error(err);
            throw (err);
        }
    }, getStudentProfileId: async (facNumber) => {
        try {
            const [result] = await pool.query(`
                SELECT student_profile_id
                FROM student_profile
                WHERE student_fac_num=?
                `, [facNumber]);
            return result;
        } catch (err) {
            console.error(err);
            throw (err);
        }
    }

}