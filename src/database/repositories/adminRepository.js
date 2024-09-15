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
}