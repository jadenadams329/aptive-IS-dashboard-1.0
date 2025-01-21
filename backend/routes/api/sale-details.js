const express = require("express");
const { requireAuth } = require("../../utils/auth");
const { Sale_Details } = require("../../db/models");

const router = express.Router();

//Get sales by current user
router.get("/user-sales", requireAuth, async (req, res, next) => {
	try {
		const { user } = req;
		const userSales = await Sale_Details.findAll({
			where: {
				userId: user.id,
			},
			order: [["createdAt", "DESC"]]
		});
		res.json(userSales);
	} catch (err) {
		next(err);
	}
});

//Delete Sale by id
router.delete("/:id", requireAuth, async (req, res, next) => {
	try {
		const saleId = req.params.id;
		const { user } = req;
		const saleDetails = await Sale_Details.findByPk(saleId);

		if (!saleDetails) {
			const err = new Error("Sale not found");
			err.title = "Not Found";
			err.status = 404;
			return next(err);
		}

		if (saleDetails.userId !== user.id && user.role !== "manager") {
			const err = new Error("Forbidden - Only the user who created the sale or a manager can delete this sale");
			err.title = "Forbidden";
			err.status = 403;
			return next(err);
		}

		await saleDetails.destroy();
		return res.json({ message: "Sale deleted" });
	} catch (err) {
		next(err);
	}
});

//Update Sale by id
router.put("/:id", requireAuth, async (req, res, next) => {
	try {
		const saleId = req.params.id;
		const { user } = req;
		const saleDetails = await Sale_Details.findByPk(saleId);

		if (!saleDetails) {
			const err = new Error("Sale not found");
			err.title = "Not Found";
			err.status = 404;
			return next(err);
		}

		if (saleDetails.userId !== user.id && user.role !== "manager") {
			const err = new Error("Forbidden - Only the user who created the sale or a manager can edit this sale");
			err.title = "Forbidden";
			err.status = 403;
			return next(err);
		}

        const { accountNumber, agreementLength, planType, initialPrice, monthlyPrice, autopay, ach, serviceDate, serviced } =
			req.body;

        await saleDetails.update({
            accountNumber,
            agreementLength,
            planType,
            initialPrice,
            monthlyPrice,
            autopay,
            ach,
            serviceDate,
            serviced,
        });

        return res.json(saleDetails);

	} catch (err) {
		next(err);
	}
});

//Get all sales
router.get("/", requireAuth, async (req, res, next) => {
	try {
		const sales = await Sale_Details.findAll();
		res.json(sales);
	} catch (err) {
		next(err);
	}
});

//Create a sale
router.post("/", requireAuth, async (req, res, next) => {
	try {
		const { user } = req;
		const { accountNumber, agreementLength, planType, initialPrice, monthlyPrice, autopay, ach, serviceDate } =
			req.body;

		const newSale = await Sale_Details.create({
			userId: user.id,
			accountNumber,
			agreementLength,
			planType,
			initialPrice,
			monthlyPrice,
			autopay,
			ach,
			serviceDate,
			serviced: "Pending",
		});

		const sale = await Sale_Details.findByPk(newSale.id);
		return res.status(201).json(sale);
	} catch (err) {
		next(err);
	}
});

module.exports = router;
