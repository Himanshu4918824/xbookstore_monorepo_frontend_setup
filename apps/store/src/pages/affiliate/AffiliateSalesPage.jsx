import React from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const mockSales = [
  { id: 1, date: '2023-10-26', orderTotal: '₹1200', commission: '₹120' },
  { id: 2, date: '2023-10-24', orderTotal: '₹850', commission: '₹85' },
  { id: 3, date: '2023-10-21', orderTotal: '₹2100', commission: '₹210' },
];

function AffiliateSalesPage() {
  return (
    <>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>Your Referred Sales</Typography>
      <TableContainer component={Paper} sx={{backgroundColor: 'transparent'}}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell align="right">Order Total</TableCell>
              <TableCell align="right">Your Commission</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockSales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>{sale.date}</TableCell>
                <TableCell align="right">{sale.orderTotal}</TableCell>
                <TableCell align="right">{sale.commission}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
export default AffiliateSalesPage;