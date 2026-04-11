import React, { useState, useRef } from 'react';
import {
    ListItem,
    ListItemText,
    Collapse,
    List,
    IconButton,
    Button
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { animate } from "motion"; // Import animate

// A reusable MUI component to render a category and its children recursively
const CategoryNode = ({ category, onAddSubCategory, level = 0 }) => {
    const [open, setOpen] = useState(true);
    const nodeRef = useRef(null); // Ref to target the list item for animation

    const hasChildren = category.children && category.children.length > 0;

    // Handlers for hover animations
    const handleHoverStart = () => {
        if (nodeRef.current) {
            animate(nodeRef.current, { scale: 1.02 }, { duration: 0.2 });
        }
    };
    const handleHoverEnd = () => {
        if (nodeRef.current) {
            animate(nodeRef.current, { scale: 1 }, { duration: 0.2 });
        }
    };

    return (
        <>
            <ListItem
                ref={nodeRef}
                onMouseEnter={handleHoverStart}
                onMouseLeave={handleHoverEnd}
                sx={{
                    pl: level * 2,
                    borderRadius: '8px',
                    mb: 0.5,
                    transition: 'background-color 0.2s ease-in-out',
                    '&:hover': {
                        bgcolor: 'action.hover'
                    }
                }}
            >
                <ListItemText primary={category.name} />
                <Button
                    size="small"
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => onAddSubCategory(category.id, category.name)}
                    sx={{ mr: 1 }}
                >
                    Add Sub
                </Button>
                {hasChildren && (
                    <IconButton onClick={() => setOpen(!open)} size="small">
                        {open ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                )}
            </ListItem>
            {hasChildren && (
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {category.children.map(child => (
                            <CategoryNode
                                key={child.id}
                                category={child}
                                onAddSubCategory={onAddSubCategory}
                                level={level + 1}
                            />
                        ))}
                    </List>
                </Collapse>
            )}
        </>
    );
};

export default CategoryNode;