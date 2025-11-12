/**
 * Marketplace Components Index
 * 
 * All marketplace-related components for the Sokat Agricultural Platform
 * Includes shopping, ordering, market discovery, and trading features
 */

// Phase 1: Core Infrastructure (COMPLETED)
export { default as ShoppingCart } from './ShoppingCart';
export type { ShoppingCartProps, CartItem, Coupon } from './ShoppingCart';

export { default as OrderManagement } from './OrderManagement';
export type { OrderManagementProps, Order, OrderItem } from './OrderManagement';

export { default as MarketMap } from './MarketMap';
export type { MarketMapProps, Market } from './MarketMap';

// Phase 2: Market-Specific Features (COMPLETED)
export { default as LivePricing } from './LivePricing';
export type { LivePricingProps, PriceData, PriceTrend } from './LivePricing';

export { default as ParticipantSystem } from './ParticipantSystem';
export type { ParticipantSystemProps, Participant, ParticipantPayment } from './ParticipantSystem';

export { default as FarmerProfiles } from './FarmerProfiles';
export type { FarmerProfilesProps, FarmerProfile, FarmCertification } from './FarmerProfiles';

// Phase 3: Enhanced Features (PENDING)
// export { default as ProductReviews } from './ProductReviews';
// export { default as SupplierProfiles } from './SupplierProfiles';
// export { default as EquipmentDetailPage } from './EquipmentDetailPage';
// export { default as DeliverySystem } from './DeliverySystem';

// Phase 4: Premium Features (PENDING)
// export { default as PriceHistory } from './PriceHistory';
// export { default as PaymentTracking } from './PaymentTracking';
// export { default as CertificationDisplay } from './CertificationDisplay';
// export { default as MarketTradingInfo } from './MarketTradingInfo';
// export { default as FarmVisitBooking } from './FarmVisitBooking';
