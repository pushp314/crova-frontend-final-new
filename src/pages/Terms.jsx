import React, { useEffect } from 'react';

const Terms = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-white min-h-screen pt-[100px] pb-24 px-6">
            <div className="max-w-[800px] mx-auto prose prose-lg prose-headings:font-serif">
                <h1 className="text-4xl md:text-5xl mb-8">⚖️ Terms & Conditions</h1>
                <p className="text-sm text-gray-500 mb-8">Last Updated: November 2025</p>

                <p className="lead">
                    Welcome to Crova! By using our website — <a href="https://www.crova.in">www.crova.in</a> — you agree to the following terms. Please read them carefully.
                </p>

                <h3>1. General</h3>
                <p>Crova is an Indian clothing brand owned and operated by Rashmeet Kaur & Harshleen Suri. When you browse or purchase from our website, you agree to follow our terms, policies, and community standards.</p>

                <h3>2. Products & Custom Orders</h3>
                <p>Each Crova piece is embroidered and finished with care. Slight variations in color or design are part of our handmade process and not considered defects.</p>
                <p>Custom orders are made specifically for you and are non-returnable unless damaged or incorrect.</p>

                <h3>3. Pricing & Payments</h3>
                <ul>
                    <li>All prices are listed in INR and include applicable taxes.</li>
                    <li>Payments are securely processed through trusted payment gateways.</li>
                    <li>Prices may change without prior notice.</li>
                </ul>

                <h3>4. Shipping & Delivery</h3>
                <ul>
                    <li>We aim to dispatch orders within 7-10 working days.</li>
                    <li>Delivery timelines may vary based on location.</li>
                    <li>You'll receive tracking details once your order is shipped.</li>
                </ul>

                <h3>5. Returns & Exchanges</h3>
                <p>We accept returns for damaged or defective products within 7 days of delivery.</p>
                <p>To request a return, please contact us at <a href="mailto:crovaclothing@gmail.com" className="text-blue-600 hover:underline">crovaclothing@gmail.com</a> with your order details and photos of the item.</p>

                <h3>6. Intellectual Property</h3>
                <p>All designs, photos, and content on this site belong to Crova. Any unauthorized use, reproduction, or distribution is strictly prohibited.</p>

                <h3>7. Limitation of Liability</h3>
                <p>Crova will not be responsible for any indirect, incidental, or consequential damages arising from the use of our products or website.</p>

                <h3>8. Updates to Terms</h3>
                <p>We may update these terms from time to time. The latest version will always be available on this page.</p>

                <h3>9. Contact</h3>
                <p>For any queries, reach us at:</p>
                <p>
                    📧 <a href="mailto:crovaclothing@gmail.com" className="text-blue-600 hover:underline">crovaclothing@gmail.com</a><br />
                    📞 <a href="tel:+918770266546" className="text-blue-600 hover:underline">+91 8770266546</a><br />
                    🏠 <strong>Crova Studio</strong><br />
                    Bhilai, Chhattisgarh<br />
                    India
                </p>
            </div>
        </div>
    );
};

export default Terms;
