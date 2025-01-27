import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import StatGuage from "../StatGuage/StatGuage";

function AvgCvCard({ sales, data }) {
	let statColor = "red";

	const calculateAvgCv = () => {
		let totalCv = 0;
		let count = 0;

		sales.forEach((sale) => {
			if (data === "Serviced Only" && sale.serviced !== "Yes") return;
			if (data === "Serviced + Pending" && sale.serviced !== "Yes" && sale.serviced !== "Pending") return;

			let saleCv = sale.initialPrice + sale.monthlyPrice * 11;
			totalCv += saleCv;
			count++;
		});

		let avgCv = totalCv / count;
		if (avgCv >= 850) {
			statColor = "green";
		} else if (avgCv >= 800 && avgCv < 850) {
			statColor = "yellow";
		}

		return parseFloat(avgCv).toFixed(2);
	};

	const averageCv = calculateAvgCv();

	const card = (
		<CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
			<Typography gutterBottom sx={{ color: "text.secondary", fontSize: 14 }}>
				Avg CV
			</Typography>
			<StatGuage statValue={averageCv} statMax={850} tierColor={statColor} statText={"$"}></StatGuage>
		</CardContent>
	);
	return (
		<Box sx={{ maxWidth: 275 }}>
			<Card>{card}</Card>
		</Box>
	);
}

export default AvgCvCard;
