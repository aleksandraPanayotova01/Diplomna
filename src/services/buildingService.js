const buildingRepository = require('../database/repositories/buildingRepository');

module.exports = {
    addBuilding: async (buildingName) => {
        const addedBuilding = await buildingRepository.checkIfBuildingExists(buildingName);
        if (!addedBuilding) {//checks if the building is already added
            await buildingRepository.createBuilding(buildingName);
        }
    }
}