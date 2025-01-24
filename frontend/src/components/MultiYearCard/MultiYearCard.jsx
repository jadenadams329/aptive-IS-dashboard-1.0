import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import StatGuage from "../StatGuage/StatGuage";

function MultiYearCard({ sales, data }) {
	let statColor = "red";

	const calculateMultiYear = () => {
		let totalMultiYear = 0;
		let count = 0;
		sales.forEach((sale) => {
			if (data === "Serviced Only" && sale.serviced !== "Yes") return;
			if (data === "Serviced + Pending" && sale.serviced !== "Yes" && sale.serviced !== "Pending") return;

			if (sale.agreementLength === "24 Months") {
				totalMultiYear++;
			}
			count++;
		});

		let multiYearRate = parseFloat(((totalMultiYear / count) * 100).toFixed(2));

		if (multiYearRate >= 60) {
			statColor = "green";
		} else if (multiYearRate >= 55 && multiYearRate < 60) {
			statColor = "red";
		}

		return multiYearRate;
	};

	const multiYearPercentage = calculateMultiYear();

	const card = (
		<CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
			<Typography gutterBottom sx={{ color: "text.secondary", fontSize: 14 }}>
				Multi Year %
			</Typography>
			<StatGuage statValue={multiYearPercentage} statMax={70} tierColor={statColor} statText={"%"}></StatGuage>
		</CardContent>
	);
	return (
		<Box sx={{ maxWidth: 275 }}>
			<Card variant='outlined'>{card}</Card>
		</Box>
	);
}

export default MultiYearCard;
