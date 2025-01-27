import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function AutopayCard({ sales, data }) {
	const calcAutopay = () => {
		let none = 0;
		let ach = 0;
		let cc = 0;
		let total = 0;
		sales.forEach((sale) => {
			if (data === "Serviced Only" && sale.serviced !== "Yes") return;
			if (data === "Serviced + Pending" && sale.serviced !== "Yes" && sale.serviced !== "Pending") return;

			if (!sale.ach && sale.autopay) {
				cc++;
			}

			if (sale.ach && sale.autopay) {
				ach++;
			}

			if (!sale.ach && !sale.autopay) {
				none++;
			}

			total++
		});

		const easyPayPercent = parseFloat((((cc + ach) / total) * 100).toFixed(2));
		const nonePercent = parseFloat(((none / total) * 100).toFixed(2));
		const achPercent = parseFloat(((ach / total) * 100).toFixed(2));
		const ccPercent = parseFloat(((cc / total) * 100).toFixed(2));

		const autoPayTotals = {
			easyPayTotal: easyPayPercent,
			nonePercent,
			achPercent,
			ccPercent,
		};

		return autoPayTotals;
	};

	const autoPayTotals = calcAutopay();

	const card = (
		<CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
			<Typography gutterBottom sx={{ color: "text.secondary", fontSize: 14 }}>
				Easy Pay %
			</Typography>
			<PieChart
				series={[
					{

						data: [
							{ value: autoPayTotals.nonePercent, color: "red", label: "None" },
							{ value: autoPayTotals.ccPercent, color: "lightGreen", label: "CC" },
							{ value: autoPayTotals.achPercent, color: "green", label: "ACH" },
						],
						arcLabel: (item) => `${item.value}%`,
						arcLabelMinAngle: 60,
						arcLabelRadius: "55%",
					},
				]}
				sx={{
					[`& .${pieArcLabelClasses.root}`]: {
						fontWeight: "bold",
					},
				}}
				height={200}
			/>
		</CardContent>
	);

	return (
		<Box sx={{ width: 530}}>
			<Card>{card}</Card>
		</Box>
	);
}

export default AutopayCard;
