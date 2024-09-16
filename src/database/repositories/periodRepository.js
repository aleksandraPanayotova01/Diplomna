const { pool } = require("../db-config");

module.exports = {
    getPeriodsForStudent: async (studentProfileId) => {
        try {
            const [result] = await pool.query(`
                SELECT 
                    p.period_id, 
                    w.weekday_name, 
                    p.period_start_time, 
                    p.period_end_time, 
                    b.building_abbreviation,
                    r.room_number, 
                    pt.period_type_name, 
                    sj.subject_name, 
                    t.title_name, 
                    pf.surname
                FROM period p
                INNER JOIN weekday w
                    ON p.weekday_id_fk = w.weekday_id
                INNER JOIN room r
                    ON p.room_id_fk = r.room_id
                INNER JOIN building b
                    ON b.building_id = r.building_id_fk
                INNER JOIN lecturer l
                    ON p.lecturer_id_fk = l.lecturer_id
                INNER JOIN title t
                    ON l.title_id_fk = t.title_id
                INNER JOIN lecturer_profile lp
                    ON lp.lecturer_id_fk = l.lecturer_id
                INNER JOIN \`profile\` pf
                    ON lp.profile_id_fk = pf.profile_id
                INNER JOIN group_half_subject ghs
                    ON p.group_half_subject_id_fk = ghs.group_half_subject_id
                INNER JOIN \`subject\` sj
                    ON ghs.subject_id_fk = sj.subject_id
                INNER JOIN period_type pt
                    ON p.period_type_id_fk = pt.period_type_id
                INNER JOIN group_half gh
                    ON gh.group_half_id = ghs.group_half_id_fk
                INNER JOIN student s
                    ON gh.group_half_id = s.group_half_id_fk
                INNER JOIN student_profile sp
                    ON s.student_fac_num = sp.student_fac_num
                WHERE sp.student_profile_id = ?
            `, [studentProfileId]);

            return result;
        } catch (err) {
            console.error('Error fetching periods for student:', err);
            throw err;
        }
    },
    getPeriodsForLecturer: async (profileId) => {
        try {
            const [result] = await pool.query(`
                SELECT DISTINCT
                    p.period_id, 
                    w.weekday_name, 
                    p.period_start_time, 
                    p.period_end_time, 
                    b.building_abbreviation,
                    r.room_number, 
                    pt.period_type_name, 
                    sj.subject_name, 
                    g.group_number,
                    gh.group_half_letter,
                    g.course_number,
                    s.specialty_abbreviation
                FROM period p
                INNER JOIN weekday w
                    ON p.weekday_id_fk = w.weekday_id
                INNER JOIN room r
                    ON p.room_id_fk = r.room_id
                INNER JOIN building b
                    ON b.building_id = r.building_id_fk
                INNER JOIN group_half_subject ghs
                    ON p.group_half_subject_id_fk = ghs.group_half_subject_id
                INNER JOIN \`subject\` sj
                    ON ghs.subject_id_fk = sj.subject_id
                INNER JOIN lecturer_subject ls
                    ON sj.subject_id=ls.subject_id_fk
                INNER JOIN lecturer l
                    ON ls.lecturer_id_fk=l.lecturer_id
                INNER JOIN lecturer_profile lp
                    ON lp.lecturer_id_fk=l.lecturer_id
                INNER JOIN profile pr
                    ON lp.profile_id_fk=pr.profile_id
                INNER JOIN period_type pt
                    ON p.period_type_id_fk = pt.period_type_id
                INNER JOIN group_half gh
                    ON gh.group_half_id = ghs.group_half_id_fk
                INNER JOIN \`group\` g
                    ON gh.group_id_fk=g.group_id
                INNER JOIN specialty s
                    ON g.specialty_id_fk=s.specialty_id
                WHERE pr.profile_id = ?
            `, [profileId]);
            console.log(profileId);
            return result;
        } catch (err) {
            console.error('Error fetching periods for student:', err);
            throw err;
        }
    },
    getStudentGroupAndHalf: async (studentProfileId) => {
        try {
            const [result] = await pool.query(`
                SELECT g.group_number,gh.group_half_letter
                FROM student_profile sp
                INNER JOIN student s
                ON sp.student_fac_num=s.student_fac_num
                INNER JOIN group_half gh
                ON s.group_half_id_fk=gh.group_half_id
                INNER JOIN \`group\` g
                ON gh.group_id_fk=g.group_id
                WHERE sp.student_profile_id=?
                `, [studentProfileId]);
            return result;
        } catch (err) {
            console.error('Error fetching periods for student:', err);
            throw err;
        }
    },
    getLecturers: async () => {
        try {
            const [result] = await pool.query(`
                SELECT l.lecturer_id,t.title_name,p.name,p.fathers_name,p.surname
                FROM lecturer l
                INNER JOIN lecturer_profile lp
                ON l.lecturer_id=lp.lecturer_id_fk
                INNER JOIN profile p
                ON lp.profile_id_fk=p.profile_id
                INNER JOIN title t
                ON l.title_id_fk=t.title_id`);
            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    getGroupHalfs: async (groupSpecialtyName, courseNumber) => {
        try {
            const [result] = await pool.query(`
                SELECT g.group_number,gh.group_half_letter,gh.group_half_id
                FROM \`group\` g
                INNER JOIN group_half gh
                ON g.group_id=gh.group_id_fk
                INNER JOIN specialty s
                ON g.specialty_id_fk=s.specialty_id
                WHERE s.specialty_name=? AND g.course_number = ?
                `, [groupSpecialtyName, courseNumber]);
            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    getSubjectsHalf: async (groupHalfId) => {
        try {
            const [result] = await pool.query(`
                SELECT s.subject_id, s.subject_name
                FROM group_half_subject ghs
                INNER JOIN \`subject\` s 
                ON ghs.subject_id_fk = s.subject_id
                WHERE ghs.group_half_id_fk = ?
                AND ghs.group_half_subject_id = (
                    SELECT MIN(ghs2.group_half_subject_id)
                    FROM group_half_subject ghs2
                    WHERE ghs2.subject_id_fk = ghs.subject_id_fk
                    AND ghs2.group_half_id_fk = ghs.group_half_id_fk
                )
            `, [groupHalfId]);
            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    // getSubjectsHalf: async (groupHalfId) => {
    //     try {
    //         const [result] = await pool.query(`
    //             SELECT s.subject_id, s.subject_name, ghs.group_half_subject_id
    //             FROM group_half_subject ghs
    //             INNER JOIN \`subject\` s 
    //             ON ghs.subject_id_fk = s.subject_id
    //             WHERE ghs.group_half_id_fk = ?
    //             AND ghs.group_half_subject_id = (
    //                 SELECT MIN(ghs2.group_half_subject_id)
    //                 FROM group_half_subject ghs2
    //                 WHERE ghs2.subject_id_fk = ghs.subject_id_fk
    //                 AND ghs2.group_half_id_fk = ghs.group_half_id_fk
    //             )
    //         `, [groupHalfId]);
    //         return result;
    //     } catch (err) {
    //         console.error(err);
    //         throw err;
    //     }
    // },
    // getSubjectsHalf1: async (groupHalfId) => {//with period type
    //     try {
    //         const [result] = await pool.query(`
    //          SELECT s.subject_id, s.subject_name, ghs.group_half_subject_id
    //             FROM group_half_subject ghs
    //             INNER JOIN \`subject\` s 
    //             ON ghs.subject_id_fk = s.subject_id
    //             WHERE ghs.group_half_id_fk = ?
    //             AND ghs.group_half_subject_id = (
    //                 SELECT MIN(ghs2.group_half_subject_id)
    //                 FROM group_half_subject ghs2
    //                 WHERE ghs2.subject_id_fk = ghs.subject_id_fk
    //                 AND ghs2.group_half_id_fk = ghs.group_half_id_fk
    //         )
    //         `, [groupHalfId]);

    //         return result;
    //     } catch (err) {
    //         console.error(err);
    //         throw err;
    //     }
    // },




    getWeekdays: async () => {
        try {
            const [result] = await pool.query(`
                SELECT weekday_id, weekday_name 
                FROM weekday`);
            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    getRooms: async () => {
        try {
            const [result] = await pool.query(`
            SELECT r.room_id, r.room_number, b.building_abbreviation
            FROM room r
            INNER JOIN building b
            ON r.building_id_fk=b.building_id
            `);
            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    getLecturers: async () => {
        try {
            const [result] = await pool.query(`
            SELECT t.title_name, p.name, p.surname,l.lecturer_id
            FROM lecturer l
            INNER JOIN title t
            ON l.title_id_fk=t.title_id
            INNER JOIN lecturer_profile lp
            ON lp.lecturer_id_fk=l.lecturer_id
            INNER JOIN profile p
            ON lp.profile_id_fk=p.profile_id
            `);
            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    getPeriodTypes: async () => {
        try {
            const [result] = await pool.query(`
                SELECT period_type_id, period_type_name 
                FROM period_type`);
            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }, getGroupHalfSubjectId: async (groupHalfSubjectInformation) => {
        try {
            const [result] = await pool.query(`
                SELECT group_half_subject_id
                FROM group_half_subject
                WHERE group_half_id_fk=?
                AND subject_id_fk=?
                `, [groupHalfSubjectInformation.selectGroupHalf,
            groupHalfSubjectInformation.selectSubject]);
            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    addPeriod: async (periodInformation) => {
        try {
            const [result] = await pool.query(`
                INSERT INTO period(
                period_start_time, period_end_time, weekday_id_fk,
                room_id_fk, lecturer_id_fk, group_half_subject_id_fk,
                period_type_id_fk) VALUES(?,?,?,?,?,?,?)`,
                [periodInformation.period_start_time,
                periodInformation.period_end_time,
                periodInformation.weekday,
                periodInformation.room,
                periodInformation.lecturer,
                periodInformation.group_half_subject_id_fk,
                periodInformation.period_type]
            );
            console.log("Period added!");
            const lastInsertedPeriodId = result.insertId;
            console.log('LastInsertedPeriodId:', lastInsertedPeriodId);

            const [getGroupHalfId] = await pool.query(`
                SELECT gh.group_half_id
                FROM group_half_subject ghs
                INNER JOIN group_half gh
                ON gh.group_half_id=ghs.group_half_id_fk
                WHERE ghs.group_half_subject_id=?`,
                [periodInformation.group_half_subject_id_fk]
            );
            console.log("Group half id:", getGroupHalfId[0]['group_half_id']);

            const createPeriodSchedule = await pool.query(`
                INSERT INTO period_schedule(group_half_id_fk, period_id_fk)
                VALUES (?, ?)`,
                [getGroupHalfId[0]['group_half_id'], lastInsertedPeriodId]
            );
            console.log("Period schedule created!");

            const [getSubjectId] = await pool.query(`
                SELECT s.subject_id
                FROM group_half_subject ghs
                INNER JOIN subject s
                ON ghs.subject_id_fk=s.subject_id
                WHERE ghs.group_half_subject_id=?`,
                [periodInformation.group_half_subject_id_fk]
            );
            console.log("Subject Id:", getSubjectId[0]['subject_id']);

            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    // checkAvailabilityLecture: async (periodInformation) => {
    //     try {
    //         const [result] = await pool.query(`
    //             SELECT p.period_id
    //             FROM period p
    //             INNER JOIN group_half_subject ghs
    //             ON p.group_half_subject_id_fk=ghs.group_half_subject_id   
    //             WHERE ((
    //                 (p.period_start_time < ? AND p.period_end_time > ?) OR
    //                 (p.period_start_time < ? AND p.period_end_time > ?)
    //             )
    //             AND p.weekday_id_fk=?)
    //             AND ghs.group_half_id_fk=?
    //             `, [
    //             periodInformation.period_start_time,
    //             periodInformation.period_end_time,
    //             periodInformation.period_start_time,
    //             periodInformation.period_end_time,
    //             periodInformation.weekday,
    //             periodInformation.groupHalfId
    //         ]);
    //         if (result.length === 0) {
    //             return true;
    //         }
    //         return false;
    //     } catch (err) {
    //         console.error(err);
    //         throw err;
    //     }
    // },
    checkAvailabilityLecture: async (periodInformation) => {
        try {
            const [result] = await pool.query(`
                SELECT p.period_id
                FROM period p
                INNER JOIN group_half_subject ghs
                ON p.group_half_subject_id_fk = ghs.group_half_subject_id   
                WHERE (
                    (p.period_start_time <= ? AND p.period_end_time > ?) OR
                    (p.period_start_time < ? AND p.period_end_time >= ?) OR
                    (p.period_start_time >= ? AND p.period_end_time <= ?)
                )
                AND p.weekday_id_fk = ?
                AND ghs.group_half_id_fk = ?
            `, [
                periodInformation.period_start_time,
                periodInformation.period_start_time,
                periodInformation.period_end_time,
                periodInformation.period_end_time,
                periodInformation.period_start_time,
                periodInformation.period_end_time,
                periodInformation.weekday,
                periodInformation.groupHalfId
            ]);

            console.log("Query Result:", result);  // Debug log

            if (result.length === 0) {
                return true;  // No conflicts found
            }
            return false;  // Conflicts found
        } catch (err) {
            console.error("Error in checkAvailabilityLecture:", err);
            throw err;
        }
    },

    checkAvailabilityExcercise: async (periodInformation) => {
        try {
            const [result] = await pool.query(`
                SELECT p.period_id
                FROM period p 
                INNER JOIN group_half_subject ghs
                ON p.group_half_subject_id_fk = ghs.group_half_subject_id 
                WHERE (
                    (p.period_start_time <= ? AND p.period_end_time > ?) OR
                    (p.period_start_time < ? AND p.period_end_time >= ?) OR
                    (p.period_start_time >= ? AND p.period_end_time <= ?)
                )
                AND p.weekday_id_fk = ?
                AND (p.room_id_fk = ? OR p.lecturer_id_fk = ? OR ghs.group_half_id_fk = ?)
            `, [
                periodInformation.period_start_time,
                periodInformation.period_start_time,
                periodInformation.period_end_time,
                periodInformation.period_end_time,
                periodInformation.period_start_time,
                periodInformation.period_end_time,
                periodInformation.weekday,
                periodInformation.room,
                periodInformation.lecturer,
                periodInformation.groupHalfId
            ]);

            console.log("Query Result:", result);  // Log the result for debugging
            if (result.length === 0) {
                return true;  // No conflicts found
            }
            return false;  // Conflicts found
        } catch (err) {
            console.error("Error in checkAvailabilityExcercise:", err);
            throw err;
        }
    },

    getCourseNumberSpecialty: async (specialty) => {
        try {
            const [result] = await pool.query(`
                SELECT specialty_semesters
                FROM specialty
                WHERE specialty_name=?
                `, [specialty]);
            return result;

        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    getStudentProfileInfo: async (studentProfileId) => {
        try {

            const [result] = await pool.query(`
                    SELECT p.name, p.fathers_name, p.surname, s.student_fac_num,
                           ed.degree_name, fe.form_of_education_name, f.faculty_name,
                           d.department_name, sc.specialty_name, g.group_number,
                           gh.group_half_letter, g.course_number, g.semester_number
                    FROM student_profile sp
                    INNER JOIN profile p
                    ON sp.profile_id_fk=p.profile_id
                    INNER JOIN student s
                    ON sp.student_fac_num = s.student_fac_num
                    INNER JOIN group_half gh
                    ON s.group_half_id_fk = gh.group_half_id
                    INNER JOIN \`group\` g
                    ON gh.group_id_fk = g.group_id
                    INNER JOIN specialty sc
                    ON g.specialty_id_fk = sc.specialty_id
                    INNER JOIN department d
                    ON sc.department_id_fk = d.department_id
                    INNER JOIN faculty f
                    ON d.faculty_id_fk = f.faculty_id
                    INNER JOIN education_degree ed
                    ON sc.degree_id_fk = ed.degree_id
                    INNER JOIN form_of_education fe
                    ON sc.form_of_education_fk = fe.form_of_education_id
                    WHERE sp.student_profile_id = ?
                `, [studentProfileId]);

            return result[0];

        } catch (err) {
            console.error(err);
            throw err;
        }
    }, getLecturerProfileInfo: async (lecturerProfileId) => {
        try {

            const [result] = await pool.query(`
                 SELECT t.title_name,p.name, p.fathers_name, p.surname,
                 f.faculty_name,
                 d.department_name
                 FROM profile p
                 INNER JOIN lecturer_profile lp
                 ON lp.profile_id_fk=p.profile_id
                 INNER JOIN lecturer l
                 ON lp.lecturer_id_fk=l.lecturer_id
                 INNER JOIN title t
                 ON l.title_id_fk=t.title_id
                 INNER JOIN department d
                 ON l.dep_id_fk=d.department_id
                 INNER JOIN faculty f
                 ON d.faculty_id_fk=f.faculty_id
                 WHERE lp.lecturer_profile_id=?
                `, [lecturerProfileId]);
            return result[0];

        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    // getAdminProfileInfo: async (profileId) => {
    //     try {

    //         const [result] = await pool.query(`
    //             SELECT \`name\`, \`fathers_name\`, \`surname\`
    //         FROM \`profile\`
    //         WHERE \`profile_id\` = ?
    //             `, [profileId]);
    //         return result[0];

    //     } catch (err) {
    //         console.error(err);
    //         throw err;
    //     }
    // }
}