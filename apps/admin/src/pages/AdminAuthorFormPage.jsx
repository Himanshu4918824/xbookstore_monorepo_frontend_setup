import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Card, Label, TextInput, Textarea } from 'flowbite-react';
import API from '../utils/axiosConfig';

// Define the shape of a single history record
const initialHistoryRecord = { designation: '', organization: '', bio: '', start_date: '', end_date: null };

const AdminAuthorFormPage = () => {
    const { id } = useParams(); // Author Profile ID
    const navigate = useNavigate();

    // --- STATE MANAGEMENT ---
    const [author, setAuthor] = useState(null); // Holds the main author profile (user, author_id, etc.)
    const [history, setHistory] = useState([{...initialHistoryRecord}]); // A list of their professional history records
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // --- DATA FETCHING ---
    useEffect(() => {
        if (id) {
            API.get(`/api/admin/authors/${id}/`)
                .then(response => {
                    setAuthor(response.data);
                    // If the author has existing history records, populate the form with them
                    if (response.data.history && response.data.history.length > 0) {
                        setHistory(response.data.history);
                    }
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error("Error fetching author data", error);
                    setIsLoading(false);
                });
        } else {
            // This is for the "Create New Author" case, which we've already built.
            // This form is now only for EDITING history.
            navigate('/admin/authors');
        }
    }, [id, navigate]);

    // --- EVENT HANDLERS for the dynamic history list ---
    const handleHistoryChange = (index, field, value) => {
        const updatedHistory = [...history];
        updatedHistory[index][field] = value;
        setHistory(updatedHistory);
    };
    
    const addHistoryRow = () => {
        setHistory([...history, {...initialHistoryRecord}]);
    };

    const removeHistoryRow = (index) => {
        // Prevent deleting the very last record
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

        // This requires a new backend API that can handle saving multiple history records at once.
        const payload = {
            // We aren't updating the user details on this page, just the history.
            history: history 
        };

        // We use PATCH to update the author and their nested history
        API.patch(`/api/admin/authors/${id}/`, payload)
            .then(() => {
                alert('Author history updated successfully!');
                navigate('/admin/authors');
            })
            .catch(error => {
                const errorMessage = error.response?.data ? JSON.stringify(error.response.data) : "An unknown error occurred.";
                alert(`Update failed: ${errorMessage}`);
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    if (isLoading) return <p>Loading author details...</p>;
    if (!author) return <p>Author not found.</p>;

    return (
        <div className="container mx-auto p-8">
            <Card>
                <h1 className="text-3xl font-bold mb-2">Edit History for {author.user.first_name} {author.user.last_name}</h1>
                <p className="mb-6 text-gray-500">Author ID: {author.author_id}</p>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <h2 className="text-xl font-semibold border-b pb-2">Professional History</h2>
                    <p className="text-sm text-gray-600">
                        Add or edit records for the author's designation, organization, and bio over time. 
                        The "current" record is the one with a blank "End Date".
                    </p>
                    
                    {history.map((record, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg relative">
                            {/* Inputs for Designation and Organization */}
                            <div><Label value="Designation" /><TextInput placeholder="e.g., Associate Professor" value={record.designation} onChange={e => handleHistoryChange(index, 'designation', e.target.value)} required/></div>
                            <div><Label value="Organization" /><TextInput placeholder="e.g., Xoffencer University" value={record.organization} onChange={e => handleHistoryChange(index, 'organization', e.target.value)} required/></div>
                            
                            {/* Inputs for Start and End Dates */}
                            <div><Label value="Start Date" /><TextInput type="date" value={record.start_date || ''} onChange={e => handleHistoryChange(index, 'start_date', e.target.value)} required/></div>
                            <div><Label value="End Date (Leave blank if current)" /><TextInput type="date" value={record.end_date || ''} onChange={e => handleHistoryChange(index, 'end_date', e.target.value)} /></div>

                            {/* Textarea for Bio */}
                            <div className="md:col-span-2"><Label value="Biography for this period" /><Textarea placeholder="Author's bio during this time..." value={record.bio || ''} onChange={e => handleHistoryChange(index, 'bio', e.target.value)} rows={3}/></div>
                            
                            {/* Remove Button */}
                            {history.length > 1 && (
                                <div className="absolute top-2 right-2">
                                    <Button type="button" color="failure" size="xs" onClick={() => removeHistoryRow(index)}>X</Button>
                                </div>
                            )}
                        </div>
                    ))}
                    
                    <Button type="button" color="light" onClick={addHistoryRow} className="self-start mt-2">
                        + Add History Record
                    </Button>

                    <div className="border-t pt-4 mt-4">
                        <Button type="submit" isProcessing={isSubmitting}>Save All History Changes</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default AdminAuthorFormPage;