import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Define the shape of a single history record
const initialHistoryRecord = { designation: '', organization: '', bio: '', start_date: '', end_date: null };

export const useAuthorHistoryForm = () => {
    const { id } = useParams(); // Author Profile ID
    const navigate = useNavigate();

    // --- STATE MANAGEMENT ---
    const [author, setAuthor] = useState(null);
    const [history, setHistory] = useState([{ ...initialHistoryRecord }]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null); // Added error state for better UI feedback

    // --- DATA FETCHING ---
    useEffect(() => {
        if (id) {
            setIsLoading(true);
            setError(null);
            axios.get(`/api/admin/authors/${id}/`)
                .then(response => {
                    setAuthor(response.data);
                    if (response.data.history && response.data.history.length > 0) {
                        setHistory(response.data.history);
                    } else {
                        // Ensure there's always at least one empty record to start with
                        setHistory([{ ...initialHistoryRecord }]);
                    }
                })
                .catch(err => {
                    console.error("Error fetching author data", err);
                    setError("Failed to load author data. Please try again.");
                })
                .finally(() => setIsLoading(false));
        } else {
            // This form is only for editing, redirect if no ID is provided
            navigate('/admin/authors');
        }
    }, [id, navigate]);

    // --- EVENT HANDLERS ---
    const handleHistoryChange = (index, field, value) => {
        const updatedHistory = history.map((record, i) => {
            if (i === index) {
                // Ensure end_date is null if the input is cleared, not an empty string
                return { ...record, [field]: value === '' && field === 'end_date' ? null : value };
            }
            return record;
        });
        setHistory(updatedHistory);
    };
    
    const addHistoryRow = () => {
        setHistory([...history, { ...initialHistoryRecord }]);
    };

    const removeHistoryRow = (index) => {
        if (history.length <= 1) {
            alert("An author must have at least one history record.");
            return;
        }
        setHistory(history.filter((_, i) => i !== index));
    };

    // --- FORM SUBMISSION ---
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        const payload = { history };

        axios.patch(`/api/admin/authors/${id}/`, payload)
            .then(() => {
                alert('Author history updated successfully!');
                navigate('/admin/authors');
            })
            .catch(err => {
                const errorMessage = err.response?.data ? JSON.stringify(err.response.data) : "An unknown error occurred.";
                setError(`Update failed: ${errorMessage}`);
            })
            .finally(() => setIsSubmitting(false));
    };

    // Return everything the UI needs to function
    return {
        author,
        history,
        isLoading,
        isSubmitting,
        error,
        handleHistoryChange,
        addHistoryRow,
        removeHistoryRow,
        handleSubmit
    };
};