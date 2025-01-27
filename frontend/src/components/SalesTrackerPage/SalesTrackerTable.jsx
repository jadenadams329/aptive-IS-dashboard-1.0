import { useState } from "react";
import { useDispatch } from "react-redux";
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
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import Checkbox from "@mui/material/Checkbox";
import { updateUserSaleThunk } from "../../store/userSales";

function SalesTrackerTable({sales}) {

	const dispatch = useDispatch();
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	const [serviceDateFrom, setServiceDateFrom] = useState("");
	const [serviceDateTo, setServiceDateTo] = useState("");
	const [createdAtFrom, setCreatedAtFrom] = useState("");
	const [createdAtTo, setCreatedAtTo] = useState("");
	const [serviced, setServiced] = useState("");
	const [filtersVisible, setFiltersVisible] = useState(false);
	const [selectedRow, setSelectedRow] = useState(null);
	const [editMode, setEditMode] = useState(false);

	const [accountNumber, setAccountNumber] = useState("");
	const [planType, setPlanType] = useState("");
	const [initialPrice, setInitialPrice] = useState("");
	const [monthlyPrice, setMonthlyPrice] = useState("");
	const [agreementLength, setAgreementLength] = useState("");
	const [payment, setPayment] = useState("");
	const [initialServiceDate, setInitialServiceDate] = useState("");
	const [servicedStatus, setServicedStatus] = useState("");


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

	const handleCheckboxChange = (saleId) => {
		setSelectedRow(saleId === selectedRow ? null : saleId);
		setEditMode(false);
	};

	const handleEditClick = (sale) => {
		setFiltersVisible(false);
		setEditMode(true);
		setFiltersVisible(false);
		setEditMode(true);
		setAccountNumber(sale.accountNumber);
		setPlanType(sale.planType);
		setInitialPrice(sale.initialPrice);
		setMonthlyPrice(sale.monthlyPrice);
		if (sale.autopay && sale.ach) setPayment("ACH");
		else if (sale.autopay && !sale.ach) setPayment("CC");
		else setPayment("None");
		setInitialServiceDate(sale.serviceDate);
		setServicedStatus(sale.serviced);
	};

	const handleSaveClick = async (saleId) => {
		const tableEditData = {
			accountNumber,
			planType,
			initialPrice,
			monthlyPrice,
			payment,
			initialServiceDate,
			servicedStatus,
		};
		console.log(tableEditData);

		let autopay;
		let ach;

		if (payment === "None") {
			autopay = false;
			ach = false;
		} else if (payment === "CC") {
			autopay = true;
			ach = false;
		} else {
			autopay = true;
			ach = true;
		}
		const updateSale = {
			accountNumber,
			planType,
			initialPrice: parseInt(initialPrice),
			monthlyPrice: parseInt(monthlyPrice),
			autopay,
			ach,
			serviceDate: initialServiceDate,
			serviced: servicedStatus,
		};
		try {
			await dispatch(updateUserSaleThunk(updateSale, saleId));
			setEditMode(false);
		} catch (err) {
			console.error(err);
		}
	};

    const sortByServiced = (a, b) => {
        const order = { "Pending": 1, "Yes": 2, "No": 3 };
        return order[a.serviced] - order[b.serviced];
    };

	const sortedSales = sales.sort((a, b) => {
        const servicedComparison = sortByServiced(a, b);
        if (servicedComparison !== 0) {
            return servicedComparison;
        }
        return new Date(a.serviceDate) - new Date(b.serviceDate);
    });

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
		{ id: "checkbox", label: "" },
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
				<IconButton
					onClick={
						editMode
							? () => handleSaveClick(selectedRow)
							: selectedRow
							? () => handleEditClick(sales.find((sale) => sale.id === selectedRow))
							: toggleFilters
					}
				>
					{editMode ? <SaveIcon /> : selectedRow ? <EditIcon /> : <FilterListIcon />}
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
									<TableCell padding='checkbox'>
										<Checkbox checked={selectedRow === sale.id} onChange={() => handleCheckboxChange(sale.id)} />
									</TableCell>
									{editMode && selectedRow === sale.id ? (
										<>
											<TableCell align='right'>
												<TextField
													value={accountNumber}
													onChange={(e) => {
														setAccountNumber(e.target.value);
													}}
													sx={{ width: "100px" }}
													size='small'
												/>
											</TableCell>
											<TableCell align='right'>
												<FormControl fullWidth sx={{ width: "75px" }}>
													<Select
														labelId='plan-type-label'
														value={planType}
														onChange={(e) => {
															setPlanType(e.target.value);
														}}
														size='small'
													>
														<MenuItem value='Basic'>Basic</MenuItem>
														<MenuItem value='Pro'>Pro</MenuItem>
														<MenuItem value='Premium'>Premium</MenuItem>
													</Select>
												</FormControl>
											</TableCell>
											<TableCell align='right'>
												<TextField
													value={initialPrice}
													onChange={(e) => {
														setInitialPrice(e.target.value);
													}}
													sx={{ width: "60px" }}
													size='small'
												/>
											</TableCell>
											<TableCell align='right'>
												<TextField
													value={monthlyPrice}
													onChange={(e) => {
														setMonthlyPrice(e.target.value);
													}}
													sx={{ width: "60px" }}
													size='small'
												/>
											</TableCell>
											<TableCell align='right'>{cv}</TableCell>
											<TableCell align='right'>
												<FormControl fullWidth sx={{ width: "70px" }}>
													<Select
														labelId='ez-pay-label'
														value={payment}
														onChange={(e) => {
															setPayment(e.target.value);
														}}
														size='small'
													>
														<MenuItem value='None'>None</MenuItem>
														<MenuItem value='CC'>CC</MenuItem>
														<MenuItem value='ACH'>ACH</MenuItem>
													</Select>
												</FormControl>
											</TableCell>
											<TableCell align='right'>
												<TextField
													type='date'
													value={initialServiceDate}
													onChange={(e) => {
														setInitialServiceDate(e.target.value);
													}}
													sx={{ width: "150px" }}
													size='small'
												/>
											</TableCell>
											<TableCell align='right'>
												<FormControl fullWidth sx={{ width: "100px" }}>
													<Select
														labelId='serviced-label'
														value={servicedStatus}
														onChange={(e) => {
															setServicedStatus(e.target.value);
														}}
														size='small'
													>
														<MenuItem value='Pending'>Pending</MenuItem>
														<MenuItem value='Yes'>Yes</MenuItem>
														<MenuItem value='No'>No</MenuItem>
													</Select>
												</FormControl>
											</TableCell>
										</>
									) : (
										<>
											<TableCell align='right'>{sale.accountNumber}</TableCell>
											<TableCell align='right'>{sale.planType}</TableCell>
											<TableCell align='right'>{sale.initialPrice}</TableCell>
											<TableCell align='right'>{sale.monthlyPrice}</TableCell>
											<TableCell align='right'>{cv}</TableCell>
											<TableCell align='right'>{ez}</TableCell>
											<TableCell align='right'>
												{`${sale.serviceDate.split("-")[1]}/${sale.serviceDate.split("-")[2]}/${sale.serviceDate.split("-")[0]}`}
											</TableCell>
											<TableCell align='right'>{sale.serviced}</TableCell>
										</>
									)}
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[10, 25, 100]}
				component='div'
				count={filteredSales.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
		</Paper>
	);
}

export default SalesTrackerTable;
