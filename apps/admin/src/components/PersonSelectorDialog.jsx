import React from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Checkbox, Avatar, Typography, Box
} from '@mui/material';

const PersonSelectorDialog = ({ open, onClose, title, options, selected, onSelect, isMulti = false }) => {
    const handleToggle = (value) => {
        const currentIndex = selected.indexOf(value);
        let newSelected = [...selected];

        if (isMulti) {
            if (currentIndex === -1) {
                newSelected.push(value);
            } else {
                newSelected.splice(currentIndex, 1);
            }
        } else {
            newSelected = [value];
        }
        onSelect(newSelected);
    };

    const sortedOptions = [...options].sort((a, b) => {
        const aIsSelected = selected.includes(a.value);
        const bIsSelected = selected.includes(b.value);
        return bIsSelected - aIsSelected;
    });

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <TableContainer sx={{ maxHeight: 440, mt: 2 }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox"></TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Current Designation</TableCell>
                                <TableCell>Current Organization</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedOptions.map((option) => {
                                const isItemSelected = selected.includes(option.value);
                                return (
                                    <TableRow
                                        hover
                                        onClick={() => handleToggle(option.value)}
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={option.value}
                                        selected={isItemSelected}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox color="primary" checked={isItemSelected} />
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Avatar src={option.image} />
                                                <Box>
                                                    <Typography variant="body1" fontWeight="bold">{option.label}</Typography>
                                                    <Typography variant="body2" color="text.secondary">{option.authorId}</Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>{option.designation}</TableCell>
                                        <TableCell>{option.organization}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Done</Button>
            </DialogActions>
        </Dialog>
    );
};

export default PersonSelectorDialog;