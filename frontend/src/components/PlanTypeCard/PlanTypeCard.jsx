import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function PlanTypeCard({ sales, data }) {
	const calcPlanType = () => {
		let basicCount = 0;
		let proCount = 0;
		let premiumCount = 0;
		sales.forEach((sale) => {
			if (data === "Serviced Only" && sale.serviced !== "Yes") return;
			if (data === "Serviced + Pending" && sale.serviced !== "Yes" && sale.serviced !== "Pending") return;

			if (sale.planType === "Basic") basicCount++;
			if (sale.planType === "Pro") proCount++;
			if (sale.planType === "Premium") premiumCount++;
		});

		return { basicCount, proCount, premiumCount };
	};

	const planTypes = calcPlanType();

	const card = (
		<CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
			<Typography gutterBottom sx={{ color: "text.secondary", fontSize: 14 }}>
				Plan Type
			</Typography>
			<PieChart
				series={[
					{
						data: [
							{ value: planTypes.basicCount, color: "#EAECDA", label: "Basic" },
							{ value: planTypes.proCount, color: "#B8CCC9", label: "Pro" },
							{ value: planTypes.premiumCount, color: "#78856E", label: "Premium" },
						],
						arcLabel: (item) => `${item.value}`,
						arcLabelMinAngle: 25,
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
		<Box sx={{ width: 530 }}>
			<Card>{card}</Card>
		</Box>
	);
}

export default PlanTypeCard;
