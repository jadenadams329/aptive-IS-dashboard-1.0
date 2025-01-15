import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { FormControlLabel, FormLabel, RadioGroup, Radio, FormControl, InputAdornment } from "@mui/material";
import { createUserSaleThunk } from "../../store/userSales";
import { useDispatch } from "react-redux";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 350,
	bgcolor: "background.paper",
	border: "1px solid #000",
	boxShadow: 24,
	p: 4,
};

function NewSaleButton() {
	const [open, setOpen] = useState(false);
    const [accountNumber, setAccountNumber] = useState("");
    const [planType, setPlanType] = useState("");
    const [initialPrice, setInitialPrice] = useState("");
    const [monthlyPrice, setMonthlyPrice] = useState("");
    const [agreementLength, setAgreementLength] = useState("");
    const [payment, setPayment] = useState("");
	const [initialServiceDate, setInitialServiceDate] = useState("");
    const dispatch = useDispatch();

	const handleOpen = () => setOpen(true);
	const handleClose = () => {
        setOpen(false)
        setAccountNumber("");
        setPlanType("");
        setInitialPrice("");
        setMonthlyPrice("");
        setAgreementLength("");
        setPayment("");
        setInitialServiceDate("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            accountNumber,
            planType,
            initialPrice,
            monthlyPrice,
            agreementLength,
            payment,
            initialServiceDate
        };
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

        if(formData) {
            const safeData = {
                accountNumber: formData.accountNumber,
                planType: formData.planType,
                initialPrice: formData.initialPrice,
                monthlyPrice: formData.monthlyPrice,
                agreementLength: formData.agreementLength,
                autopay,
                ach,
                serviceDate: formData.initialServiceDate,

            }
            try {
                await dispatch(createUserSaleThunk(safeData));
                handleClose();
            } catch (error) {
                console.error(error);
            }
        }


    }

    console.log(accountNumber, planType, initialPrice, monthlyPrice, agreementLength, payment, initialServiceDate);

	return (
		<div>
			<Button onClick={handleOpen} variant='contained'>
				New Sale
			</Button>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby='modal-modal-title'
				aria-describedby='modal-modal-description'
			>
				<Box sx={style} component='form' onSubmit={handleSubmit}>
					<Typography id='modal-modal-title' variant='h4' component='h2' margin='normal'>
						New Sale
					</Typography>
					<TextField
                        value={accountNumber}
						required
						id='account-number'
						label='Account Number'
						variant='outlined'
						margin='normal'
						type='number'
						fullWidth
                        slotProps={{ inputLabel: { shrink: true } }}
                        onChange={(e) => setAccountNumber(e.target.value)}
					/>
					<FormControl fullWidth margin='normal'>
						<FormLabel required>Plan Type</FormLabel>
						<RadioGroup row value={planType} onChange={(e) => setPlanType(e.target.value)}>
							<FormControlLabel value='Basic' control={<Radio />} label='Basic' />
							<FormControlLabel value='Pro' control={<Radio />} label='Pro' />
							<FormControlLabel value='Premium' control={<Radio />} label='Premium' />
						</RadioGroup>
					</FormControl>
					<Box sx={{ display: "flex", gap: 2 }}>
						<TextField
                            value={initialPrice}
							required
							label='Initial Price'
							variant='outlined'
							margin='normal'
							type='number'
							fullWidth
							slotProps={{
								input: {
									startAdornment: <InputAdornment position='start'>$</InputAdornment>,
								},
							}}
                            onChange={(e) => setInitialPrice(e.target.value)}
						/>
						<TextField
                            value={monthlyPrice}
							required
							label='Monthly Price'
							variant='outlined'
							margin='normal'
							type='number'
							fullWidth
							slotProps={{
								input: {
									startAdornment: <InputAdornment position='start'>$</InputAdornment>,
								},
							}}
                            onChange={(e) => setMonthlyPrice(e.target.value)}
						/>
					</Box>
					<FormControl fullWidth margin='normal'>
						<FormLabel required>Agreement Length</FormLabel>
						<RadioGroup row value={agreementLength} onChange={(e) => setAgreementLength(e.target.value)}>
							<FormControlLabel value='12 Months' control={<Radio />} label='12 Months' />
							<FormControlLabel value='24 Months' control={<Radio />} label='24 Months' />
						</RadioGroup>
					</FormControl>
					<FormControl fullWidth margin='normal'>
						<FormLabel required>EZ Pay</FormLabel>
						<RadioGroup row value={payment} onChange={(e) => setPayment(e.target.value)}>
							<FormControlLabel value='None' control={<Radio />} label='None' />
							<FormControlLabel value='CC' control={<Radio />} label='CC' />
							<FormControlLabel value='ACH' control={<Radio />} label='ACH' />
						</RadioGroup>
					</FormControl>
					<TextField
                        value={initialServiceDate}
						required
						label='Initial Service Date'
						variant='outlined'
						margin='normal'
						type='date'
						fullWidth
						slotProps={{ inputLabel: { shrink: true } }}
                        onChange={(e) => setInitialServiceDate(e.target.value)}
					/>
					<Box sx={{ mt: 2 }}>
						<Button variant='contained' fullWidth type="submit">
							Submit
						</Button>
					</Box>
				</Box>
			</Modal>
		</div>
	);
}

export default NewSaleButton;
