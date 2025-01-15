const { pool } = require("../db-config");
module.exports = {
    addConsultation: async (consultationInformation) => {
        try {
            // const getLecturerSubjectId = await pool.query(`
            //         SELECT ls.lecturer_subject_id
            //         FROM lecturer_subject ls
            //         INNER JOIN subject s
            //         ON ls.subject_id_fk=s.subject_id
            //         WHERE s.subject_abbreviation=?;
            //         `, [consultationInformation.subject]);
            // console.log("Lecturer subject id: ",
            //     getLecturerSubjectId[0][0]['lecturer_subject_id']);
            const [result] = await pool.query(`
                    INSERT INTO consultation_lecturer
                    (consultation_start,
                    consultation_end,
                    weekday_id_fk,
                    room_id_fk,
                    lecturer_profile_id_fk)
                    VALUES(?,?,?,?,?)
                `, [consultationInformation.consultationStart,
            consultationInformation.consultationEnd,
            consultationInformation.weekday,
            consultationInformation.room,
            consultationInformation.lecturerProfileId
            ]);
            console.log(result);
            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }, getLecturerSubjects: async (lecturerProfileId) => {
        try {
            const [result] = await pool.query(`
                SELECT DISTINCT s.subject_id, s.subject_name,s.subject_abbreviation,
                ls.period_type_id_fk
                FROM lecturer_subject ls
                INNER JOIN lecturer l
                ON ls.lecturer_id_fk=l.lecturer_id
                INNER JOIN lecturer_profile lp
                ON lp.lecturer_id_fk=l.lecturer_id
                INNER JOIN subject s 
                ON ls.subject_id_fk = s.subject_id
                WHERE lp.lecturer_profile_id = ?
            `, [lecturerProfileId]);
            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    deleteConsultation: async (consultationId) => {
        try {
            const [result] = await pool.query(`
                DELETE FROM consultation_lecturer
                WHERE consultation_id = ?
            `, [consultationId]);
            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    getLecturerLectures: async (lecturerProfileId) => {
        try {
            const [result] = await pool.query(`
                SELECT s.subject_id, s.subject_name,s.subject_abbreviation
                FROM lecturer_subject ls
                INNER JOIN lecturer l
                ON ls.lecturer_id_fk=l.lecturer_id
                INNER JOIN lecturer_profile lp
                ON lp.lecturer_id_fk=l.lecturer_id
                INNER JOIN subject s 
                ON ls.subject_id_fk = s.subject_id
                WHERE lp.lecturer_profile_id = ?
                AND ls.period_type_id_fk=?
            `, [lecturerProfileId, '1']);
            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    getLecturerConsultations: async (lecturerProfileId) => {
        try {
            const [result] = await pool.query(`
                SELECT 
                cl.consultation_id,
                cl.consultation_start,
                cl.consultation_end,
                w.weekday_name,
                b.building_name,
                r.room_number
                FROM consultation_lecturer cl
                INNER JOIN weekday w
                    ON cl.weekday_id_fk = w.weekday_id
                INNER JOIN room r
                    ON cl.room_id_fk = r.room_id
                INNER JOIN building b
                    ON r.building_id_fk = b.building_id
                INNER JOIN lecturer_profile lp
                    ON cl.lecturer_profile_id_fk=lp.lecturer_profile_id
                WHERE cl.lecturer_profile_id_fk = ?
            `, [lecturerProfileId]);
            return result;
        } catch (err) {
            console.error('Error fetching consultations:', err);
            throw err;
        }
    },
    checkIfConsultationsOverlap: async (consultationInformation) => {
        try {
            const [result] = await pool.query(`
              SELECT *
            FROM consultation_lecturer cl
            INNER JOIN weekday w
                ON cl.weekday_id_fk = w.weekday_id
            INNER JOIN room r
                ON cl.room_id_fk = r.room_id
            INNER JOIN building b
                ON r.building_id_fk = b.building_id
            INNER JOIN lecturer_profile lp
                ON cl.lecturer_profile_id_fk = lp.lecturer_profile_id
            WHERE cl.lecturer_profile_id_fk = ?
             AND cl.weekday_id_fk = ?
            AND (
              (cl.consultation_start < ? AND cl.consultation_end > ?) -- Припокриване
              OR (cl.consultation_start >= ? AND cl.consultation_start < ?) -- Началото попада вътре
              OR (cl.consultation_end > ? AND cl.consultation_end <= ?) -- Краят попада вътре
          )
           
                `, [consultationInformation.lecturerProfileId,
            consultationInformation.weekday,
            consultationInformation.consultationEnd,
            consultationInformation.consultationStart,
            consultationInformation.consultationStart,
            consultationInformation.consultationEnd,
            consultationInformation.consultationStart,
            consultationInformation.consultationEnd,

            ]);
            if (result.length === 0) {
                return false;
            }

            return true;
        } catch (err) {
            console.error('Error fetching group halves for lecturer: ', err);
            throw err;
        }
    }, getLecturerGroups: async (lecturerId, subjectId) => {
        try {
            const [result] = await pool.query(`
                SELECT DISTINCT gh.group_half_id,g.group_number,gh.group_half_letter
                FROM group_half gh
                INNER JOIN \`group\` g
                ON gh.group_id_fk=g.group_id
                INNER JOIN group_half_subject ghs
                ON ghs.group_half_id_fk=gh.group_half_id
                INNER JOIN \`subject\` s
                ON ghs.subject_id_fk=s.subject_id
                INNER JOIN lecturer_subject ls
                ON ls.subject_id_fk=s.subject_id
                WHERE ls.lecturer_id_fk=?
                AND ls.subject_id_fk=?
                `, [lecturerId, subjectId]);
            console.log(result);
            return result;
        } catch (err) {
            console.error('Error fetching group halves for lecturer: ', err);
            throw err;
        }
    },
    getGroupFacNums: async (groupHalf) => {
        try {
            const [result] = await pool.query(`   
                SELECT student_fac_num
                FROM student
                WHERE group_half_id_fk=?
                `, [groupHalf]);
            console.log(result);
            return result;
        } catch (err) {
            console.error('Error fetching group halves for lecturer: ', err);
            throw err;
        }
    },
    addMark: async (subject, group, facultyNumber, grade) => {
        try {
            console.log("addMark");
            console.log(subject, group, facultyNumber, grade);
            const [getGroupHalfSubjectId] = await pool.query(`
                SELECT ghs.group_half_subject_id
                FROM group_half_subject ghs
                INNER JOIN group_half gh
                ON gh.group_half_id=ghs.group_half_id_fk
                INNER JOIN subject s
                ON ghs.subject_id_fk=s.subject_id
                WHERE s.subject_id=?
                AND gh.group_half_id=?
                `, [subject, group]);
            const [getMarkId] = await pool.query(`
                SELECT mark_id
                FROM mark
                WHERE mark_value=?
                `, [grade]);
            console.log("MarkId:", getMarkId[0]['mark_id'], " GroupHalfSubjectId:",
                getGroupHalfSubjectId[0]['group_half_subject_id'])
            const [result] = await pool.query(`   
               INSERT INTO student_mark(student_faculty_num_fk,mark_id_fk,
               group_half_sbj_id_fk)
               VALUES(?,?,?)
                `, [facultyNumber, getMarkId[0]['mark_id'],
                getGroupHalfSubjectId[0]['group_half_subject_id']]);
            console.log(result);
            return result;
        } catch (err) {
            console.error('Error fetching group halves for lecturer: ', err);
            throw err;
        }
    },
    getGroupHalfMarks: async (groupHalfId) => {
        try {
            const [result] = await pool.query(`
            SELECT 
                DISTINCT 
                sm.student_mark_id,
                s.subject_name,
                CONCAT(p.\`name\`, ' ', p.surname) AS student_name,
                m.mark_value
            FROM student_mark sm
            INNER JOIN mark m ON sm.mark_id_fk=m.mark_id
            INNER JOIN student st ON sm.student_faculty_num_fk=st.student_fac_num
			INNER JOIN group_half_subject ghs ON sm.group_half_sbj_id_fk=ghs.group_half_subject_id
            INNER JOIN student_profile sp ON sp.student_fac_num=st.student_fac_num
            INNER JOIN \`profile\` p ON sp.profile_id_fk=p.profile_id
            INNER JOIN group_half gh ON st.group_half_id_fk = gh.group_half_id
         
            INNER JOIN \`subject\` s ON ghs.subject_id_fk = s.subject_id
            
            WHERE gh.group_half_id=?
            ORDER BY sm.student_mark_id;
            `, [groupHalfId]);
            // console.log(result);
            // const formattedMarks = [];
            // const subjectMap = {};

            // result.forEach(row => {
            //     if (!subjectMap[row.subject_name]) {
            //         subjectMap[row.subject_name] = {
            //             subject_name: row.subject_name,
            //             students: []
            //         };
            //         formattedMarks.push(subjectMap[row.subject_name]);
            //     }
            //     subjectMap[row.subject_name].students.push({
            //         student_name: row.student_name,
            //         mark_value: row.mark_value
            //     });
            // });
            // return formattedMarks;
            const uniqueStudents = Array.from(new Set(result.map(row => row.student_name)))
                .map(name => ({ student_name: name }));

            const subjects = [];
            const subjectMap = {};

            result.forEach(row => {
                if (!subjectMap[row.subject_name]) {
                    subjectMap[row.subject_name] = {
                        subject_name: row.subject_name,
                        students: uniqueStudents.map(student => ({
                            student_name: student.student_name,
                            mark_value: null // Default is null 
                        }))
                    };
                    subjects.push(subjectMap[row.subject_name]);
                }
                const student = subjectMap[row.subject_name].students.find(s => s.student_name === row.student_name);
                if (student) {
                    student.mark_value = row.mark_value;
                }
            });

            return subjects;
        } catch (err) {
            console.error(err);
            throw (err);
        }
    }
}