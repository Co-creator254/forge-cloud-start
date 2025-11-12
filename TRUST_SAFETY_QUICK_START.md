# Trust & Safety Components - Quick Start Guide

## Installation & Setup

All components are located in:
```
src/components/TrustSafety/
```

### Basic Import
```tsx
import {
  ProductReviews,
  WarrantyManagement,
  ReturnRefundManagement,
  DisputeResolution,
  BuyerProtection,
  SellerVerificationInfo,
  EscrowPaymentSecurity
} from '@/components/TrustSafety';
```

---

## 1. Product Reviews - Quick Start

### Simple Integration
```tsx
import { ProductReviews } from '@/components/TrustSafety';

export function ProductPage() {
  return (
    <ProductReviews 
      product_id="prod_123"
      product_type="equipment"
      seller_id="seller_456"
    />
  );
}
```

### Features Included
- ⭐ Star rating system
- 💬 Customer reviews
- 👍 Helpful voting
- 🏷️ Verified purchase badges
- 📊 Rating statistics

---

## 2. Warranty Management - Quick Start

### Simple Integration
```tsx
import { WarrantyManagement } from '@/components/TrustSafety';

export function ProductPage() {
  return (
    <WarrantyManagement
      product_id="prod_123"
      order_id="order_789"
      seller_id="seller_456"
    />
  );
}
```

### Features Included
- 🛡️ Warranty coverage info
- ⏳ Expiration countdown
- 📋 Claim submission form
- 📊 Claim history
- ✅ Claim status tracking

---

## 3. Return & Refund Management - Quick Start

### Simple Integration
```tsx
import { ReturnRefundManagement } from '@/components/TrustSafety';

export function OrderPage() {
  return (
    <ReturnRefundManagement
      order_id="order_789"
      product_id="prod_123"
      order_total={1500}
    />
  );
}
```

### Features Included
- 📦 Return policy display
- 💰 Refund information
- 🚚 Free return shipping
- 📈 Progress tracking
- 🔄 Refund status

---

## 4. Dispute Resolution - Quick Start

### Simple Integration
```tsx
import { DisputeResolution } from '@/components/TrustSafety';

export function OrderPage() {
  return (
    <DisputeResolution
      order_id="order_789"
      seller_id="seller_456"
      buyer_id="buyer_123"
    />
  );
}
```

### Features Included
- ⚖️ Dispute filing
- 💬 Messaging system
- 📊 Status tracking
- 🕐 Timeline visualization
- ✅ Resolution outcomes

---

## 5. Buyer Protection - Quick Start

### Simple Integration
```tsx
import { BuyerProtection } from '@/components/TrustSafety';

export function OrderPage() {
  return (
    <BuyerProtection
      order_id="order_789"
      order_amount={1500}
    />
  );
}
```

### Features Included
- 🛡️ Protection coverage
- 📋 Coverage types
- ℹ️ How it works guide
- ✅ Guarantee details
- 📞 Support contact

---

## 6. Seller Verification - Quick Start

### Simple Integration
```tsx
import { SellerVerificationInfo } from '@/components/TrustSafety';

export function SellerProfilePage() {
  return (
    <SellerVerificationInfo seller_id="seller_456" />
  );
}
```

### Features Included
- ✅ Verification status
- ⭐ Average rating
- 📊 Performance metrics
- 🏆 Seller badges
- 💯 Trust indicators

---

## 7. Escrow & Payment Security - Quick Start

### Simple Integration
```tsx
import { EscrowPaymentSecurity } from '@/components/TrustSafety';

export function OrderPage() {
  return (
    <EscrowPaymentSecurity
      order_id="order_789"
      order_amount={1500}
      seller_id="seller_456"
    />
  );
}
```

### Features Included
- 🔒 Secure payment holding
- 📊 Escrow status
- ⏳ Release timeline
- 🛡️ Security features
- 💡 Security tips

---

## Complete Order Page Example

```tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import {
  ProductReviews,
  WarrantyManagement,
  ReturnRefundManagement,
  DisputeResolution,
  BuyerProtection,
  SellerVerificationInfo,
  EscrowPaymentSecurity
} from '@/components/TrustSafety';
import { Card } from '@/components/ui/card';

export default function CompleteOrderPage() {
  const { orderId, productId, sellerId } = useParams();

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-8">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold">Order #{orderId}</h1>
        <p className="text-gray-600">Review and manage your order</p>
      </div>

      {/* Trust & Safety Section */}
      <div className="space-y-6">
        
        {/* 1. Seller Information */}
        <Card>
          <SellerVerificationInfo seller_id={sellerId} />
        </Card>

        {/* 2. Buyer Protection */}
        <Card>
          <BuyerProtection 
            order_id={orderId} 
            order_amount={1500}
          />
        </Card>

        {/* 3. Payment Security */}
        <Card>
          <EscrowPaymentSecurity
            order_id={orderId}
            order_amount={1500}
            seller_id={sellerId}
          />
        </Card>

        {/* 4. Warranty */}
        <Card>
          <WarrantyManagement
            product_id={productId}
            order_id={orderId}
            seller_id={sellerId}
          />
        </Card>

        {/* 5. Returns */}
        <Card>
          <ReturnRefundManagement
            order_id={orderId}
            product_id={productId}
            order_total={1500}
          />
        </Card>

        {/* 6. Reviews */}
        <Card>
          <ProductReviews
            product_id={productId}
            product_type="equipment"
            seller_id={sellerId}
          />
        </Card>

        {/* 7. Disputes */}
        <Card>
          <DisputeResolution
            order_id={orderId}
            seller_id={sellerId}
            buyer_id={currentUser?.id}
          />
        </Card>
      </div>
    </div>
  );
}
```

---

## Required Environment Setup

### Supabase Configuration
```tsx
// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);
```

### Environment Variables
```bash
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

---

## Styling & Customization

### Tailwind Configuration
All components use Tailwind CSS classes. Customize colors in `tailwind.config.ts`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        // Trust colors
        trust: {
          green: '#10b981',   // Success & trust
          blue: '#3b82f6',    // Security & info
          red: '#ef4444',     // Warnings & errors
          yellow: '#f59e0b',  // Caution
        }
      }
    }
  }
};
```

### Custom Styling Example
```tsx
<div className="bg-green-50 border border-green-200 rounded-lg p-4">
  <p className="text-green-900 font-semibold">Secure & Protected</p>
</div>
```

---

## Error Handling

All components include built-in error handling with toast notifications:

```tsx
import { useToast } from '@/hooks/use-toast';

// Inside component
const { toast } = useToast();

toast({
  title: 'Success',
  description: 'Review submitted successfully',
});

toast({
  title: 'Error',
  description: 'Failed to submit review',
  variant: 'destructive',
});
```

---

## Common Props Pattern

### Universal Props
All components follow this pattern:
```tsx
interface ComponentProps {
  // Primary identifiers
  product_id?: string;    // For product-related components
  order_id: string;       // For order-related components
  seller_id?: string;     // Seller identifier
  buyer_id?: string;      // Buyer identifier
  user_id?: string;       // Generic user ID
  
  // Data
  order_amount?: number;  // Order total amount
  product_type?: string;  // Product category
}
```

---

## State Management

All components manage their own state using React Hooks:

```tsx
const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

useEffect(() => {
  fetchData();
}, [dependencies]);
```

---

## Real-time Updates

Components automatically update when Supabase data changes:

```tsx
// Real-time subscriptions are built-in
const fetchData = async () => {
  const { data, error } = await supabase
    .from('table_name')
    .select('*')
    .order('created_at', { ascending: false });
};
```

---

## Mobile Responsive

All components are fully responsive:
- ✅ Mobile (320px+)
- ✅ Tablet (768px+)
- ✅ Desktop (1024px+)

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Responsive layout */}
</div>
```

---

## Performance Tips

### Optimization Strategies
1. **Memoize components** if used in list
```tsx
const MemoizedComponent = React.memo(YourComponent);
```

2. **Lazy load components**
```tsx
const ProductReviews = React.lazy(() => import('./ProductReviews'));
```

3. **Batch queries**
```tsx
const { data } = await supabase
  .from('table')
  .select('*')
  .limit(50);
```

---

## Accessibility Features

All components include:
- ✅ Semantic HTML
- ✅ ARIA labels
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Color contrast compliance

---

## Testing Examples

### Unit Test
```tsx
import { render, screen } from '@testing-library/react';
import { ProductReviews } from '@/components/TrustSafety';

test('renders reviews component', () => {
  render(
    <ProductReviews 
      product_id="test" 
      product_type="equipment"
    />
  );
  expect(screen.getByText('Customer Reviews')).toBeInTheDocument();
});
```

### Integration Test
```tsx
test('fetches and displays reviews', async () => {
  render(<ProductReviews product_id="test" />);
  const reviews = await screen.findByText('Review Title');
  expect(reviews).toBeInTheDocument();
});
```

---

## Troubleshooting

### Common Issues

**Issue**: Component not rendering
- ✓ Check if all required props are provided
- ✓ Verify Supabase client is initialized
- ✓ Check browser console for errors

**Issue**: No data displayed
- ✓ Verify Supabase tables exist
- ✓ Check RLS policies allow access
- ✓ Ensure user is authenticated

**Issue**: Styling issues
- ✓ Verify Tailwind CSS is configured
- ✓ Check shadcn/ui components are installed
- ✓ Clear build cache and rebuild

---

## Additional Resources

- 📚 Full Component Guide: `TRUST_SAFETY_COMPONENTS.md`
- 📋 Implementation Details: `TRUST_SAFETY_IMPLEMENTATION_COMPLETE.md`
- 🗄️ Database Schema: See Supabase documentation
- 💻 Code Examples: Review component files directly

---

## Support

For issues or questions:
1. Check the documentation files
2. Review component prop interfaces
3. Check component comments
4. Contact development team

---

**Quick Start Complete! 🎉**

You now have access to a complete Trust & Safety system with 7 components ready to integrate into your marketplace application.
