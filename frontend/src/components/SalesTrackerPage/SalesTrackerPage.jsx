import { useSelector } from "react-redux";
import { useState } from "react";
import SalesTrackerTable from "./SalesTrackerTable";
import NewSaleButton from "../NewSaleButton/NewSaleButton";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";

function CustomTabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role='tabpanel'
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && <Box sx={{ p: 3 }}>{children}</Box>}
		</div>
	);
}

CustomTabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.number.isRequired,
	value: PropTypes.number.isRequired,
};

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		"aria-controls": `simple-tabpanel-${index}`,
	};
}

function SalesTrackerPage() {
	const sessionUser = useSelector((state) => state.session.user);
	const [value, setValue] = useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	return (
		<>
			<Box sx={{ width: "100%" }}>
				<Box sx={{ borderBottom: 1, borderColor: "divider", color: "black" }}>
					<Tabs value={value} onChange={handleChange}>
						<Tab label='Sales Tracker' {...a11yProps(0)} />
						<Tab label='Stats' {...a11yProps(1)} />
					</Tabs>
				</Box>
				<CustomTabPanel value={value} index={0}>
					<div>
						<h1>Sales Tracker</h1>
						<p>Welcome to the Sales Tracker Page, {sessionUser.name}!</p>
						<NewSaleButton />
					</div>
					<div>
						<SalesTrackerTable />
					</div>
				</CustomTabPanel>
				<CustomTabPanel value={value} index={1}>
					{/* Add content for the Stats tab here */}
				</CustomTabPanel>
			</Box>
		</>
	);
}

export default SalesTrackerPage;
