const { pool } = require("../db-config");

module.exports = {
    checkIfUserExists: async (username) => {
        try {
            const [result] = await pool.query(`
              SELECT * 
              FROM profile
              WHERE profile_username=?
            `, [username]);

            if (result.length === 0) {
                return false;
            }

            return true;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    createAdminProfile: async (adminInformation) => {
        try {
            const createProfile = await pool.query(`
                    INSERT INTO profile(profile_username, profile_password, name,
                    fathers_name, surname, profile_status_id_fk)
                    VALUES(?,?,?,?,?,?)
                    `, [adminInformation.username, adminInformation.password,
            adminInformation.name, adminInformation.fathers_name,
            adminInformation.surname, '1']);
            console.log('Profile created!');
            const lastInsertedProfileId = createProfile[0].insertId;
            const createAdminProfile = await pool.query(`
                INSERT INTO admin_profile(profile_id_fk)
                VALUES(?)
                `, [lastInsertedProfileId]);
            console.log('Admin profile created!');
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    createStudentProfile: async (userInformation) => {
        try {
            const getSpecialtyId = await pool.query(`
                SELECT s.specialty_id
                FROM specialty s
                INNER JOIN \`group\` g
                ON g.specialty_id_fk=s.specialty_id
                WHERE s.specialty_name=?
                `, [userInformation.specialtyName]);
            console.log('Specialty ID:', getSpecialtyId[0][0]['specialty_id']);
            const getStudentGroupHalfId = await pool.query(`
                SELECT gh.group_half_id
                FROM group_half gh
                INNER JOIN \`group\` g
                ON gh.group_id_fk=g.group_id
                WHERE g.group_number=?
                AND g.course_number=?
                AND g.specialty_id_fk=?
                AND gh.group_half_letter=?
                `,
                [userInformation.groupNumber,
                userInformation.courseNumber,
                getSpecialtyId[0][0]['specialty_id'],
                userInformation.groupHalf
                ]);

            console.log('Group Half ID:', getStudentGroupHalfId[0][0]['group_half_id']);
            const createProfile = await pool.query(`
                INSERT INTO profile(profile_username, profile_password, name,
                fathers_name, surname, profile_status_id_fk)
                VALUES(?,?,?,?,?,?)
                `, [userInformation.username, userInformation.password,
            userInformation.name, userInformation.fathers_name,
            userInformation.surname, '1']);
            const lastInsertedProfileId = createProfile[0].insertId;

            console.log('Last Inserted Profile ID:', lastInsertedProfileId);


            const createStudent = await pool.query(`
                INSERT INTO student(student_fac_num,
                student_egn,group_half_id_fk)
                VALUES(?,?,?)
            `, [userInformation.facNumber, userInformation.egn,
            getStudentGroupHalfId[0][0]['group_half_id']]);
            console.log('Student Insertion Successful');

            const createStudentProfile = await pool.query(`
                INSERT INTO student_profile(student_fac_num,
                profile_id_fk)
                VALUES(?,?)
                `, [userInformation.facNumber, lastInsertedProfileId]);
            console.log('Student Profile Insertion:', createStudentProfile);

        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    createLecturerProfile: async (userInformation) => {
        try {
            const getDepartmentId = await pool.query(`
            SELECT department_id
            FROM department
            WHERE department_abbreviation=?
            `, [userInformation.department]);

            const getTitleId = await pool.query(`
                SELECT title_id
                FROM title
                WHERE title_name=?
                `, [userInformation.title]);
            console.log('Title_id', getTitleId[0][0]['title_id']);

            const createProfile = await pool.query(` 
                INSERT INTO profile(profile_username, profile_password, 
                name, fathers_name, surname, profile_status_id_fk)
                VALUES(?,?,?,?,?,?)
                `, [userInformation.username, userInformation.password,
            userInformation.name, userInformation.fathers_name,
            userInformation.surname, '1']);
            const lastInsertedProfileId = createProfile[0].insertId;
            console.log('Profile created by Id', lastInsertedProfileId);

            const createLecturer = await pool.query(`
                INSERT INTO lecturer(lecturer_egn, title_id_fk,
                 dep_id_fk)
                 VALUES(?,?,?)
                `, [userInformation.egn, getTitleId[0][0]['title_id'], getDepartmentId[0][0]['department_id']]);
            const lastInsertedLecturerId = createLecturer[0].insertId;
            console.log('Lecturer created by Id:', lastInsertedLecturerId);

            const createLecturerProfile = await pool.query(`
                INSERT INTO lecturer_profile(lecturer_id_fk, 
                profile_id_fk)
                VALUES(?,?)
                `, [lastInsertedLecturerId, lastInsertedProfileId]);
            console.log('Lecturer profile created!');
            // console.log('Result:', getDepartmentId[0][0]['department_id']);

        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    findProfile: async (username) => {//when registering student and lecturer profiles
        try {
            const [result] = await pool.query(`
                SELECT profile_id, profile_username, profile_password
                FROM profile
                WHERE profile_username = ?
            `, [username]);

            return result[0];
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    getStudentProfile: async (username) => {//when doing a student login
        try {
            const [result] = await pool.query(`
                SELECT sp.student_profile_id, p.profile_id, p.profile_password,p.profile_status_id_fk
                FROM student_profile sp
                INNER JOIN profile p
                ON p.profile_id=sp.profile_id_fk
                WHERE p.profile_username = ?
                 AND p.profile_status_id_fk=?
            `, [username, '1']);

            return result[0];
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
    , getLecturerProfile: async (username) => {//when doing a lecturer login
        try {
            const [result] = await pool.query(`
                SELECT lp.lecturer_profile_id, p.profile_id, 
                p.profile_password,
                p.profile_status_id_fk
                FROM lecturer_profile lp
                INNER JOIN profile p
                ON p.profile_id=lp.profile_id_fk
                WHERE p.profile_username = ?
                AND p.profile_status_id_fk=?
            `, [username, '1']);

            return result[0];
        } catch (err) {
            console.error(err);
            throw err;
        }
    }, getAdminProfile: async (username) => {//when doing a admin login
        try {
            const [result] = await pool.query(`
                SELECT ap.admin_profile_id, p.profile_id, 
                p.profile_password,
                p.profile_status_id_fk
                FROM admin_profile ap
                INNER JOIN profile p
                ON p.profile_id=ap.profile_id_fk
                WHERE p.profile_username = ?
                AND p.profile_status_id_fk=?
            `, [username, '1']);
            return result[0];
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
    getStudents: async () => {
        try {
            const [result] = await pool.query(`
                SELECT *
                FROM student`);

            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    getFaculties: async () => {
        try {
            const [result] = await pool.query(`
                SELECT *
                FROM faculty`);

            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    getDepartments: async () => {
        try {
            const [result] = await pool.query(`
                SELECT f.faculty_abbreviation,dp.department_name,
                dp.department_abbreviation
                FROM department dp
                INNER JOIN faculty f
                ON dp.faculty_id_fk=f.faculty_id
                `);
            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    getSpecialties: async () => {
        try {
            const [result] = await pool.query(`
                SELECT s.specialty_id,s.specialty_abbreviation,
                s.specialty_name, s.specialty_semesters,
                dp.department_abbreviation
                FROM specialty s
                INNER JOIN department dp
                ON dp.department_id=s.department_id_fk
                `);
            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    getTitles: async () => {
        try {
            const [result] = await pool.query(`
                SELECT * 
                FROM title`);
            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    getGroups: async () => {
        try {
            const [result] = await pool.query(`
                SELECT * FROM \`group\``);
            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    getGroupNumbers: async () => {
        try {
            const [result] = await pool.query(`
                SELECT DISTINCT group_number FROM \`group\``);
            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    getGroupHalfs: async () => {
        try {
            const [result] = await pool.query(`
                SELECT DISTINCT group_half_letter FROM group_half`);
            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    getCourses: async () => {
        try {
            const [result] = await pool.query(`
                SELECT DISTINCT course_number FROM \`group\``);
            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    getSubjects: async () => {
        try {
            const [result] = await pool.query(`
                SELECT * FROM subject`);
            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    // accountRepository.js
    getGroupHalfId: async (groupHalfInfo) => {
        try {
            console.log("Group half info:", groupHalfInfo);
            const [result] = await pool.query(`
                SELECT gh.group_half_id
                FROM group_half gh
                INNER JOIN \`group\` g
                ON gh.group_id_fk=g.group_id
                INNER JOIN specialty s
                ON g.specialty_id_fk=s.specialty_id
                WHERE s.specialty_id=?
                AND g.course_number=?
                AND g.group_number=?
                AND gh.group_half_letter=?
                `,
                [groupHalfInfo.specialty,
                groupHalfInfo.courseNumber,
                groupHalfInfo.groupNumber,
                groupHalfInfo.groupHalfLetter]);

            return result;
        } catch (err) {
            console.error('Error fetching schedule by group: ', err);
            throw err;
        }
    },
    getScheduleByGroup: async (groupHalfId) => {
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
            ON p.weekday_id_fk=w.weekday_id
            INNER JOIN room r
            ON p.room_id_fk=r.room_id
            INNER JOIN building b
            ON r.building_id_fk=b.building_id
            INNER JOIN period_type pt
            ON p.period_type_id_fk=pt.period_type_id
            INNER JOIN group_half_subject ghs
            ON p.group_half_subject_id_fk=ghs.group_half_subject_id
            INNER JOIN group_half gh
            ON ghs.group_half_id_fk=gh.group_half_id
            INNER JOIN \`subject\` sj
            ON ghs.subject_id_fk=sj.subject_id
            INNER JOIN lecturer l
            ON p.lecturer_id_fk=l.lecturer_id
            INNER JOIN title t
            ON l.title_id_fk=t.title_id
            INNER JOIN lecturer_profile lp
            ON l.lecturer_id=lp.lecturer_id_fk
            INNER JOIN  \`profile\` pf
            ON lp.profile_id_fk=pf.profile_id
            WHERE gh.group_half_id=?
        `, [groupHalfId]);
            //          specialty_id, courseNumber-group input, group_number -group input,
            return result;
        } catch (err) {
            console.error('Error fetching schedule by group: ', err);
            throw err;
        }
    },

    getScheduleByLecturer: async (lecturer) => {
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
                WHERE l.lecturer_id = ?
            `, [lecturer]);

            return result;

        } catch (err) {
            console.error('Error fetching schedule by group: ', err);
            throw err;
        }
    },
    getAdminProfileInfo: async (profileId) => {
        try {

            const [result] = await pool.query(`
            SELECT name,fathers_name,surname
            FROM profile
            WHERE profile_id=?
            `, [profileId]);
            return result[0];

        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}