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
                SELECT s.student_fac_num, p.name
                FROM student s
                INNER JOIN student_profile sp
                ON s.student_fac_num=sp.student_fac_num
                INNER JOIN profile p
                ON sp.profile_id_fk=p.profile_id
                WHERE s.group_half_id_fk = ?
                `, [groupHalfId]);
            return result;
        } catch (err) {
            console.error('Error fetching periods for student:', err);
            throw err;
        }
    },
    getSubjectsHalf: async (groupHalfId) => {
        try {
            const [result] = await pool.query(`
                SELECT s.subject_name,ghs.group_half_subject_id
                FROM \`subject\` s 
                INNER JOIN group_half_subject ghs
                ON s.subject_id=ghs.subject_id_fk
                WHERE ghs.group_half_id_fk = ? AND ghs.period_type_id_fk=?
                `, [groupHalfId, 1]);
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
    },

    updateMark: async (markInformation) => {
        try {
            console.log('Subject ID:', markInformation.subject);
            console.log('Group Half ID:', markInformation.groupHalf);
            console.log('Mark:', markInformation.mark);
            // First, check if the student already has a mark for the subject
            const [existingMark] = await pool.query//check if mark excists
                (`
                SELECT * FROM student_mark
                WHERE student_faculty_num_fk = ?
                AND group_half_sbj_id_fk = ?
            `, [markInformation.facNum,
                markInformation.subject]
                );
            console.log(existingMark);
            if (existingMark.length > 0) {
                // If a record exists, we will update it
                await pool.query(`
                UPDATE student_mark
                SET mark_id_fk = ?
                WHERE student_faculty_num_fk = ?
                AND group_half_sbj_id_fk = ?`,
                    [markInformation.mark, markInformation.facNum,
                    markInformation.subject]
                );
                console.log("Mark is added");
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
                        markInformation.subject
                    ]);
                console.log("Updated mark");
            }
        } catch (err) {
            console.error(err);
            throw (err);
        }
    },
    checkIfMarkExists: async (markInformation) => {
        try {

            const [rows] = await pool.query(`
              SELECT * FROM student_mark
                WHERE student_faculty_num_fk = ?
                AND group_half_sbj_id_fk = ?
            `, [markInformation.facNum,
            markInformation.subject
            ]);
            console.log(" checkIfMarkExists", rows.length > 0);
            return rows.length > 0; // Връща true, ако записът съществува
        } catch (err) {
            console.error('Error checking if the mark exists:', err);
            throw err;
        }
    },
    deleteMark: async (markInformation) => {
        try {
            console.log('Subject ID:', markInformation.subject);
            console.log('Group Half ID:', markInformation.groupHalf);
            // const [existingMark] = await pool.query//check if mark excists
            //     (`
            //     SELECT * FROM student_mark
            //     WHERE student_faculty_num_fk = ?
            //     AND group_half_sbj_id_fk = ?
            // `, [markInformation.facNum,
            //     markInformation.subject]
            //     );
            // console.log("Оценката: ", existingMark, " ще бъде изтрита!");
            // if (existingMark.length > 0) {
            // If a record exists, we will update it
            const markValue = await pool.query(`
                    SELECT m.mark_value
                    FROM mark m
                    INNER JOIN student_mark sm
                    ON m.mark_id=sm.mark_id_fk
                    WHERE student_faculty_num_fk = ?
                    AND group_half_sbj_id_fk = ?`,
                [markInformation.facNum,
                markInformation.subject]
            );
            console.log("markValue:", markValue[0][0]['mark_value']);
            await pool.query(`
                DELETE FROM student_mark
                WHERE student_faculty_num_fk = ?
                AND group_half_sbj_id_fk = ?`,
                [markInformation.facNum,
                markInformation.subject]
            );
            console.log("The mark is deleted");
            //throw new Error('Student already has a mark for this subject.');
            // }
            // // If no mark exists, insert the new mark
            // else {

            // }
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
    },
    getStudentConsultations: async (studentProfileId) => {
        try {
            const [result] = await pool.query(`
               SELECT DISTINCT 
                cl.consultation_start,
                cl.consultation_end,
                w.weekday_name,
                r.room_number,
                b.building_abbreviation,
                t.title_name,
                p.\`name\`,
                p.surname
                FROM 
                    consultation_lecturer cl
                INNER JOIN 
                    weekday w ON cl.weekday_id_fk = w.weekday_id
                INNER JOIN 
                    room r ON cl.room_id_fk = r.room_id
                INNER JOIN 
                    building b ON r.building_id_fk = b.building_id
                INNER JOIN 
                    lecturer_profile lp ON cl.lecturer_profile_id_fk = lp.lecturer_profile_id
                INNER JOIN 
                    \`profile\` p ON lp.profile_id_fk = p.profile_id
                INNER JOIN 
                    lecturer l ON lp.lecturer_id_fk = l.lecturer_id  -- Fix: Correct joining condition
                INNER JOIN 
                    title t ON l.title_id_fk = t.title_id
                INNER JOIN 
                    group_half_subject ghs ON ghs.lecturer_id_fk = l.lecturer_id
                INNER JOIN 
                    group_half gh ON ghs.group_half_id_fk = gh.group_half_id
                INNER JOIN 
                    student s ON s.group_half_id_fk = gh.group_half_id
                INNER JOIN 
                    student_profile sp ON sp.student_fac_num = s.student_fac_num
                WHERE 
                    sp.student_profile_id = ?
                `, [studentProfileId]);

            return result;
        } catch (err) {
            console.error(err);
            throw (err);
        }
    },
    searchConsultations: async (lecturerName) => {
        try {
            const lecturerNameWithWildcard = `%${lecturerName}%`; // For partial matching
            const [result] = await pool.query(`
                SELECT DISTINCT 
                cl.consultation_start,
                cl.consultation_end,
                w.weekday_name,
                r.room_number,
                b.building_abbreviation,
                t.title_name,
                p.\`name\`,
                p.surname
                FROM 
                    consultation_lecturer cl
                INNER JOIN 
                    weekday w ON cl.weekday_id_fk = w.weekday_id
                INNER JOIN 
                    room r ON cl.room_id_fk = r.room_id
                INNER JOIN 
                    building b ON r.building_id_fk = b.building_id
                INNER JOIN 
                    lecturer_profile lp ON cl.lecturer_profile_id_fk = lp.lecturer_profile_id
                INNER JOIN 
                    \`profile\` p ON lp.profile_id_fk = p.profile_id
                INNER JOIN 
                    lecturer l ON lp.lecturer_id_fk = l.lecturer_id
                INNER JOIN 
                    title t ON l.title_id_fk = t.title_id
                WHERE p.\`name\` LIKE ?
                OR p.surname LIKE ?
                OR t.title_name LIKE ?
            `, [lecturerNameWithWildcard, lecturerNameWithWildcard, lecturerNameWithWildcard]);

            return result;
        } catch (err) {
            console.error('Error fetching consultations:', err);
            throw err;
        }
    }
    ,

}