import React, { useState } from 'react';
import { Upload, X, ArrowRight, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/client';

const CustomDesign = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        description: '',
    });
    const [images, setImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + images.length > 3) {
            toast.error("Maximum 3 images allowed");
            return;
        }

        const newImages = files.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));
        setImages([...images, ...newImages]);
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('email', formData.email);
            data.append('phone', formData.phone);
            data.append('description', formData.description);

            images.forEach((img) => {
                data.append('images', img.file);
            });

            await api.post('/design/inquire', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success("Design inquiry sent! We'll contact you shortly.");
            setFormData({ name: '', email: '', phone: '', description: '' });
            setImages([]);
        } catch (error) {
            console.error('Submission error:', error);
            toast.error("Failed to submit inquiry. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full bg-white pt-[56px]">
            {/* Hero */}
            <div className="bg-[#f5f5f5] py-20 px-6 text-center">
                <h1 className="text-[48px] md:text-[64px] font-display font-medium mb-6">Custom Design Lab</h1>
                <p className="max-w-xl mx-auto text-gray-600 text-lg">
                    Have a specific vision? Send us your inspiration/images, and let's co-create your perfect piece.
                </p>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-16">
                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Image Upload Section */}
                    <div className="bg-gray-50 p-8 rounded-2xl border-2 border-dashed border-gray-200 hover:border-black transition-colors">
                        <div className="flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                                <Upload className="w-8 h-8 text-black" />
                            </div>
                            <h3 className="text-lg font-medium mb-2">Upload Inspiration</h3>
                            <p className="text-gray-500 text-sm mb-6 max-w-sm">
                                Drop your sketches, reference photos, or mood boards here. Supports JPG, PNG.
                            </p>

                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                className="hidden"
                                id="image-upload"
                            />
                            <label
                                htmlFor="image-upload"
                                className="cursor-pointer px-6 py-2.5 bg-black text-white rounded-full text-sm font-medium hover:opacity-80 transition-opacity"
                            >
                                Browse Files
                            </label>

                            {images.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 w-full">
                                    {images.map((img, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group">
                                            <img src={img.preview} alt="preview" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(idx)}
                                                className="absolute top-2 right-2 p-1 bg-white/90 rounded-full hover:bg-white transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Contact Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-sm font-medium ml-1">Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
                                placeholder="Your full name"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium ml-1">Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                required
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
                                placeholder="WhatsApp preferred"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium ml-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
                            placeholder="hello@example.com"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium ml-1">Vision / Notes</label>
                        <textarea
                            name="description"
                            required
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={5}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors resize-none"
                            placeholder="Tell us about the fabric, fit, slogan, or any specific details you have in mind..."
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-black text-white font-medium rounded-xl hover:bg-gray-900 transition-all flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        ) : (
                            <>
                                Send Inquiry <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default CustomDesign;
