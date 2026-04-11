import React, { useState, useEffect, useRef } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Box,
} from '@mui/material';
import { animate } from 'motion';
import StyledTextField from './StyledTextField';

const CategoryDialog = ({ open, onClose, onSave, parentCategory }) => {
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const saveButtonRef = useRef(null);

    useEffect(() => {
        if (open) {
            setName('');
            setIsSubmitting(false);
        }
    }, [open]);

    const handleSave = async () => {
        if (!name) return;
        setIsSubmitting(true);
        try {
            await onSave({ name, parent: parentCategory?.id || null });
        } catch (error) {
            console.error("Save operation failed:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleButtonHover = (ref, scale) => {
        if (ref.current) {
            animate(ref.current, { scale }, { type: "spring", stiffness: 400, damping: 15 });
        }
    };

    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth="sm"
            // --- THIS IS THE CORRECTED ONSUBMIT HANDLER ---
            onClose={(event, reason) => {
                // Prevent closing by clicking the background while submitting
                if (reason === 'backdropClick' && isSubmitting) {
                    return;
                }
                // Otherwise, call the original onClose function
                onClose(event, reason);
            }}
        >
            <DialogTitle sx={{ fontWeight: 'bold' }}>
                {parentCategory ? `Add Sub-category to "${parentCategory.name}"` : 'Add New Top-Level Category'}
            </DialogTitle>
            <DialogContent>
                <Box component="form" sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <StyledTextField
                        label="Parent Category"
                        value={parentCategory?.name || 'None (Top-Level)'}
                        InputProps={{ readOnly: true }}
                    />
                    <StyledTextField
                        autoFocus
                        margin="dense"
                        label="New Category Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: '0 24px 16px' }}>
                <Button onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                <Button
                    ref={saveButtonRef}
                    onClick={handleSave}
                    variant="contained"
                    color="secondary"
                    disabled={isSubmitting || !name}
                    onMouseEnter={() => handleButtonHover(saveButtonRef, 1.05)}
                    onMouseLeave={() => handleButtonHover(saveButtonRef, 1)}
                    sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 'bold' }}
                >
                    {isSubmitting ? 'Saving...' : 'Save Category'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CategoryDialog;