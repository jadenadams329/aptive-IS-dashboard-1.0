import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import StatGuage from "../StatGuage/StatGuage";

function ServiceRateCard({ sales }) {
	let statColor = "red";

	const calculateServiceRate = () => {
		let totalSales = 0;
		let servicedSales = 0;

		sales.forEach((sale) => {
			if (sale.serviced === "Pending") return;

			totalSales++;
			if (sale.serviced === "Yes") {
				servicedSales++;
			}
		});

		let sr = parseFloat(((servicedSales / totalSales) * 100).toFixed(2));
		if (sr >= 70) {
			statColor = "green";
		} else if (sr >= 65 && sr < 70) {
			statColor = "yellow";
		}

		return sr;
	};

	const serviceRate = calculateServiceRate();

	const card = (
		<CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
			<Typography gutterBottom sx={{ color: "text.secondary", fontSize: 14 }}>
				Service Rate
			</Typography>
			<StatGuage statValue={serviceRate} statMax={70} tierColor={statColor} statText={"%"}></StatGuage>
		</CardContent>
	);
	return (
		<Box sx={{ maxWidth: 275 }}>
			<Card variant='outlined'>{card}</Card>
		</Box>
	);
}

export default ServiceRateCard;
