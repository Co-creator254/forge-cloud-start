// This page provides a critically detailed overview of the Agri-Tender Connect app for all stakeholders.
// It highlights every selling point, including advanced donation features for schools and CBOs.
// Comments and recommendations for backend (SQL/RLS) changes are included.
// Offline readiness and USSD cost implications are explained at the end.

import React from 'react';

/**
 * Agri-Tender Connect: Stakeholder Value & Feature Overview
 *
 * Stakeholders:
 * - Farmers: Access to real-time market prices, bulk order matching, input pricing, product auctions, and direct sales.
 * - Agents/Suppliers: List products, manage auctions, verify input pricing, receive reviews, and participate in donations.
 * - Buyers: Discover products, participate in auctions, donate to schools/CBOs, and review suppliers.
 * - Schools/CBOs: Receive donations, request products, and provide feedback on received goods.
 * - NGOs/Government: Monitor market trends, support donations, and analyze supply chain data.
 * - General Public: Transparency, food rescue, and community engagement.
 *
 * Key Features & Selling Points:
 * 1. Real-time Input Pricing: Verified by crowdsource and supplier, with review and verification workflows.
 * 2. Bulk Order Matching: Efficient aggregation for lower prices and logistics optimization.
 * 3. Product Auctions: Dynamic pricing, transparent bidding, and direct farmer-to-buyer sales.
 * 4. Supplier Reviews: Trust-building via ratings and feedback.
 * 5. Food Rescue: Surplus and imperfect produce can be donated or sold at reduced prices.
 * 6. Donations: Agents, buyers, and public can donate products to schools and CBOs. Schools/CBOs can request donations and provide feedback.
 * 7. Carbon Forum: Community engagement and climate-smart agriculture discussions.
 * 8. Offline Readiness: PWA support, local caching, and USSD integration for basic transactions.
 * 9. Security: Row Level Security (RLS) ensures data privacy and correct access for all roles.
 *
 * Backend Recommendations:
 * - SQL: Ensure all donation tables include recipient_type (school, CBO, etc.) and recipient_id. Add feedback columns for recipient reviews.
 * - RLS: Policies should allow schools/CBOs to view and acknowledge donations, and agents/public to donate. Example:
 *   CREATE POLICY school_cbo_view_donations ON city_market_donations FOR SELECT USING (recipient_type IN ('school','CBO') AND recipient_id = auth.uid());
 *   CREATE POLICY agent_public_donate ON city_market_donations FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
 * - Forms: Donation forms should allow selection of recipient type (school, CBO) and recipient ID.
 *
 * Offline Readiness:
 * - The app is a Progressive Web App (PWA) with local caching for product lists, pricing, and user actions.
 * - Most features (viewing, submitting forms) work offline; sync occurs when reconnected.
 * - USSD integration allows basic transactions (view prices, place orders, donate) via feature phones. USSD costs depend on telecom provider; some charge per session or per request. The app minimizes USSD steps to reduce cost.
 *
 * For further details, see the README and deployment guide.
 */

const StakeholderOverview: React.FC = () => (
  <div className="max-w-4xl mx-auto p-8 bg-white rounded shadow">
    <h1 className="text-3xl font-bold mb-6 text-green-700">Agri-Tender Connect: World-Class Platform for Agriculture & Social Impact</h1>
    <p className="mb-6 text-lg text-gray-700">Empowering farmers, agents, buyers, schools, CBOs, hospitals, churches, hospices, NGOs, and investors with a unified, transparent, and innovative digital marketplace.</p>
    <div className="grid grid-cols-2 gap-6 mb-8">
      <div>
        <h2 className="text-xl font-semibold mb-2">Stakeholder Value</h2>
        <ul className="list-disc pl-6 mb-4">
          <li><strong>Farmers:</strong> Real-time prices, bulk orders, auctions, direct sales, input reviews, food rescue, carbon forum.</li>
          <li><strong>Agents/Suppliers:</strong> Product management, input pricing, verification, reviews, donations, analytics.</li>
          <li><strong>Buyers:</strong> Product discovery, auctions, donations, supplier reviews, engagement features.</li>
          <li><strong>Schools/CBOs/Hospitals/Churches/Hospices:</strong> Receive/request donations, feedback, transparency, impact reporting.</li>
          <li><strong>NGOs/Government:</strong> Market monitoring, donation support, analytics, policy insights.</li>
          <li><strong>General Public:</strong> Food rescue, community engagement, climate action.</li>
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
    <h2 className="text-xl font-semibold mb-2 text-green-700">Innovation & Impact</h2>
    <ul className="list-disc pl-6 mb-4">
      <li>Verified input pricing and reviews for transparency</li>
      <li>Bulk order matching for cost savings and logistics</li>
      <li>Dynamic product auctions for fair pricing</li>
      <li>Supplier ratings and verification for trust</li>
      <li>Food rescue and imperfect produce for sustainability</li>
      <li>Donations to schools, CBOs, hospitals, churches, hospices for social impact</li>
      <li>Carbon forum for climate-smart agriculture</li>
      <li>Push notifications for engagement and updates</li>
      <li>Offline-ready PWA for rural and low-connectivity users</li>
      <li>Advanced RLS for security and privacy</li>
      <li>Impact reporting for investors and NGOs</li>
    </ul>
    <h2 className="text-xl font-semibold mb-2 text-green-700">Push Notification System</h2>
    <p className="mb-2">Real-time notifications for donations, product updates, verification, and community events. Powered by Supabase triggers and frontend subscriptions for instant delivery.</p>
    <h2 className="text-xl font-semibold mb-2 text-green-700">Offline Readiness</h2>
    <p className="mb-2">Progressive Web App (PWA) with local caching. All major features (viewing, submitting forms, notifications) work offline and sync when reconnected.</p>
    <h2 className="text-xl font-semibold mb-2 text-green-700">Backend & Security</h2>
    <ul className="list-disc pl-6 mb-4">
      <li>Donation tables: recipient_type, recipient_id, feedback, rating</li>
      <li>RLS: Policies for all recipient types and agent/public donation</li>
      <li>Push notification triggers for key events</li>
      <li>Forms: Recipient selection, feedback, and impact tracking</li>
    </ul>
    <h2 className="text-xl font-semibold mb-2 text-green-700">Why Invest?</h2>
    <ul className="list-disc pl-6 mb-4">
      <li>Scalable, secure, and future-proof architecture</li>
      <li>Multi-stakeholder engagement and global reach</li>
      <li>Proven impact in food security, education, health, and climate action</li>
      <li>Advanced analytics and reporting for transparency</li>
      <li>Ready for integration with global partners and funders</li>
    </ul>
    <p className="text-gray-600">For more, see README, deployment guide, and impact reports.</p>
  </div>
);

export default StakeholderOverview;
