"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'avatar_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'files',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true
    });
  },
  down: queryInterface => {
    return queryInterface.removeColumn('users', 'avatar_id');
  }
};
//# sourceMappingURL=20190916152735-add-avatar-field-to-users.js.map