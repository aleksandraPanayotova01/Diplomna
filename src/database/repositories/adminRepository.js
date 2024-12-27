const { pool } = require("../db-config");
module.exports = {
    getAdminProfileInfo: async (profileId) => {
        try {

            const [result] = await pool.query(`
            SELECT \`name\`, \`fathers_name\`, \`surname\`
        FROM \`profile\`
        WHERE \`profile_id\` = ?
            `, [profileId]);
            return result[0];

        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    getUserInfo: async (username) => {
        try {

            const [result] = await pool.query(`
                SELECT p.name, p.fathers_name, p.surname, ps.profile_status_name
                FROM profile p
                INNER JOIN profile_status ps
                ON p.profile_status_id_fk=ps.profile_status_id
                WHERE p.profile_username=?
            `, [username]);

            return result;
        } catch (err) {
            console.error('Error fetching subjects:', err);
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
    getConsultations: async () => {
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
                    lecturer l ON lp.lecturer_id_fk = l.lecturer_id
                INNER JOIN 
                    title t ON l.title_id_fk = t.title_id
            `);

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
    , searchSubjects: async (subjectName) => {
        try {
            const subjectNameWithWildCard = `%${subjectName}%`; // For partial matching
            const [result] = await pool.query(`
                SELECT DISTINCT 
                s.subject_name,s.subject_abbreviation,sp.specialty_abbreviation,
                s.is_active
                FROM subject s
                INNER JOIN specialty sp
                ON s.specialty_id_fk=sp.specialty_id
                WHERE subject_name LIKE ? AND is_active=?
            `, [subjectNameWithWildCard, 1]);

            return result;
        } catch (err) {
            console.error('Error fetching subjects:', err);
            throw err;
        }
    },
    searchSubjectsSpecialty: async (specialtyId) => {
        try {
            const [result] = await pool.query(`
              SELECT subject_id, subject_name, subject_abbreviation
                FROM subject
                WHERE specialty_id_fk = ? AND is_active=?
            `, [specialtyId, 1]);

            return result;
        } catch (error) {
            console.error("Database error:", error);
            throw error;
        }
    },
    updateStatus: async (profileInformation) => {
        try {
            const [result] = await pool.query(`
                UPDATE profile
                SET profile_status_id_fk = ?
                WHERE profile_username = ?
            `, [profileInformation.status, profileInformation.username]);

            return result;
        } catch (error) {
            console.error("Database error:", error);
            throw error;
        }
    },

}