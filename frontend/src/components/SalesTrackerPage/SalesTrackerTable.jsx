import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllUserSalesThunk } from "../../store/userSales";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FilterListIcon from "@mui/icons-material/FilterList";

function SalesTrackerTable() {
	const dispatch = useDispatch();
	const userSales = useSelector((state) => state.userSales.data);
	const sales = Object.values(userSales);

	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	const [serviceDateFrom, setServiceDateFrom] = useState("");
	const [serviceDateTo, setServiceDateTo] = useState("");
	const [createdAtFrom, setCreatedAtFrom] = useState("");
	const [createdAtTo, setCreatedAtTo] = useState("");
	const [serviced, setServiced] = useState("");
	const [filtersVisible, setFiltersVisible] = useState(false);

	useEffect(() => {
		dispatch(getAllUserSalesThunk());
	}, [dispatch]);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	const handleFilterChange = (setter) => (event) => {
		setter(event.target.value);
	};

	const toggleFilters = () => {
		setFiltersVisible(!filtersVisible);
	};

	const sortedSales = sales.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

	const filteredSales = sortedSales.filter((sale) => {
		const serviceDate = new Date(sale.serviceDate);
		const createdAt = new Date(sale.createdAt);

		const serviceDateFromMatch = serviceDateFrom ? serviceDate >= new Date(serviceDateFrom) : true;
		const serviceDateToMatch = serviceDateTo ? serviceDate <= new Date(serviceDateTo) : true;
		const createdAtFromMatch = createdAtFrom ? createdAt >= new Date(createdAtFrom) : true;
		const createdAtToMatch = createdAtTo ? createdAt <= new Date(createdAtTo) : true;
		const servicedMatch = serviced ? sale.serviced === serviced : true;

		return serviceDateFromMatch && serviceDateToMatch && createdAtFromMatch && createdAtToMatch && servicedMatch;
	});

	const columns = [
		{ id: "accountNumber", label: "Account #" },
		{ id: "planType", label: "Plan" },
		{ id: "initialPrice", label: "Initial Price" },
		{ id: "monthlyPrice", label: "Monthly Price" },
		{ id: "cv", label: "CV" },
		{ id: "ez", label: "EZ Pay" },
		{ id: "serviceDate", label: "Service Date" },
		{ id: "serviced", label: "Serviced" },
	];

	return (
		<Paper sx={{ padding: 2, maxWidth: 1000, margin: "auto" }}>
			<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
				<Typography variant='h6'>My Sales</Typography>
				<IconButton onClick={toggleFilters}>
					<FilterListIcon />
				</IconButton>
			</Box>
			{filtersVisible && (
				<Box
					sx={{
						display: "flex",
						gap: "10px",
						marginBottom: "20px",
						alignItems: "flex-start",
						justifyContent: "space-around",
					}}
				>
					<TextField
						label='Service Date From'
						type='date'
						slotProps={{ inputLabel: { shrink: true } }}
						value={serviceDateFrom}
						onChange={handleFilterChange(setServiceDateFrom)}
						sx={{ width: "150px", height: "40px" }}
					/>
					<TextField
						label='Service Date To'
						type='date'
						slotProps={{ inputLabel: { shrink: true } }}
						value={serviceDateTo}
						onChange={handleFilterChange(setServiceDateTo)}
						sx={{ width: "150px", height: "40px" }}
					/>

					<TextField
						label='Sold Date From'
						type='date'
						slotProps={{ inputLabel: { shrink: true } }}
						value={createdAtFrom}
						onChange={handleFilterChange(setCreatedAtFrom)}
						sx={{ width: "150px", height: "40px" }}
					/>
					<TextField
						label='Sold Date To'
						type='date'
						slotProps={{ inputLabel: { shrink: true } }}
						value={createdAtTo}
						onChange={handleFilterChange(setCreatedAtTo)}
						sx={{ width: "150px", height: "40px" }}
					/>

					<FormControl sx={{ minWidth: 120, height: "40px" }}>
						<InputLabel id='serviced-label' shrink>
							Serviced
						</InputLabel>
						<Select
							labelId='serviced-select'
							label='Serviced'
							value={serviced}
							onChange={handleFilterChange(setServiced)}
							displayEmpty
							sx={{ height: "60px" }}
						>
							<MenuItem value=''>All</MenuItem>
							<MenuItem value='Yes'>Yes</MenuItem>
							<MenuItem value='No'>No</MenuItem>
							<MenuItem value='Pending'>Pending</MenuItem>
						</Select>
					</FormControl>
				</Box>
			)}
			<TableContainer sx={{ maxHeight: 440 }}>
				<Table stickyHeader aria-label='sticky table'>
					<TableHead>
						<TableRow>
							{columns.map((col) => (
								<TableCell key={col.id} align='right'>
									{col.label}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredSales.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((sale) => {
							let cv = sale.monthlyPrice * 11 + sale.initialPrice;
							let ez = "None";
							if (sale.autopay && sale.ach) ez = "ACH";
							else if (sale.autopay && !sale.ach) ez = "CC";

							return (
								<TableRow key={sale.id}>
									<TableCell align='right'>{sale.accountNumber}</TableCell>
									<TableCell align='right'>{sale.planType}</TableCell>
									<TableCell align='right'>{sale.initialPrice}</TableCell>
									<TableCell align='right'>{sale.monthlyPrice}</TableCell>
									<TableCell align='right'>{cv}</TableCell>
									<TableCell align='right'>{ez}</TableCell>
									<TableCell align='right'>{sale.serviceDate}</TableCell>
									<TableCell align='right'>{sale.serviced}</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
				<TablePagination
					rowsPerPageOptions={[10, 25, 100]}
					component='div'
					count={filteredSales.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</TableContainer>
		</Paper>
	);
}

export default SalesTrackerTable;
