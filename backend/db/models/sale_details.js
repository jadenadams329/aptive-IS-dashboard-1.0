"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Sale_Details extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	Sale_Details.init(
		{
			userId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			accountNumber: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			agreementLength: {
				type: DataTypes.ENUM("12 Months", "24 Months"),
				allowNull: false,
			},
			planType: {
				type: DataTypes.ENUM("Basic", "Pro", "Premium"),
				allowNull: false,
			},
			initialPrice: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			monthlyPrice: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			autopay: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
			},
			ach: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
			},
			serviceDate: {
				type: DataTypes.DATEONLY,
				allowNull: true,
			},
			serviced: {
				type: DataTypes.ENUM("Yes", "No", "Pending"),
				allowNull: false,
				defaultValue: "Pending",
			},
		},
		{
			sequelize,
			modelName: "Sale_Details",
		}
	);
	return Sale_Details;
};
