"use strict";

const { User } = require("../models");
const bcrypt = require("bcryptjs");
const user = require("../models/user");
const { Op } = require("sequelize");

let options = {};
if (process.env.NODE_ENV === "production") {
	options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await User.bulkCreate(
			[
				{
					username: "demo-closer",
					email: "closer@goaptive.com",
					hashedPassword: bcrypt.hashSync("password"),
					name: "Demo Closer",
					role: "closer",
				},
				{
					username: "demo-manager",
					email: "manager@goaptive.com",
					hashedPassword: bcrypt.hashSync("password"),
					name: "Demo Manager",
					role: "manager",
				},
			],
			{ validate: true }
		);
	},

	async down(queryInterface, Sequelize) {
		options.tableName = "Users";
		return queryInterface.bulkDelete(
			options,
			{
				role: { [Op.in]: ["closer", "manager"] },
			},
			{}
		);
	},
};
