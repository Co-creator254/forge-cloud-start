
import React from 'react';

/**
 * Agri-Tender Connect: World-Class Stakeholder Overview
 *
 * Why choose Agri-Tender Connect?
 *
 * - Empowerment: Farmers, agents, buyers, schools, CBOs, hospitals, churches, hospices, NGOs, and investors all benefit from a unified, transparent, and innovative digital marketplace.
 * - Engagement: Real-time prices, bulk orders, auctions, donations, reviews, food rescue, carbon forum, push notifications, and offline support.
 * - Impact: Proven results in food security, education, health, climate action, and community development.
 * - Trust: Advanced security, privacy, and verification for every transaction and interaction.
 * - Scalability: Ready for global partners, funders, and multi-stakeholder growth.
 *
 * Key Features & Pages:
 * - Admin Dashboard: Manage platform, analytics, and impact reports.
 * - Agent Dashboard: Product management, input pricing, verification, reviews, donations, analytics.
 * - Bulk Order Form & List: Aggregate demand for better prices and logistics.
 * - Input Pricing List & Verification: Transparent, crowd-sourced, and supplier-verified pricing.
 * - Donation Form & List: Support schools, CBOs, hospitals, churches, hospices with targeted donations and feedback.
 * - Food Rescue Form & List: Reduce waste, support communities, and promote sustainability.
 * - Product Auction Dashboard: Dynamic pricing, fair bidding, and direct sales.
 * - Supplier Review & Verification: Build trust and accountability.
 * - Carbon Forum & Community: Climate-smart agriculture, engagement, and knowledge sharing.
 * - Success Stories & Impact Reports: Real-world results and testimonials.
 * - Push Notification Center: Real-time updates for all users and events.
 * - Offline/PWA Support: Seamless access in low-connectivity environments.
 *
 * Buy-In Points for All Users:
 * - Farmers: Maximize profits, reduce waste, and access new markets.
 * - Agents/Suppliers: Streamline operations, build reputation, and grow business.
 * - Buyers: Discover quality products, participate in auctions, and support donations.
 * - Schools/CBOs/Hospitals/Churches/Hospices: Receive targeted support, provide feedback, and engage with the community.
 * - NGOs/Government: Monitor trends, support impact, and access analytics.
 * - General Public: Join food rescue, community forums, and climate action.
 * - Investors: Scalable, secure, and impact-driven platform with global reach and advanced reporting.
 *
 * Engagement & Uptake:
 * - Push notifications for every key event (donations, reviews, auctions, food rescue, etc.)
 * - Gamified achievements, badges, and leaderboards for active users.
 * - Community forums, Q&A, and support channels.
 * - Impact dashboards and transparent reporting.
 * - Seamless onboarding and user education.
 */

const StakeholderOverview: React.FC = () => (
  <div className="max-w-4xl mx-auto p-8 bg-white rounded shadow">
    <h1 className="text-3xl font-bold mb-6 text-green-700">Agri-Tender Connect: Stakeholder Value & Feature Overview</h1>
    <p className="mb-6 text-lg text-gray-700">Empowering every stakeholder in agriculture and social impact with a world-class, transparent, and engaging digital marketplace.</p>
    <div className="grid grid-cols-2 gap-6 mb-8">
      <div>
        <h2 className="text-xl font-semibold mb-2">Stakeholder Buy-In</h2>
        <ul className="list-disc pl-6 mb-4">
          <li><strong>Farmers:</strong> Maximize profits, reduce waste, access new markets, and join the carbon forum.</li>
          <li><strong>Agents/Suppliers:</strong> Streamline operations, build reputation, and grow business.</li>
          <li><strong>Buyers:</strong> Discover quality products, auctions, and support donations.</li>
          <li><strong>Schools/CBOs/Hospitals/Churches/Hospices:</strong> Receive targeted support, provide feedback, and engage with the community.</li>
          <li><strong>NGOs/Government:</strong> Monitor trends, support impact, and access analytics.</li>
          <li><strong>General Public:</strong> Join food rescue, community forums, and climate action.</li>
          <li><strong>Investors:</strong> Scalable, secure, and impact-driven platform with global reach and advanced reporting.</li>
        </ul>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Pages & Features</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Admin Dashboard</li>
          <li>Agent Dashboard</li>
          <li>Bulk Order Form & List</li>
          <li>Input Pricing List & Verification</li>
          <li>Donation Form & List (schools, CBOs, hospitals, churches, hospices)</li>
          <li>Food Rescue Form & List</li>
          <li>Product Auction Dashboard</li>
          <li>Supplier Review & Verification</li>
          <li>Carbon Forum & Community</li>
          <li>Success Stories & Impact Reports</li>
          <li>Push Notification Center</li>
          <li>Offline/PWA Support</li>
        </ul>
      </div>
    </div>
    <h2 className="text-xl font-semibold mb-2 text-green-700">Engagement & Uptake</h2>
    <ul className="list-disc pl-6 mb-4">
      <li>Push notifications for every key event (donations, reviews, auctions, food rescue, etc.)</li>
      <li>Gamified achievements, badges, and leaderboards for active users</li>
      <li>Community forums, Q&A, and support channels</li>
      <li>Impact dashboards and transparent reporting</li>
      <li>Seamless onboarding and user education</li>
    </ul>
    <h2 className="text-xl font-semibold mb-2 text-green-700">Why Choose Agri-Tender Connect?</h2>
    <ul className="list-disc pl-6 mb-4">
      <li>Empowerment, engagement, and impact for every stakeholder</li>
      <li>World-class security, privacy, and verification</li>
      <li>Scalable, future-proof architecture for global growth</li>
      <li>Ready for integration with partners, funders, and investors</li>
    </ul>
    <p className="text-gray-600">For more, see README, deployment guide, and impact reports.</p>
  </div>
);

export default StakeholderOverview;
