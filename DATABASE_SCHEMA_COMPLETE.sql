-- ====================================================================
-- COMPREHENSIVE DATABASE SCHEMA - SUPABASE SQL
-- Created: November 12, 2025
-- Purpose: Complete marketplace system with all missing tables
-- ====================================================================

-- ====================================================================
-- CRITICAL TABLES (Must be created first)
-- ====================================================================

-- 1. USER PROFILES & SELLER VERIFICATION
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type VARCHAR(20) NOT NULL DEFAULT 'buyer', -- buyer, seller, supplier, farmer
  business_name VARCHAR(255),
  business_registration_number VARCHAR(100) UNIQUE,
  phone_number VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  county VARCHAR(100),
  country VARCHAR(100) DEFAULT 'Kenya',
  postal_code VARCHAR(20),
  is_verified BOOLEAN DEFAULT FALSE,
  verification_date TIMESTAMP,
  verification_method VARCHAR(50), -- document, phone, email
  average_rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  total_sales INTEGER DEFAULT 0,
  account_balance DECIMAL(12,2) DEFAULT 0,
  kyc_status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
  kyc_submitted_date TIMESTAMP,
  kyc_approved_date TIMESTAMP,
  profile_photo_url TEXT,
  bio TEXT,
  website_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_profiles_user_type ON public.user_profiles(user_type);
CREATE INDEX idx_user_profiles_is_verified ON public.user_profiles(is_verified);
CREATE INDEX idx_user_profiles_kyc_status ON public.user_profiles(kyc_status);

-- 2. SELLER RATINGS & REVIEWS (for sellers/suppliers)
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.seller_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_title VARCHAR(255),
  review_text TEXT,
  transaction_id UUID, -- link to order/transaction
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  helpful_count INTEGER DEFAULT 0,
  unhelpful_count INTEGER DEFAULT 0,
  seller_response TEXT,
  seller_response_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(seller_id, reviewer_id, transaction_id) -- prevent duplicate reviews for same transaction
);

CREATE INDEX idx_seller_ratings_seller_id ON public.seller_ratings(seller_id);
CREATE INDEX idx_seller_ratings_reviewer_id ON public.seller_ratings(reviewer_id);
CREATE INDEX idx_seller_ratings_rating ON public.seller_ratings(rating);
CREATE INDEX idx_seller_ratings_created_at ON public.seller_ratings(created_at DESC);

-- 3. PRODUCT/EQUIPMENT REVIEWS
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL, -- can be equipment_id or farm_input_product_id
  product_type VARCHAR(50) NOT NULL, -- equipment, farm_input, subscription_box, agricultural_product
  reviewer_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_title VARCHAR(255),
  review_text TEXT,
  photo_urls TEXT[], -- array of image URLs
  video_url TEXT,
  quality_rating INTEGER,
  delivery_rating INTEGER,
  seller_communication_rating INTEGER,
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  helpful_count INTEGER DEFAULT 0,
  unhelpful_count INTEGER DEFAULT 0,
  seller_response TEXT,
  seller_response_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_product_reviews_product_id ON public.product_reviews(product_id);
CREATE INDEX idx_product_reviews_product_type ON public.product_reviews(product_type);
CREATE INDEX idx_product_reviews_reviewer_id ON public.product_reviews(reviewer_id);
CREATE INDEX idx_product_reviews_rating ON public.product_reviews(rating);
CREATE INDEX idx_product_reviews_created_at ON public.product_reviews(created_at DESC);

-- ====================================================================
-- MESSAGING & COMMUNICATION TABLES
-- ====================================================================

-- 4. INQUIRIES & QUOTATIONS
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL, -- equipment_id or product_id
  product_type VARCHAR(50) NOT NULL, -- equipment, farm_input, etc
  seller_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  inquiry_type VARCHAR(30) NOT NULL DEFAULT 'general', -- general, quotation, availability, bulk
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  quantity_requested INTEGER,
  delivery_required BOOLEAN DEFAULT FALSE,
  delivery_location TEXT,
  price_range_min DECIMAL(12,2),
  price_range_max DECIMAL(12,2),
  urgency VARCHAR(20) DEFAULT 'normal', -- low, normal, high, urgent
  status VARCHAR(20) DEFAULT 'pending', -- pending, responded, quoted, declined, converted_to_order
  seller_response TEXT,
  seller_response_date TIMESTAMP,
  quoted_price DECIMAL(12,2),
  quote_validity_days INTEGER DEFAULT 30,
  quote_expiry_date TIMESTAMP,
  viewed_by_seller BOOLEAN DEFAULT FALSE,
  viewed_by_seller_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_inquiries_product_id ON public.inquiries(product_id);
CREATE INDEX idx_inquiries_seller_id ON public.inquiries(seller_id);
CREATE INDEX idx_inquiries_buyer_id ON public.inquiries(buyer_id);
CREATE INDEX idx_inquiries_status ON public.inquiries(status);
CREATE INDEX idx_inquiries_created_at ON public.inquiries(created_at DESC);

-- 5. DIRECT MESSAGING
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant1_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  participant2_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  product_id UUID, -- related to a specific product
  product_type VARCHAR(50),
  subject VARCHAR(255),
  last_message_content TEXT,
  last_message_date TIMESTAMP,
  participant1_unread_count INTEGER DEFAULT 0,
  participant2_unread_count INTEGER DEFAULT 0,
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_conversations_participant1_id ON public.conversations(participant1_id);
CREATE INDEX idx_conversations_participant2_id ON public.conversations(participant2_id);
CREATE INDEX idx_conversations_product_id ON public.conversations(product_id);

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  message_text TEXT NOT NULL,
  file_urls TEXT[],
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  deleted_by_sender BOOLEAN DEFAULT FALSE,
  deleted_by_receiver BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON public.messages(receiver_id);
CREATE INDEX idx_messages_is_read ON public.messages(is_read);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);

-- ====================================================================
-- SHOPPING & CHECKOUT TABLES
-- ====================================================================

-- 6. SHOPPING CART
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.shopping_carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  total_items INTEGER DEFAULT 0,
  subtotal DECIMAL(12,2) DEFAULT 0,
  tax DECIMAL(12,2) DEFAULT 0,
  shipping_cost DECIMAL(12,2) DEFAULT 0,
  total_amount DECIMAL(12,2) DEFAULT 0,
  coupon_code VARCHAR(50),
  discount_amount DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID NOT NULL REFERENCES public.shopping_carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL,
  product_type VARCHAR(50) NOT NULL, -- farm_input, equipment (rental), subscription_box
  seller_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(12,2) NOT NULL,
  item_total DECIMAL(12,2) NOT NULL,
  custom_attributes JSONB, -- for storing variant/option selections
  added_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_cart_items_cart_id ON public.cart_items(cart_id);
CREATE INDEX idx_cart_items_product_id ON public.cart_items(product_id);
CREATE INDEX idx_cart_items_seller_id ON public.cart_items(seller_id);

-- 7. ORDERS & ORDER ITEMS
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  buyer_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  order_status VARCHAR(30) DEFAULT 'pending', -- pending, confirmed, processing, shipped, delivered, cancelled, disputed
  payment_status VARCHAR(30) DEFAULT 'unpaid', -- unpaid, paid, refunded, dispute
  delivery_status VARCHAR(30) DEFAULT 'not_shipped', -- not_shipped, shipped, in_transit, delivered, returned
  subtotal DECIMAL(12,2) NOT NULL,
  tax DECIMAL(12,2) DEFAULT 0,
  shipping_cost DECIMAL(12,2) DEFAULT 0,
  discount_amount DECIMAL(12,2) DEFAULT 0,
  total_amount DECIMAL(12,2) NOT NULL,
  payment_method VARCHAR(50), -- mpesa, card, bank_transfer, cash_on_delivery
  payment_reference VARCHAR(100),
  payment_date TIMESTAMP,
  shipping_address TEXT NOT NULL,
  shipping_city VARCHAR(100),
  shipping_county VARCHAR(100),
  shipping_postal_code VARCHAR(20),
  tracking_number VARCHAR(100),
  estimated_delivery_date DATE,
  actual_delivery_date TIMESTAMP,
  notes TEXT,
  cancellation_reason TEXT,
  cancellation_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_orders_order_number ON public.orders(order_number);
CREATE INDEX idx_orders_buyer_id ON public.orders(buyer_id);
CREATE INDEX idx_orders_seller_id ON public.orders(seller_id);
CREATE INDEX idx_orders_order_status ON public.orders(order_status);
CREATE INDEX idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  product_type VARCHAR(50) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(12,2) NOT NULL,
  item_total DECIMAL(12,2) NOT NULL,
  custom_attributes JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_order_items_product_id ON public.order_items(product_id);

-- 8. PAYMENTS & TRANSACTIONS
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  payment_method VARCHAR(50) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'KES',
  payment_status VARCHAR(30) DEFAULT 'pending', -- pending, processing, completed, failed, refunded
  payment_reference VARCHAR(100),
  payment_gateway_response JSONB,
  mpesa_phone VARCHAR(20),
  mpesa_receipt_number VARCHAR(50),
  card_last_4 VARCHAR(4),
  bank_name VARCHAR(100),
  bank_account_number VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_payments_order_id ON public.payments(order_id);
CREATE INDEX idx_payments_payment_status ON public.payments(payment_status);
CREATE INDEX idx_payments_payment_reference ON public.payments(payment_reference);

-- ====================================================================
-- DELIVERY & LOGISTICS
-- ====================================================================

-- 9. DELIVERY ADDRESSES
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.delivery_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  address_type VARCHAR(30) DEFAULT 'delivery', -- delivery, billing, warehouse
  recipient_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  street_address TEXT NOT NULL,
  apartment_number VARCHAR(50),
  city VARCHAR(100) NOT NULL,
  county VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'Kenya',
  landmark TEXT,
  delivery_instructions TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_delivery_addresses_user_id ON public.delivery_addresses(user_id);

-- 10. DELIVERY TRACKING
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.delivery_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL UNIQUE REFERENCES public.orders(id) ON DELETE CASCADE,
  tracking_number VARCHAR(100) UNIQUE,
  courier_service VARCHAR(100),
  courier_phone VARCHAR(20),
  current_location TEXT,
  current_status VARCHAR(50), -- in_transit, out_for_delivery, attempted, delivered
  estimated_arrival TIMESTAMP,
  last_updated TIMESTAMP DEFAULT NOW(),
  GPS_latitude DECIMAL(9,6),
  GPS_longitude DECIMAL(9,6),
  delivery_proof_photo_url TEXT,
  signature_url TEXT,
  recipient_name_on_delivery VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_delivery_tracking_order_id ON public.delivery_tracking(order_id);
CREATE INDEX idx_delivery_tracking_tracking_number ON public.delivery_tracking(tracking_number);

-- ====================================================================
-- BULK ORDERS SYSTEM
-- ====================================================================

-- 11. BULK ORDER PARTICIPANTS
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.bulk_order_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bulk_order_id UUID NOT NULL REFERENCES public.bulk_orders(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  quantity_committed DECIMAL(10,2) NOT NULL,
  payment_amount DECIMAL(12,2),
  payment_status VARCHAR(30) DEFAULT 'pending', -- pending, paid, overdue, refunded
  payment_due_date DATE,
  payment_date TIMESTAMP,
  delivery_address_id UUID REFERENCES public.delivery_addresses(id),
  status VARCHAR(30) DEFAULT 'joined', -- joined, confirmed, paid, received, cancelled
  joined_date TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_bulk_order_participants_bulk_order_id ON public.bulk_order_participants(bulk_order_id);
CREATE INDEX idx_bulk_order_participants_participant_id ON public.bulk_order_participants(participant_id);
CREATE INDEX idx_bulk_order_participants_payment_status ON public.bulk_order_participants(payment_status);

-- 12. BULK ORDER COMMUNICATION
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.bulk_order_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bulk_order_id UUID NOT NULL REFERENCES public.bulk_orders(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  message_type VARCHAR(50) DEFAULT 'general', -- announcement, status_update, payment_reminder, dispute, urgent
  title VARCHAR(255),
  content TEXT NOT NULL,
  attachment_urls TEXT[],
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_bulk_order_messages_bulk_order_id ON public.bulk_order_messages(bulk_order_id);
CREATE INDEX idx_bulk_order_messages_sender_id ON public.bulk_order_messages(sender_id);

-- ====================================================================
-- AGRICULTURAL PRODUCTS (F2C) - SUBSCRIPTION SYSTEM
-- ====================================================================

-- 13. SUBSCRIPTIONS
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  box_id UUID NOT NULL REFERENCES public.subscription_boxes(id) ON DELETE CASCADE,
  subscription_status VARCHAR(30) DEFAULT 'active', -- active, paused, cancelled
  subscription_start_date DATE NOT NULL,
  subscription_end_date DATE,
  frequency VARCHAR(20) NOT NULL, -- weekly, bi-weekly, monthly
  next_delivery_date DATE,
  total_deliveries INTEGER DEFAULT 0,
  completed_deliveries INTEGER DEFAULT 0,
  auto_renew BOOLEAN DEFAULT TRUE,
  payment_status VARCHAR(30) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  cancelled_date TIMESTAMP,
  cancellation_reason TEXT
);

CREATE INDEX idx_subscriptions_subscriber_id ON public.subscriptions(subscriber_id);
CREATE INDEX idx_subscriptions_box_id ON public.subscriptions(box_id);
CREATE INDEX idx_subscriptions_subscription_status ON public.subscriptions(subscription_status);

-- 14. SUBSCRIPTION CUSTOMIZATIONS
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.subscription_customizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL UNIQUE REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  exclude_items TEXT[], -- items to exclude
  include_items TEXT[], -- items to include
  allergies TEXT[],
  dietary_restrictions TEXT[],
  special_requests TEXT,
  organic_only BOOLEAN DEFAULT FALSE,
  local_only BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 15. FARM PHOTOS & GALLERY
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.farm_galleries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  caption TEXT,
  photo_type VARCHAR(50), -- farm_photo, product_photo, story
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_farm_galleries_farmer_id ON public.farm_galleries(farmer_id);

-- ====================================================================
-- NOTIFICATIONS SYSTEM
-- ====================================================================

-- 16. NOTIFICATIONS
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  notification_type VARCHAR(50) NOT NULL, -- order, message, inquiry, review, system, promotion
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  related_entity_id UUID, -- order_id, message_id, inquiry_id, etc
  related_entity_type VARCHAR(50),
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  action_url TEXT,
  priority VARCHAR(20) DEFAULT 'normal', -- low, normal, high, urgent
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- 17. NOTIFICATION PREFERENCES
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT TRUE,
  sms_notifications BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT TRUE,
  in_app_notifications BOOLEAN DEFAULT TRUE,
  order_updates BOOLEAN DEFAULT TRUE,
  message_notifications BOOLEAN DEFAULT TRUE,
  review_notifications BOOLEAN DEFAULT TRUE,
  promotion_notifications BOOLEAN DEFAULT TRUE,
  digest_frequency VARCHAR(30) DEFAULT 'daily', -- immediate, daily, weekly, none
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ====================================================================
-- WISHLISTS & FAVORITES
-- ====================================================================

-- 18. WISHLISTS
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL DEFAULT 'My Wishlist',
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.wishlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wishlist_id UUID NOT NULL REFERENCES public.wishlists(id) ON DELETE CASCADE,
  product_id UUID NOT NULL,
  product_type VARCHAR(50) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  product_image_url TEXT,
  seller_id UUID REFERENCES public.user_profiles(id),
  price_at_save DECIMAL(12,2),
  current_price DECIMAL(12,2),
  date_saved TIMESTAMP DEFAULT NOW(),
  notes TEXT
);

CREATE INDEX idx_wishlist_items_wishlist_id ON public.wishlist_items(wishlist_id);

-- ====================================================================
-- MARKET & COMMODITY PRICE TRACKING (for City Markets)
-- ====================================================================

-- 19. MARKET PRICE HISTORY
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.market_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  market_id UUID NOT NULL REFERENCES public.city_markets(id) ON DELETE CASCADE,
  commodity_name VARCHAR(100) NOT NULL,
  commodity_category VARCHAR(50),
  price_per_unit DECIMAL(12,2) NOT NULL,
  unit_type VARCHAR(50) NOT NULL, -- kg, bundle, bag, crate, etc
  date_recorded DATE NOT NULL,
  time_recorded TIME,
  source VARCHAR(100), -- trader_reported, market_official, system_tracked
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_market_prices_market_id ON public.market_prices(market_id);
CREATE INDEX idx_market_prices_commodity_name ON public.market_prices(commodity_name);
CREATE INDEX idx_market_prices_date_recorded ON public.market_prices(date_recorded);

-- 20. MARKET TRADING SCHEDULE
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.market_trading_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  market_id UUID NOT NULL REFERENCES public.city_markets(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL, -- 0=Sunday, 6=Saturday
  opening_time TIME NOT NULL,
  closing_time TIME NOT NULL,
  is_trading_day BOOLEAN DEFAULT TRUE,
  special_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ====================================================================
-- DISPUTES & RESOLUTIONS
-- ====================================================================

-- 21. DISPUTES
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  claimant_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  respondent_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  dispute_type VARCHAR(50) NOT NULL, -- quality, non_delivery, wrong_item, payment_issue, fraud
  description TEXT NOT NULL,
  evidence_urls TEXT[],
  dispute_status VARCHAR(30) DEFAULT 'open', -- open, in_review, resolved, closed
  resolution_type VARCHAR(50), -- refund, replacement, partial_refund, no_action
  resolution_amount DECIMAL(12,2),
  mediator_id UUID REFERENCES public.user_profiles(id),
  mediator_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_disputes_order_id ON public.disputes(order_id);
CREATE INDEX idx_disputes_claimant_id ON public.disputes(claimant_id);
CREATE INDEX idx_disputes_dispute_status ON public.disputes(dispute_status);

-- ====================================================================
-- RATINGS AGGREGATION & STATISTICS
-- ====================================================================

-- 22. SELLER STATS (for performance tracking)
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.seller_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL UNIQUE REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  total_orders INTEGER DEFAULT 0,
  total_revenue DECIMAL(14,2) DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  response_time_hours DECIMAL(10,2) DEFAULT 0,
  order_completion_rate DECIMAL(5,2) DEFAULT 0, -- percentage
  return_rate DECIMAL(5,2) DEFAULT 0, -- percentage
  dispute_rate DECIMAL(5,2) DEFAULT 0, -- percentage
  last_updated TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_seller_statistics_seller_id ON public.seller_statistics(seller_id);

-- ====================================================================
-- ANALYTICS & LOGGING
-- ====================================================================

-- 23. USER ACTIVITY LOG
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  action_type VARCHAR(100) NOT NULL, -- view_product, add_to_cart, purchase, send_message, etc
  entity_id UUID,
  entity_type VARCHAR(50),
  ip_address INET,
  user_agent TEXT,
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX idx_activity_logs_action_type ON public.activity_logs(action_type);
CREATE INDEX idx_activity_logs_created_at ON public.activity_logs(created_at DESC);

-- ====================================================================
-- ENABLE ROW LEVEL SECURITY
-- ====================================================================

-- ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ====================================================================
-- END OF SCHEMA
-- ====================================================================
