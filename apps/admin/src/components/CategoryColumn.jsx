import React, { useRef, useEffect } from 'react';
import { Box, Typography, List, ListItemButton, ListItemText, Divider, Button, CircularProgress } from '@mui/material';
// --- THE FIX IS HERE ---
import AddIcon from '@mui/icons-material/Add';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { animate } from "motion";
import { useStaggeredListAnimation, useSpringyHover } from './animationHooks';

const CategoryColumn = ({ title, items, selectedId, onItemSelect, onAdd, loading = false }) => {
    const columnRef = useRef(null);
    const listRef = useStaggeredListAnimation(loading, items);
    const addBtnHover = useSpringyHover({ scale: 1.05 });

    useEffect(() => {
        if (columnRef.current) {
            animate(columnRef.current, { opacity: [0, 1], x: [-20, 0] }, { duration: 0.4 });
        }
    }, []);

    return (
        <Box ref={columnRef} sx={{ display: 'flex', flexDirection: 'column', height: '100%', opacity: 0 }}>
            <Typography variant="h6" sx={{ p: 2, fontWeight: 'bold', flexShrink: 0 }}>
                {title}
            </Typography>
            <Divider />

            {loading ? (
                <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircularProgress /></Box>
            ) : (
                <List ref={listRef} sx={{ flexGrow: 1, overflowY: 'auto', p: 1 }}>
                    {items.length === 0 ? (
                        <Typography sx={{ p: 2, color: 'text.secondary' }}>No sub-categories</Typography>
                    ) : (
                        items.map(item => (
                            <ListItemButton
                                key={item.id}
                                selected={item.id === selectedId}
                                onClick={() => onItemSelect(item)}
                                sx={{ borderRadius: '6px' }}
                            >
                                <ListItemText primary={item.name} />
                                {item.children && item.children.length > 0 && <ChevronRightIcon />}
                            </ListItemButton>
                        ))
                    )}
                </List>
            )}

            <Divider />
            <Box sx={{ p: 1, flexShrink: 0 }}>
                <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    startIcon={<AddIcon />}
                    onClick={onAdd}
                    {...addBtnHover}
                >
                    Add New
                </Button>
            </Box>
        </Box>
    );
};

export default CategoryColumn;