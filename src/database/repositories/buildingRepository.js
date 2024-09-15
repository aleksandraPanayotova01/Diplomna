const { pool } = require("../db-config");
module.exports = {
    queryBuildings: async () => {
        try {
            const [result] = await pool.query(`
                SELECT *
                FROM building
            `);

            return result;
        } catch(err) {
            console.error(err);
            throw err;
        }
    },
    checkIfBuildingExists: async (buildingName) => {
        try {
            const [result] = await pool.query(`
                SELECT * FROM building WHERE building_name= ?`, [buildingName]);
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
    createBuilding: async (buildingName) => {
        try {
            await pool.query(`
                INSERT INTO building(building_name)
                VALUES (?)`, [buildingName]);
        } catch (err) {
            console.error(err);
            throw (err);
        }
    }
}