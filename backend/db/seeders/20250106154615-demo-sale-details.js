"use strict";
const { Sale_Details } = require("../models");
let options = {};
if (process.env.NODE_ENV === "production") {
	options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		(options.tableName = "Sale_Details"), (options.validate = true);
		await Sale_Details.bulkCreate(
			[
				{
					userId: 9,
					accountNumber: 123456,
					agreementLength: "12 Months",
					planType: "Pro",
					initialPrice: 99,
					monthlyPrice: 70,
					autopay: true,
					ach: false,
					serviceDate: "2022-01-20",
					serviced: "Pending",
				},
				{
					userId: 9,
					accountNumber: 654321,
					agreementLength: "24 Months",
					planType: "Pro",
					initialPrice: 149,
					monthlyPrice: 65,
					autopay: true,
					ach: true,
					serviceDate: "2022-01-19",
					serviced: "Pending",
				},
			],
			options
		);
	},

	async down(queryInterface, Sequelize) {
		const Op = Sequelize.Op;
		options.tableName = "Sale_Details";
		return queryInterface.bulkDelete(options, {
			userId: { [Op.in]: [9] },
		});
	},
};
