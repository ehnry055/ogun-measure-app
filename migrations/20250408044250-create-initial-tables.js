'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('AggregatedData', {
      STATE: { type: DataTypes.STRING },
      STATEICP: { type: DataTypes.INTEGER },
      STATEFIPS: { type: DataTypes.INTEGER },
      GISJOIN: { type: DataTypes.STRING, primaryKey: true },
      COUNTYFIPS: { type: DataTypes.INTEGER },
      ALLCOUNTIES: { type: DataTypes.STRING },
      RSG_SV1: { type: DataTypes.INTEGER },
      RSG_LRA1: { type: DataTypes.INTEGER },
      RSG_SV2: { type: DataTypes.INTEGER },
      PO_LRA2: { type: DataTypes.INTEGER },
      GR_SV1: { type: DataTypes.INTEGER },
      GR_SV2: { type: DataTypes.INTEGER },
      GR_LRA2: { type: DataTypes.INTEGER },
      PI_SV1: { type: DataTypes.INTEGER },
      PI_SV2: { type: DataTypes.INTEGER },
      PI_LRA3: { type: DataTypes.INTEGER },
      IP_SV3: { type: DataTypes.INTEGER },
      OSU_SV1: { type: DataTypes.INTEGER },
      OSU_LRA1: { type: DataTypes.INTEGER },
      OSU_SV2: { type: DataTypes.INTEGER },
      HCA_SV3: { type: DataTypes.INTEGER },
      HFA_SV2: { type: DataTypes.INTEGER },
      HFA_LRA2: { type: DataTypes.INTEGER },
      HFA_SV3: { type: DataTypes.INTEGER },
      HFA_LRA3: { type: DataTypes.INTEGER },
      MM_LRA1: { type: DataTypes.INTEGER }
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('AggregatedData');
  }
};
