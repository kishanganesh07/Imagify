import { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const useStudioTool = (activeTab) => {
    const { backendUrl, token, loadCredits, setShowPricing } = useContext(AppContext);
    const location = useLocation();
    const navigate = useNavigate();
    const previousCreation = location.state?.creation;

    // Inputs
    const [prompt, setPrompt] = useState('');
    const [style, setStyle] = useState('normal');
    const [aspectRatio, setAspectRatio] = useState('16:9');
    const [sourceImages, setSourceImages] = useState([]);
    const [sourceImagePreviews, setSourceImagePreviews] = useState([]);
    
    // Status & Output
    const [status, setStatus] = useState('idle'); // idle, processing, completed, failed
    const [result, setResult] = useState(null); 
    const [isPublic, setIsPublic] = useState(false);

    useEffect(() => {
        if (previousCreation && previousCreation.toolType === activeTab) {
            if (previousCreation.prompt) setPrompt(previousCreation.prompt);
            if (previousCreation.style) setStyle(previousCreation.style);
            if (previousCreation.aspectRatio) setAspectRatio(previousCreation.aspectRatio);
            if (previousCreation.imageUrl) {
                setResult(previousCreation);
                setStatus('completed');
            }
            // Clear the state so it doesn't re-trigger on subsequent visits unless clicked again
            window.history.replaceState({}, document.title);
        }
    }, [previousCreation, activeTab]);

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const processFile = (file) => {
            return new Promise((resolve) => {
                if (!file.type.startsWith('image/')) {
                    toast.error("Invalid file type! Only images are supported.");
                    return resolve(null);
                }
                const url = URL.createObjectURL(file);
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    canvas.toBlob((blob) => {
                        if (blob) {
                            const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".png", { type: 'image/png' });
                            resolve(newFile);
                        } else {
                            resolve(null);
                        }
                    }, 'image/png');
                };
                img.onerror = () => {
                    toast.error("Failed to read image. It might be corrupted or unsupported.");
                    resolve(null);
                };
                img.src = url;
            });
        };

        const processedFiles = [];
        for (const file of files) {
            const processed = await processFile(file);
            if (processed) processedFiles.push(processed);
        }

        if (processedFiles.length > 0) {
            if (activeTab === 'image-to-image') {
                const combined = [...sourceImages, ...processedFiles];
                if (combined.length > 5) {
                    toast.error("You can only upload a maximum of 5 images.");
                }
                const limited = combined.slice(0, 5);
                setSourceImages(limited);
                setSourceImagePreviews(limited.map(f => URL.createObjectURL(f)));
            } else {
                setSourceImages([processedFiles[0]]);
                setSourceImagePreviews([URL.createObjectURL(processedFiles[0])]);
            }
            setResult(null);
        }
    };

    const handleGenerate = async () => {
        if ((activeTab === 'text-to-image' || activeTab === 'image-to-image') && !prompt) {
            return toast.error("Please enter a prompt!");
        }
        if (activeTab !== 'text-to-image' && sourceImages.length === 0) {
            return toast.error("Please upload an image!");
        }
        
        setStatus('processing');
        try {
            const formData = new FormData();
            if (activeTab !== 'text-to-image') {
                sourceImages.forEach(img => formData.append('image', img));
            }
            if (activeTab === 'text-to-image' || activeTab === 'image-to-image') {
                formData.append('prompt', prompt);
                formData.append('style', style);
                formData.append('aspectRatio', aspectRatio);
            }
            formData.append('isPublic', isPublic);

            const endpoints = {
                'text-to-image': '/api/studio/text-to-image',
                'image-to-image': '/api/studio/image-to-image',
                'bg-removal': '/api/studio/remove-bg',
                'upscale': '/api/studio/upscale'
            };

            const { data } = await axios.post(backendUrl + endpoints[activeTab], formData, {
                headers: { token, 'Content-Type': activeTab === 'text-to-image' ? 'application/json' : 'multipart/form-data' }
            });

            if (data.success) {
                setResult(data.creation);
                setStatus('completed');
                loadCredits();
                toast.success("Generation complete!");
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error(error);
            setStatus('idle');
            const msg = error.response?.data?.message || error.message || 'Generation failed';
            
            if (msg.toLowerCase().includes('credit')) {
                setShowPricing(true);
            } else {
                toast.error(msg);
            }
        }
    };

    const downloadImage = async (url, prefix, format = 'png') => {
        if (!url) return;
        try {
            toast.info(`Preparing ${format.toUpperCase()} download...`);
            const response = await fetch(url);
            const blob = await response.blob();
            const objectUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = objectUrl;
            a.download = `${prefix}_${result.slug}.${format}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(objectUrl);
            
            // Increment download count silently
            axios.post(`${backendUrl}/api/creations/${result._id}/download`, {}, { headers: { token } }).catch(()=>{});
        } catch (err) {
            console.error(err);
            toast.error("Download failed.");
        }
    };

    const clearImages = () => {
        setSourceImages([]); 
        setSourceImagePreviews([]); 
        setResult(null);
    };

    const removeImage = (indexToRemove) => {
        setSourceImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
        setSourceImagePreviews(prev => prev.filter((_, idx) => idx !== indexToRemove));
    };

    return {
        prompt, setPrompt,
        style, setStyle,
        aspectRatio, setAspectRatio,
        sourceImages, setSourceImages,
        sourceImagePreviews, setSourceImagePreviews,
        status, setStatus,
        result, setResult,
        isPublic, setIsPublic,
        handleImageUpload,
        handleGenerate,
        downloadImage,
        clearImages,
        removeImage
    };
};

export default useStudioTool;
