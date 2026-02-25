"use client";

import React from 'react';

const SocialSection: React.FC = () => {
    const videos = [
        "/assets/social/customer-1.mp4",
        "/assets/social/customer-2.mp4",
        "/assets/social/customer-3.mp4",
    ];

    return (
        <section className="w-full bg-white py-[120px] px-6 md:px-12 lg:px-24">
            <div className="max-w-[1400px] mx-auto">
                <div className="text-center mb-16 flex flex-col items-center">
                    <h2 className="text-[32px] md:text-[48px] font-medium leading-[1.2] tracking-tight text-black mb-3">
                        Join the Community
                    </h2>
                    <p className="text-[#666666] text-base md:text-lg font-normal">
                        Share your style with #CrovaStyle
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {videos.map((video, index) => (
                        <div key={index} className="relative aspect-[9/16] rounded-[24px] overflow-hidden bg-gray-100">
                            <video
                                src={video}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SocialSection;
