import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function CommissionCard({sales, tier, data}) {

    const calculateCommission = () => {
        let commission = 0;

        sales.forEach((sale) => {
            if (data === "Serviced Only" && sale.serviced !== "Yes") return;
            if (data === "Serviced + Pending" && sale.serviced !== "Yes" && sale.serviced !== "Pending") return;

            let saleCommission = 0;
            switch (tier) {
                case "Training":
                    if (sale.planType === "Basic") saleCommission = 10;
                    else if (sale.planType === "Pro") saleCommission = 20;
                    else if (sale.planType === "Premium") saleCommission = 30;
                    break;
                case "Rep":
                    if (sale.planType === "Basic") saleCommission = 20;
                    else if (sale.planType === "Pro") saleCommission = 35;
                    else if (sale.planType === "Premium") saleCommission = 50;
                    break;
                case "Pro":
                    if (sale.planType === "Basic") saleCommission = 35;
                    else if (sale.planType === "Pro") saleCommission = 50;
                    else if (sale.planType === "Premium") saleCommission = 60;
                    break;
                default:
                    break;
            }

            commission += saleCommission;
        });

        return commission;
    };

    const commission = calculateCommission();

	const card = (
		<CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
			<Typography gutterBottom sx={{ color: "text.secondary", fontSize: 14 }}>
				Commission
			</Typography>
            <Typography variant="h5">
                ${commission}
            </Typography>
		</CardContent>
	);

	return (
		<Box sx={{ width: 200}}>
			<Card>{card}</Card>
		</Box>
	);
}

export default CommissionCard;
