'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('AggregatedData', {
      STATE: { type: Sequelize.DataTypes.STRING },
      STATEICP: { type: Sequelize.DataTypes.INTEGER },
      STATEFIPS: { type: Sequelize.DataTypes.INTEGER },
      GISJOIN: { type: Sequelize.DataTypes.STRING, primaryKey: true },
      COUNTYFIPS: { type: Sequelize.DataTypes.INTEGER },
      ALLCOUNTIES: { type: Sequelize.DataTypes.STRING },
      RSG_SV1: { type: Sequelize.DataTypes.INTEGER },
      RSG_LRA1: { type: Sequelize.DataTypes.INTEGER },
      RSG_SV2: { type: Sequelize.DataTypes.INTEGER },
      PO_LRA2: { type: Sequelize.DataTypes.INTEGER },
      GR_SV1: { type: Sequelize.DataTypes.INTEGER },
      GR_SV2: { type: Sequelize.DataTypes.INTEGER },
      GR_LRA2: { type: Sequelize.DataTypes.INTEGER },
      PI_SV1: { type: Sequelize.DataTypes.INTEGER },
      PI_SV2: { type: Sequelize.DataTypes.INTEGER },
      PI_LRA3: { type: Sequelize.DataTypes.INTEGER },
      IP_SV3: { type: Sequelize.DataTypes.INTEGER },
      OSU_SV1: { type: Sequelize.DataTypes.INTEGER },
      OSU_LRA1: { type: Sequelize.DataTypes.INTEGER },
      OSU_SV2: { type: Sequelize.DataTypes.INTEGER },
      HCA_SV3: { type: Sequelize.DataTypes.INTEGER },
      HFA_SV2: { type: Sequelize.DataTypes.INTEGER },
      HFA_LRA2: { type: Sequelize.DataTypes.INTEGER },
      HFA_SV3: { type: Sequelize.DataTypes.INTEGER },
      HFA_LRA3: { type: Sequelize.DataTypes.INTEGER },
      MM_LRA1: { type: Sequelize.DataTypes.INTEGER }
    });
  },

  async down (queryInterface) {
    await queryInterface.dropTable('AggregatedData');
  }
};
