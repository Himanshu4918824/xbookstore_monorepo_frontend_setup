import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { centerCrop, makeAspectCrop } from 'react-image-crop';

// This is your original, working helper function.
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

// This is your complete logic, packaged as a reusable hook.
export const useAuthorCreateForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        first_name: '', last_name: '', email: '',
        designation: '', organization: '', bio: '',
    });

    const [imageSrc, setImageSrc] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [originalFileName, setOriginalFileName] = useState('');
    const [croppedImagePreview, setCroppedImagePreview] = useState(null);
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState(null);
    const [aspect, setAspect] = useState(3 / 4);
    const [openCropDialog, setOpenCropDialog] = useState(false);
    const imgRef = useRef(null);
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const clearError = () => setError(null);

    const handleChange = (e) => {
        // When the user starts typing, clear any previous submission errors
        if (error) clearError();
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setOriginalFileName(file.name);
            setCrop(undefined);
            const reader = new FileReader();
            reader.addEventListener('load', () => setImageSrc(reader.result?.toString() || ''));
            reader.readAsDataURL(file);
            setOpenCropDialog(true);
            e.target.value = null;
        }
    };

    const onImageLoad = (e) => {
        imgRef.current = e.currentTarget;
        const { width, height } = e.currentTarget;
        const newCrop = centerCrop(makeAspectCrop({ unit: '%', width: 90 }, aspect, width, height), width, height);
        setCrop(newCrop);
        setCompletedCrop(newCrop);
    };

    const handleSaveCrop = async () => {
        if (imgRef.current && completedCrop?.width && completedCrop?.height) {
            const croppedFile = await getCroppedImg(imgRef.current, completedCrop, originalFileName);
            setImageFile(croppedFile);
            setCroppedImagePreview(URL.createObjectURL(croppedFile));
            setOpenCropDialog(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        const postData = new FormData();
        Object.keys(formData).forEach(key => postData.append(key, formData[key]));
        if (imageFile) { postData.append('image', imageFile); }
        axios.post('/api/admin/authors/create_full/', postData)
            .then(() => {
                alert('New author created successfully!');
                navigate('/admin/authors');
            })
            .catch(error => {
                const errorMessage = error.response?.data ? JSON.stringify(error.response.data) : "An unknown error occurred.";
                setError(`Failed to create author: ${errorMessage}`);
            })
            .finally(() => setIsSubmitting(false));
    };

    return {
        formData, imageSrc, croppedImagePreview, crop, completedCrop, aspect, openCropDialog, imgRef, isSubmitting, error,
        handleChange, handleFileChange, setCrop, setCompletedCrop, setAspect, setOpenCropDialog, onImageLoad, handleSaveCrop, handleSubmit, clearError
    };
};