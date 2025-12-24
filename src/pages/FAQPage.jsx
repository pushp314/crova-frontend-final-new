"use client";

import React, { useState, useEffect } from "react";

const faqData = [
    {
        id: "company",
        title: "Company",
        questions: [
            {
                q: "01. What is Crova all about?",
                a: "Crova is a design-focused online store that brings together thoughtfully made lifestyle products—from everyday essentials to limited-edition pieces."
            },
            {
                q: "02. Where is Crova based?",
                a: "We're proudly based on Earth, but we work with creators and makers from around the Galaxy to bring you the best."
            },
            {
                q: "03. How did Crova start?",
                a: "Crova was born from a simple idea: making beautifully crafted, functional products more accessible online. We launched in 2044 with a small collection and big ambitions."
            },
            {
                q: "04. Is Crova an independent business?",
                a: "Yes! We're an independently run company, which means we personally curate and oversee every product and collaboration that ends up on the site."
            },
            {
                q: "05. Do you work with other brands or artists?",
                a: "Absolutely. We collaborate with designers, artists, and niche brands to create unique collections and one-of-a-kind items."
            }
        ]
    },
    {
        id: "products",
        title: "Products",
        questions: [
            {
                q: "01. What kind of products do you sell?",
                a: "We offer a curated mix of home goods, accessories, apparel, and more—always with an emphasis on quality, aesthetics, and sustainability."
            },
            {
                q: "02. Are your products ethically made?",
                a: "Yes. We prioritize partners who value ethical production, fair wages, and responsible materials. Sustainability matters to us."
            },
            {
                q: "03. How often do you release new items?",
                a: "New drops happen every month. Some products are limited runs, so once they're gone, they might not come back!"
            },
            {
                q: "04. Can I request a restock of a sold-out product?",
                a: "You can sign up for back-in-stock alerts on the product page. For limited edition items, restocks aren't guaranteed—but we always listen to demand."
            },
            {
                q: "05. Do your products come with a warranty or guarantee?",
                a: "Yes, most items come with a standard guarantee. If there's an issue, we'll make it right—just reach out to our support team."
            }
        ]
    },
    {
        id: "other",
        title: "Other",
        questions: [
            {
                q: "01. Do you offer gift wrapping?",
                a: "Yes! You can add gift wrapping at checkout. We'll make it look special and include a note if you'd like."
            },
            {
                q: "02. Can I buy Crova products in a physical store?",
                a: "Currently, Crova is online-only—but we occasionally pop up at select events or concept stores. Stay tuned via our newsletter."
            },
            {
                q: "03. How can I stay updated on new releases and offers?",
                a: "Subscribe to our newsletter or follow us on Instagram and TikTok @crovashop for first dibs on new drops and exclusive promos."
            },
            {
                q: "04. Do you offer discounts or promo codes?",
                a: "We do from time to time! Sign up for our newsletter or check the homepage banners for current deals."
            }
        ]
    }
];

const FAQPage = () => {
    const [activeSection, setActiveSection] = useState("company");

    // Function to handle smooth scrolling
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            // Offset for fixed header
            const y = element.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: y, behavior: "smooth" });
            setActiveSection(id);
        }
    };

    // Optional: Update active section on scroll
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 200; // Offset

            faqData.forEach((section) => {
                const element = document.getElementById(section.id);
                if (element && element.offsetTop <= scrollPosition) {
                    setActiveSection(section.id);
                }
            });
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="w-full bg-white pt-[56px]">

            {/* Hero Header Section */}
            <div className="relative w-full h-[400px] bg-gradient-to-r from-[#fae8ef] to-[#f4eff4] overflow-hidden flex items-center">
                <div className="max-w-[1400px] w-full mx-auto px-6 grid grid-cols-1 md:grid-cols-2 relative z-10">

                    {/* Header Text */}
                    <div className="flex flex-col justify-center gap-4">
                        <h1 className="text-[48px] md:text-[56px] font-serif font-medium text-[#4a1d33] leading-[1.1] tracking-tight">
                            Frequently Asked Questions
                        </h1>
                        <p className="text-[16px] text-[#805066] max-w-md leading-relaxed">
                            Find quick answers to common questions about orders, shipping, returns,
                            and more — all in one place.
                        </p>
                    </div>

                    {/* Hero Image (Right Side) */}
                    <img
                        src="https://picsum.photos/seed/crova_faq/600/800"
                        alt="FAQ Hero"
                        className="h-full object-contain object-bottom mix-blend-multiply"
                    />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-[1400px] mx-auto px-6 py-20">
                <div className="flex flex-col md:flex-row gap-12 lg:gap-24 relative">

                    {/* Left Sidebar (Sticky Navigation) */}
                    <div className="hidden md:block w-[200px] flex-shrink-0">
                        <div className="sticky top-[100px] flex flex-col gap-4">
                            {faqData.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => scrollToSection(section.id)}
                                    className={`text-left text-[15px] font-medium transition-colors duration-200
                    ${activeSection === section.id
                                            ? "text-black"
                                            : "text-gray-400 hover:text-gray-600"
                                        }`}
                                >
                                    {section.title}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Content (Q&A List) */}
                    <div className="flex-1 flex flex-col gap-24">
                        {faqData.map((section) => (
                            <div key={section.id} id={section.id} className="scroll-mt-24">

                                {/* Section Title (Mobile Only) */}
                                <h2 className="md:hidden text-2xl font-serif text-gray-900 mb-8 pb-4 border-b border-gray-100">
                                    {section.title}
                                </h2>

                                {/* Questions List */}
                                <div className="flex flex-col gap-12">
                                    {section.questions.map((item, idx) => (
                                        <div key={idx} className="max-w-2xl">
                                            <h3 className="text-[18px] font-medium text-[#1a1a1a] mb-3">
                                                {item.q}
                                            </h3>
                                            <p className="text-[16px] text-[#5a5a5a] leading-relaxed">
                                                {item.a}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Divider */}
                                <div className="w-full h-px bg-gray-100 mt-24 md:hidden"></div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default FAQPage;
