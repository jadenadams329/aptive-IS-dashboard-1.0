import { useState, useEffect } from "react";
import CommissionCard from "../CommissionCard/CommissionCard";
import ServiceRateCard from "../ServiceRateCard/ServiceRateCard";
import AvgCvCard from "../AvgCvCard/AvgCvCard";
import MultiYearCard from "../MultiYearCard/MultiYearCard";
import AutopayCard from "../AutopayCard/AutopayCard";
import {
    Box,
    TextField,
    Card,
    InputLabel,
    MenuItem,
    Select,
    FormControl,
    FormControlLabel,
    RadioGroup,
    Radio
} from "@mui/material";

function StatsPanel({ sales }) {
    const getCurrentMonthFirstDay = () => {
        const date = new Date();
        return new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
    };

    const getCurrentMonthLastDay = () => {
        const date = new Date();
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];
    };

    const [startDate, setStartDate] = useState(localStorage.getItem('startDate') || getCurrentMonthFirstDay());
    const [endDate, setEndDate] = useState(localStorage.getItem('endDate') || getCurrentMonthLastDay());
    const [salesTier, setSalesTier] = useState(localStorage.getItem('salesTier') || "Training");
    const [salesData, setSalesData] = useState(localStorage.getItem('salesData') || "Serviced Only");

    useEffect(() => {
        localStorage.setItem('startDate', startDate);
    }, [startDate]);

    useEffect(() => {
        localStorage.setItem('endDate', endDate);
    }, [endDate]);

    useEffect(() => {
        localStorage.setItem('salesTier', salesTier);
    }, [salesTier]);

    useEffect(() => {
        localStorage.setItem('salesData', salesData);
    }, [salesData]);

    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
    };

    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
    };

    const handleSalesTierChange = (event) => {
        setSalesTier(event.target.value);
    };

    const filteredSales = sales.filter((sale) => {
        const serviceDate = new Date(sale.serviceDate);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        if (start && end) {
            return serviceDate >= start && serviceDate <= end;
        } else if (start) {
            return serviceDate >= start;
        } else if (end) {
            return serviceDate <= end;
        } else {
            return true;
        }
    });

    return (
        <Box sx={{ p: 1 }}>
            <Card
                sx={{
                    p: 1.5,
                    mb: 3,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    border: "1px solid #ccc",
                    boxShadow: "none",
                }}
            >
                <Box sx={{ display: "flex", gap: 3 }}>
                    <TextField
                        label='Start Date'
                        type='date'
                        value={startDate}
                        onChange={handleStartDateChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        size='small'
                    />
                    <TextField
                        label='End Date'
                        type='date'
                        value={endDate}
                        onChange={handleEndDateChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        size='small'
                    />
                    <FormControl>
                        <InputLabel id='sales-tier'>Sales Tier</InputLabel>
                        <Select
                            labelId='sales-tier'
                            value={salesTier}
                            label='Sales Tier'
                            onChange={handleSalesTierChange}
                            size='small'
                            sx={{ width: 150 }}
                        >
                            <MenuItem value='Training'>Training</MenuItem>
                            <MenuItem value='Rep'>Rep</MenuItem>
                            <MenuItem value='Pro'>Pro</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl>
                        <RadioGroup row value={salesData} onChange={(e) => setSalesData(e.target.value)}>
                            <FormControlLabel value='Serviced Only' control={<Radio />} label='Serviced Only' />
                            <FormControlLabel value='Serviced + Pending' control={<Radio />} label='Serviced + Pending' />
                        </RadioGroup>
                    </FormControl>
                </Box>
            </Card>
            <CommissionCard sales={filteredSales} tier={salesTier} data={salesData} />
            <AvgCvCard sales={filteredSales} data={salesData}></AvgCvCard>
            <ServiceRateCard sales={filteredSales}/>
            <MultiYearCard sales={filteredSales} data={salesData}></MultiYearCard>
            <AutopayCard sales={filteredSales} data={salesData}></AutopayCard>

        </Box>
    );
}

export default StatsPanel;
