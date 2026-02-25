import React from 'react';

const About = () => {
    return (
        <div className="bg-white min-h-screen pt-[100px] pb-24">
            {/* Hero Section */}
            <div className="max-w-[1200px] mx-auto px-6 mb-24 text-center">
                <span className="text-sm font-medium tracking-[0.2em] text-gray-500 uppercase mb-4 block">Our Story</span>
                <h1 className="text-[42px] md:text-[64px] font-medium leading-[1.1] mb-8 text-black">
                    Two sisters. One dream.<br className="hidden md:block" /> A table full of threads.
                </h1>
                <p className="text-[18px] md:text-[20px] text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    That's how Crova began. Legacy doesn't scream. It shows up.
                </p>
            </div>

            {/* Introduction Block */}
            <div className="max-w-[1000px] mx-auto px-6 mb-32">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="prose prose-lg text-gray-600">
                        <p className="mb-6">
                            Crova was born from a bond — not business. From two sisters, <strong>Rashmeet Kaur</strong> and <strong>Harshleen Suri</strong>, who wanted to turn emotions into art.
                        </p>
                        <p className="mb-6">
                            It began on random video calls — where ideas turned into sketches, and sketches turned into threads. We didn't have a factory, a big team, or investors. What we had was a vision — to build something real, something that felt.
                        </p>
                        <p>
                            So we started from our home in <strong>Bhilai</strong>, with a single embroidery machine and endless belief. Slowly, stitch by stitch, Crova came alive — not as a clothing brand, but as a reflection of us.
                        </p>
                    </div>
                    <div className="relative aspect-[4/5] bg-[#F5F5F5] rounded-2xl overflow-hidden">
                        <img
                            src="/assets/products/featured-1.jpg"
                            alt="Crova Beginning"
                            className="object-cover w-full h-full"
                        />
                    </div>
                </div>
            </div>

            {/* What Makes Us Different */}
            <div className="bg-[#fcfcfc] py-24 mb-32">
                <div className="max-w-[1200px] mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-[32px] font-serif mb-4">🌿 What Makes Us Different</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
                            <h3 className="text-xl font-medium mb-3">✨ We Stitch, We Don't Print.</h3>
                            <p className="text-gray-600">Our embroidery is crafted to last — each design is made to feel personal, textured, and timeless.</p>
                        </div>
                        <div className="p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
                            <h3 className="text-xl font-medium mb-3">🧶 Every Piece is Hand-Finished.</h3>
                            <p className="text-gray-600">From fabric cutting to tag placement — everything is done under our eyes at Crova Studio. Nothing mass-produced, nothing rushed.</p>
                        </div>
                        <div className="p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
                            <h3 className="text-xl font-medium mb-3">💭 Emotion Over Trend.</h3>
                            <p className="text-gray-600">We don't follow fast fashion. We follow moments — designs that hold meaning, not marketing.</p>
                        </div>
                        <div className="p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-all md:col-span-1.5">
                            <h3 className="text-xl font-medium mb-3">👭 A Sister-Run Studio.</h3>
                            <p className="text-gray-600">Crova is powered by two sisters who dream, design, and decide together. Every drop you see has been lived, felt, and stitched by us.</p>
                        </div>
                        <div className="p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-all md:col-span-1.5">
                            <h3 className="text-xl font-medium mb-3">🌱 Rooted in Bhilai, Dreaming Beyond.</h3>
                            <p className="text-gray-600">What started in our hometown now travels across India — carrying a piece of Bhilai warmth in every package.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Founders Section */}
            <div className="max-w-[1200px] mx-auto px-6 mb-32">
                <h2 className="text-[36px] font-serif text-center mb-20">🧵 Our Founders</h2>
                <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
                    {/* Rashmeet */}
                    <div className="bg-[#FAFAFA] rounded-[32px] p-8 md:p-12 relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="text-[32px] font-medium mb-2">Rashmeet Kaur</h3>
                            <span className="text-sm tracking-widest text-purple-600 uppercase font-bold mb-6 block">The Visionary</span>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                The creative mind behind Crova's identity. Rashmeet blends art, storytelling, and detail into every design. She leads the brand's voice, direction, and overall aesthetic — ensuring that every tee speaks quietly but powerfully.
                            </p>
                        </div>
                    </div>

                    {/* Harshleen */}
                    <div className="bg-[#FAFAFA] rounded-[32px] p-8 md:p-12 relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="text-[32px] font-medium mb-2">Harshleen Suri</h3>
                            <span className="text-sm tracking-widest text-blue-600 uppercase font-bold mb-6 block">The Craftsmith</span>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                Harshleen is the precision and process behind Crova's embroidery. She handles the technical flow, production, and the quality that defines every Crova piece. Her patience, perfection, and love for fine detail bring Rashmeet's ideas to life — stitch by stitch.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-16 text-center max-w-3xl mx-auto bg-gray-50 p-8 rounded-2xl">
                    <h4 className="text-xl font-medium mb-4">💫 Together, They Built Crova</h4>
                    <p className="text-gray-600 italic">
                        "What started as two sisters dreaming over video calls is now a full-fledged studio in Bhilai, where every color, thread, and tag carries their touch. Crova isn't a label. It's a legacy of emotion — passed from their hearts to yours."
                    </p>
                </div>
            </div>

            {/* Our Promise */}
            <div className="max-w-[800px] mx-auto px-6 text-center mb-20">
                <div className="border border-gra-200 rounded-[40px] p-12 lg:p-16 bg-white shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-400 to-blue-400"></div>
                    <h2 className="text-[32px] font-serif mb-8">💌 Our Promise</h2>
                    <p className="text-[20px] text-gray-700 leading-relaxed mb-8">
                        "We believe that what you wear should speak quietly but stay forever. Crova is for those who love meaning in the details — who don't shout to be seen, but still get noticed."
                    </p>
                    <p className="text-lg font-medium text-black">
                        Because legacy isn't loud — it's stitched.
                    </p>
                    <div className="mt-8 pt-8 border-t border-gray-100">
                        <p className="font-serif italic text-xl">— Rashmeet & Harshleen</p>
                        <p className="text-sm text-gray-500 uppercase tracking-widest mt-2">Founders, Crova</p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default About;
