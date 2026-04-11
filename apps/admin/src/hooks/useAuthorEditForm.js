import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { centerCrop, makeAspectCrop } from 'react-image-crop';

// Helper function to get cropped image File (Unchanged)
function getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, crop.x * scaleX, crop.y * scaleY, crop.width * scaleX, crop.height * scaleY, 0, 0, crop.width, crop.height);
    return new Promise((resolve) => {
        canvas.toBlob(blob => {
            if (!blob) { console.error('Canvas is empty'); return; }
            resolve(new File([blob], fileName, { type: 'image/jpeg' }));
        }, 'image/jpeg');
    });
}

const getTodayDate = () => new Date().toISOString().split('T')[0];
const initialHistoryRecord = { designation: '', organization: '', bio: '', start_date: getTodayDate(), end_date: null };

export const useAuthorEditForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // State Management
    const [userData, setUserData] = useState({ first_name: '', last_name: '', email: '', username: '' });
    const [authorData, setAuthorData] = useState({ image: null, orcid: '', social_media_profile: '' });
    const [history, setHistory] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Image Cropping State
    const [imageFile, setImageFile] = useState(null);
    const [originalFileName, setOriginalFileName] = useState('');
    const [imgSrc, setImgSrc] = useState('');
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState(null);
    const [openCropDialog, setOpenCropDialog] = useState(false);
    const imgRef = useRef(null);
    const [croppedImagePreview, setCroppedImagePreview] = useState(null);

    // Data Fetching
    useEffect(() => {
        if (id) {
            setIsLoading(true);
            axios.get(`/api/admin/authors/${id}/`)
                .then(response => {
                    setUserData(response.data.user);
                    setAuthorData(response.data);
                    setCroppedImagePreview(response.data.image); // Set initial image preview
                    if (response.data.history && response.data.history.length > 0) {
                        const formattedHistory = response.data.history.map(h => ({ ...h, start_date: h.start_date || '', end_date: h.end_date || null }));
                        setHistory(formattedHistory);
                    } else {
                        setHistory([{ ...initialHistoryRecord }]);
                    }
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error("Error fetching author data:", error);
                    setError("Failed to load author data.");
                    setIsLoading(false);
                });
        }
    }, [id]);

    // Event Handlers
    const handleUserChange = (e) => setUserData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleAuthorChange = (e) => setAuthorData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const addHistoryRow = () => setHistory([...history, { ...initialHistoryRecord }]);
    const removeHistoryRow = (index) => {
        if (history.length > 1) setHistory(history.filter((_, i) => i !== index));
        else alert("An author must have at least one history record.");
    };
    const handleHistoryChange = (index, e) => {
        const { name, value } = e.target;
        const updated = [...history];
        updated[index][name] = value;
        setHistory(updated);
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setOriginalFileName(e.target.files[0].name);
            setCrop(undefined);
            const reader = new FileReader();
            reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
            reader.readAsDataURL(e.target.files[0]);
            setOpenCropDialog(true);
            e.target.value = null;
        }
    };
    
    const onImageLoad = (e) => {
        imgRef.current = e.currentTarget;
        const { width, height } = e.currentTarget;
        const newCrop = centerCrop(makeAspectCrop({ unit: '%', width: 90 }, 3 / 4, width, height), width, height);
        setCrop(newCrop);
        setCompletedCrop(newCrop);
    };

    const handleSaveCrop = async () => {
        if (completedCrop?.width && completedCrop?.height && imgRef.current) {
            const croppedFile = await getCroppedImg(imgRef.current, completedCrop, originalFileName);
            setImageFile(croppedFile);
            setCroppedImagePreview(URL.createObjectURL(croppedFile)); // Update preview with new crop
            setOpenCropDialog(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        const postData = new FormData();
        postData.append('user', JSON.stringify(userData));
        postData.append('history', JSON.stringify(history));
        postData.append('orcid', authorData.orcid || '');
        postData.append('social_media_profile', authorData.social_media_profile || '');
        if (imageFile) {
            postData.append('image', imageFile);
        }
        axios.patch(`/api/admin/authors/${id}/`, postData)
            .then(() => {
                alert('Author updated successfully!');
                navigate('/admin/authors');
            })
            .catch(err => {
                const errorMessage = err.response?.data ? JSON.stringify(err.response.data) : "An unknown error occurred.";
                setError(`Update failed: ${errorMessage}`);
            })
            .finally(() => setIsSubmitting(false));
    };

    return {
        id, userData, authorData, history, isLoading, isSubmitting, error,
        imgSrc, croppedImagePreview, crop, completedCrop, openCropDialog, imgRef,
        handleUserChange, handleAuthorChange, addHistoryRow, removeHistoryRow,
        handleHistoryChange, handleFileChange, setCrop, setCompletedCrop,
        onImageLoad, handleSaveCrop, setOpenCropDialog, handleSubmit
    };
};