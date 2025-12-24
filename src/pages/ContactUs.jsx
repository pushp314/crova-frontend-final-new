"use client";

import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import toast from 'react-hot-toast';

const ContactUs = () => {
    const [activeTab, setActiveTab] = useState("Contacts");

    const sidebarLinks = ["Contacts", "Send a message"];

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            const y = element.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: y, behavior: "smooth" });
            setActiveTab(id === "contacts-info" ? "Contacts" : "Send a message");
        }
    };

    return (
        <div className="w-full bg-white pt-[56px]">
            {/* Hero Section - Blue Gradient */}
            <div className="relative w-full h-[450px] bg-gradient-to-r from-[#e0ebf5] to-[#f4f7fa] overflow-hidden flex items-center">
                <div className="max-w-[1400px] w-full mx-auto px-6 grid grid-cols-1 md:grid-cols-2 relative z-10">
                    <div className="flex flex-col justify-center gap-4">
                        <h1 className="text-[56px] font-medium text-[#0f3352] leading-[1.1] tracking-tight">
                            Contact us
                        </h1>
                        <p className="text-[16px] text-[#4a6b8a] max-w-sm leading-relaxed">
                            We're here for you — reach out about orders, sizing, collaborations, or
                            anything else on your mind.
                        </p>
                    </div>

                    {/* Hero Image - Right Side */}
                    <div className="absolute right-0 top-0 bottom-0 md:relative md:h-full flex items-end justify-end opacity-60 md:opacity-100 pointer-events-none">
                        <img
                            src="https://picsum.photos/seed/crova_contact/800/600"
                            alt="Contact Support"
                            className="h-full object-contain object-bottom mix-blend-multiply"
                        />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-[1400px] mx-auto px-6 py-24">
                <div className="flex flex-col md:flex-row gap-12 lg:gap-32">

                    {/* Sidebar Navigation */}
                    <div className="hidden md:block w-[200px] flex-shrink-0">
                        <div className="sticky top-[100px] flex flex-col gap-6">
                            {sidebarLinks.map((link) => (
                                <button
                                    key={link}
                                    onClick={() => scrollToSection(link === "Contacts" ? "contacts-info" : "contact-form")}
                                    className={`text-left text-[15px] font-medium transition-all
                    ${activeTab === link ? "text-black translate-x-1" : "text-gray-400 hover:text-gray-600"}
                  `}
                                >
                                    {link}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Sections */}
                    <div className="flex-1 flex flex-col gap-24">

                        {/* Contacts Info Section */}
                        <div id="contacts-info" className="scroll-mt-24">
                            <div className="flex items-center gap-4 mb-12">
                                <span className="text-[14px] font-medium text-black">Contacts</span>
                                <div className="h-px flex-1 bg-gray-100"></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-8">
                                <div>
                                    <h4 className="text-[13px] uppercase tracking-widest text-gray-500 mb-4">Call us</h4>
                                    <p className="text-[18px] font-medium">+91 8770266546</p>
                                </div>

                                <div>
                                    <h4 className="text-[13px] uppercase tracking-widest text-gray-500 mb-4">Chat on Whatsapp</h4>
                                    <div className="flex items-center justify-between group cursor-pointer border border-gray-200 rounded-full px-6 py-3 max-w-[220px] hover:border-black transition-all">
                                        <span className="text-[15px] font-medium">+91 8770266546</span>
                                        <button className="p-1 rounded-full bg-black text-white">
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-[13px] uppercase tracking-widest text-gray-500 mb-4">Send an email</h4>
                                    <p className="text-[18px] font-medium">crovaclothing@gmail.com</p>
                                </div>

                                <div>
                                    <h4 className="text-[13px] uppercase tracking-widest text-gray-500 mb-4">Visit us</h4>
                                    <p className="text-[18px] font-medium">
                                        Crova Studio<br />
                                        Bhilai, Chhattisgarh<br />
                                        India
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Message Form Section */}
                        <div id="contact-form" className="scroll-mt-24">
                            <div className="flex items-center gap-4 mb-12">
                                <span className="text-[14px] font-medium text-black">Send a Message</span>
                                <div className="h-px flex-1 bg-gray-100"></div>
                            </div>

                            <form className="flex flex-col gap-6 max-w-3xl" onSubmit={(e) => {
                                e.preventDefault();
                                toast.success("Message sent successfully! We'll get back to you soon.");
                                e.currentTarget.reset();
                            }}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        className="w-full px-6 py-4 rounded-xl border border-gray-100 bg-[#fafafa] focus:outline-none focus:border-black transition-all"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Surname"
                                        className="w-full px-6 py-4 rounded-xl border border-gray-100 bg-[#fafafa] focus:outline-none focus:border-black transition-all"
                                    />
                                </div>

                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full px-6 py-4 rounded-xl border border-gray-100 bg-[#fafafa] focus:outline-none focus:border-black transition-all"
                                />

                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    className="w-full px-6 py-4 rounded-xl border border-gray-100 bg-[#fafafa] focus:outline-none focus:border-black transition-all"
                                />

                                <select className="w-full px-6 py-4 rounded-xl border border-gray-100 bg-[#fafafa] focus:outline-none appearance-none cursor-pointer">
                                    <option>I need help about...</option>
                                    <option>Order Status</option>
                                    <option>Returns & Exchanges</option>
                                    <option>Collaborations</option>
                                </select>

                                <textarea
                                    placeholder="Message"
                                    rows={5}
                                    className="w-full px-6 py-4 rounded-xl border border-gray-100 bg-[#fafafa] focus:outline-none focus:border-black transition-all resize-none"
                                ></textarea>

                                <button
                                    type="submit"
                                    className="w-full py-5 bg-black text-white font-medium rounded-full hover:opacity-90 transition-all mt-4 tracking-tight"
                                >
                                    Submit
                                </button>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
