import React, { useEffect } from 'react';

const PrivacyPolicy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-white min-h-screen pt-[100px] pb-24 px-6">
            <div className="max-w-[800px] mx-auto prose prose-lg prose-headings:font-serif">
                <h1 className="text-4xl md:text-5xl mb-8">🛡️ Privacy Policy</h1>
                <p className="text-sm text-gray-500 mb-8">Last Updated: November 2025</p>

                <p className="lead">
                    At Crova, we value your privacy and are committed to protecting your personal information. This policy explains how we collect, use, and protect your data when you visit our website — <a href="https://www.crova.in">www.crova.in</a>
                </p>

                <h3>1. Information We Collect</h3>
                <p>We may collect the following details when you interact with us:</p>
                <ul>
                    <li>Your name, email address, phone number, and shipping address when you place an order.</li>
                    <li>Payment details (handled securely by our payment partners).</li>
                    <li>Data from cookies to improve your browsing experience.</li>
                </ul>
                <p>We do not store your payment card details. All transactions are processed through secure payment gateways.</p>

                <h3>2. How We Use Your Information</h3>
                <p>We use your data to:</p>
                <ul>
                    <li>Process and deliver your orders.</li>
                    <li>Keep you updated about your purchase.</li>
                    <li>Improve our website, services, and user experience.</li>
                    <li>Send you special offers or updates (only if you subscribe).</li>
                </ul>

                <h3>3. Data Protection</h3>
                <p>We take appropriate steps to keep your personal data secure and private. Your data is never sold, rented, or shared with third parties, except where required for order fulfillment (like shipping or payment).</p>

                <h3>4. Cookies</h3>
                <p>Our website uses cookies to help us understand how you interact with our pages. You can disable cookies in your browser settings if you prefer.</p>

                <h3>5. Your Rights</h3>
                <p>You can:</p>
                <ul>
                    <li>Request access to your stored data.</li>
                    <li>Ask us to correct or delete your data.</li>
                    <li>Unsubscribe from promotional emails anytime.</li>
                </ul>

                <h3>6. Contact Us</h3>
                <p>If you have any questions about this policy, please reach out at:</p>
                <p>
                    📧 <a href="mailto:crovaclothing@gmail.com" className="text-blue-600 hover:underline">crovaclothing@gmail.com</a><br />
                    Or write to us at:<br />
                    <strong>Crova Studio</strong><br />
                    Bhilai, Chhattisgarh<br />
                    India
                </p>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
