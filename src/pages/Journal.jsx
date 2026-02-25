"use client";

import React, { useState } from "react";
import { ArrowDown } from "lucide-react";

const articles = [
    {
        id: 1,
        category: "Editorial",
        title: "The Art of Slowing Down: Why We Curate with Intention",
        excerpt: "A quiet manifesto on the beauty of slow living and intentional curation. In this piece, we explore why Crova exists—not just to sell beautiful things, but to help you live more meaningfully with fewer, better objects.",
        image: "https://picsum.photos/seed/journal1/600/400",
    },
    {
        id: 2,
        category: "Editorial",
        title: "How to Build a Capsule Wardrobe You'll Actually Love",
        excerpt: "A capsule wardrobe isn't about restriction. It's about clarity. It's a quiet rebellion against overconsumption and trend fatigue. A way of dressing that feels less like chasing and more like choosing—with care.",
        image: "https://picsum.photos/seed/journal2/600/400",
    },
    {
        id: 3,
        category: "Articles",
        title: "The Future of Editorial Fashion: Crafting Stories That Last",
        excerpt: "In a world where fast fashion dominates headlines and social media feeds are flooded with fleeting trends, we often forget the power of storytelling. The way a garment can carry a narrative.",
        image: "https://picsum.photos/seed/journal3/600/400",
    },
    {
        id: 4,
        category: "Tips & Tricks",
        title: "5 Tips for Building a Slower, More Intentional Wardrobe",
        excerpt: "Fast fashion has taught us to chase trends, fill closets, and buy on impulse. But at Crova, we believe that getting dressed should feel like a ritual, not a race.",
        image: "https://picsum.photos/seed/journal4/600/400",
    },
    {
        id: 5,
        category: "Articles",
        title: "The Scent of Memory: Why We Light Candles Even When No One's Watching",
        excerpt: "Lighting a candle in the middle of the afternoon. Arranging flowers no one else will notice. Pouring tea into a handmade cup. These small, almost invisible gestures—they're a kind of language.",
        image: "https://picsum.photos/seed/journal5/600/400",
    },
    {
        id: 6,
        category: "Tips & Tricks",
        title: "The Art of Mindful Living: How to Create a Sanctuary in Your Home",
        excerpt: "In a world that constantly demands our attention, it's easy to forget the importance of creating a space where we can truly unwind and recharge.",
        image: "https://picsum.photos/seed/journal6/600/400",
    },
    {
        id: 7,
        category: "Editorial",
        title: "The Art of Curating: Why We Curate with Intention",
        excerpt: "In a world that rewards speed—same-day shipping, infinite feeds, instant everything—we often lose touch with stillness. With noticing. With the quiet beauty of things that don't shout for our attention.",
        image: "https://picsum.photos/seed/journal7/600/400",
    },
    {
        id: 8,
        category: "Articles",
        title: "The Art of Seasonal Transitioning: How to Refresh Your Wardrobe Without Starting Over",
        excerpt: "There's something quietly beautiful about the change of seasons. A shift in light. A new rhythm to your days. The invitation to tuck away what was and welcome what's next.",
        image: "https://picsum.photos/seed/journal8/600/400",
    },
    {
        id: 9,
        category: "Tips & Tricks",
        title: "How to Care for Your Clothes Like They're Works of Art",
        excerpt: "In a world of disposability, taking care of what you own is a quiet form of rebellion. At Crova, we believe that when you care for your clothes—truly care—you're not just preserving fabric. You're honoring the hands...",
        image: "https://picsum.photos/seed/journal9/600/400",
    }
];

const Journal = () => {
    const [activeTab, setActiveTab] = useState("All");
    const tabs = ["All", "Editorial", "Articles", "Tips & Tricks"];

    const filteredArticles = activeTab === "All"
        ? articles
        : articles.filter(art => art.category === activeTab);

    return (
        <div className="w-full bg-white pt-[56px]">

            {/* Hero Section */}
            <div className="relative w-full h-[450px] bg-gradient-to-b from-[#fbf5e2] to-white flex items-center overflow-hidden">
                <div className="max-w-[1400px] w-full mx-auto px-6 grid grid-cols-1 md:grid-cols-2 z-10">
                    <div className="flex flex-col gap-6">
                        <h1 className="text-[64px] font-serif font-medium text-[#2d2d2d] leading-none tracking-tight">
                            Journal
                        </h1>
                        <p className="text-[16px] text-[#5a5a5a] max-w-sm leading-relaxed">
                            From design notes to seasonal reflections — stories that go beyond the clothes.
                        </p>
                    </div>

                    {/* Model Image */}
                    <div className="absolute right-0 bottom-0 top-0 md:relative md:h-full flex items-end justify-end opacity-40 md:opacity-100 pointer-events-none">
                        <img
                            src="/assets/products/featured-2.jpg"
                            alt="Journal Aesthetic"
                            className="h-full object-contain object-bottom mix-blend-multiply"
                        />
                    </div>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="w-full flex justify-center py-12">
                <div className="flex items-center gap-8 border-b border-transparent">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`text-[15px] font-medium pb-2 transition-all duration-300 relative
                ${activeTab === tab ? "text-black" : "text-gray-400 hover:text-gray-600"}
              `}
                        >
                            {tab}
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black rounded-full" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Articles Grid */}
            <div className="max-w-[1400px] mx-auto px-6 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                    {filteredArticles.map((article) => (
                        <div key={article.id} className="group cursor-pointer flex flex-col gap-6">
                            {/* Image Container */}
                            <div className="w-full aspect-[16/10] rounded-[24px] overflow-hidden bg-gray-100 relative shadow-sm">
                                <img
                                    src={article.image}
                                    alt={article.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>

                            {/* Text Info */}
                            <div className="flex flex-col gap-3">
                                <h3 className="text-[20px] font-medium leading-[1.3] text-[#1a1a1a] group-hover:opacity-70 transition-opacity">
                                    {article.title}
                                </h3>
                                <p className="text-[14px] text-gray-500 leading-relaxed line-clamp-3">
                                    {article.excerpt}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Load More Button */}
                <div className="w-full flex justify-center mt-24">
                    <button className="flex items-center gap-2 px-8 py-3 rounded-full border border-gray-200 text-[14px] font-medium hover:bg-gray-50 transition-all">
                        Load More <ArrowDown className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Journal;
