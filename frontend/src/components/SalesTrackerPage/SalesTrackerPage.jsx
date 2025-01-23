import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { getAllUserSalesThunk } from "../../store/userSales";
import SalesTrackerTable from "./SalesTrackerTable";
import NewSaleButton from "../NewSaleButton/NewSaleButton";
import StatsPanel from "../StatsPanel/StatsPanel";
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
	const dispatch = useDispatch();
	const userSales = useSelector((state) => state.userSales.data);
	const sessionUser = useSelector((state) => state.session.user);
	const [value, setValue] = useState(0);
  const sales = Object.values(userSales)

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

  useEffect(() => {
      dispatch(getAllUserSalesThunk());
    }, [dispatch]);

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
						<SalesTrackerTable sales={sales} />
					</div>
				</CustomTabPanel>
				<CustomTabPanel value={value} index={1}>
					<StatsPanel sales={sales} />
				</CustomTabPanel>
			</Box>
		</>
	);
}

export default SalesTrackerPage;
