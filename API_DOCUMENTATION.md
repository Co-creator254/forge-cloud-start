# API Documentation - SokoConnect

**Last Updated:** January 7, 2025

## Overview
Complete API documentation for all SokoConnect operations, services, and data access patterns.

---

## 1. Supply Chain Services

### Base Path
`src/services/api/supabase/supply-chain.service.ts`

### Operations

#### Get Supply Chain Stages
```typescript
getStages(userId: string): Promise<SupplyChainStage[]>
```
**Description:** Retrieves all supply chain stages for a specific user.
**Parameters:**
- `userId` (string, required) - User ID
**Returns:** Array of SupplyChainStage objects
**Example:**
```typescript
const stages = await supplyChainService.getStages(userId);
```

#### Get Stage By ID
```typescript
getStageById(id: string): Promise<SupplyChainStage>
```
**Description:** Retrieves a single supply chain stage by ID.
**Parameters:**
- `id` (string, required) - Stage ID
**Returns:** SupplyChainStage object

#### Create Stage
```typescript
createStage(stage: Omit<SupplyChainStage, 'id' | 'created_at' | 'updated_at'>): Promise<SupplyChainStage>
```
**Description:** Creates a new supply chain stage.

#### Update Stage
```typescript
updateStage(id: string, updates: Partial<SupplyChainStage>): Promise<SupplyChainStage>
```

#### Delete Stage
```typescript
deleteStage(id: string): Promise<void>
```

#### Get Financial Analysis
```typescript
getFinancialAnalysis(userId: string, stageId?: string): Promise<FinancialAnalysis[]>
```

#### Get Financial Summary
```typescript
getFinancialSummary(userId: string): Promise<Record<string, number>>
```

---

## 2. Market Intelligence Services

### Base Path
`src/services/api/supabase/market-intelligence.service.ts`

### Operations

#### Get Road Markets
```typescript
getRoadMarkets(filters?: Partial<RoadMarket>): Promise<RoadMarket[]>
```

#### Get Market Reports
```typescript
getMarketReports(marketId?: string): Promise<MarketReport[]>
```

#### Get Route Vendors
```typescript
getRouteVendors(filters?: Partial<RouteVendor>): Promise<RouteVendor[]>
```

#### Get Demand Hotspots
```typescript
getDemandHotspots(filters?: { county?: string; commodity?: string }): Promise<DemandHotspot[]>
```

---

## 3. Marketplace Services

### Base Path
`src/services/api/supabase/marketplace.service.ts`

### Operations

#### Get Contract Farming Opportunities
```typescript
getContractFarmingOpportunities(filters?: Partial<ContractFarmingOpportunity>): Promise<ContractFarmingOpportunity[]>
```

#### Get Success Stories
```typescript
getSuccessStories(filters?: { category?: string; is_featured?: boolean }): Promise<SuccessStory[]>
```

---

## 4. Carbon Forum Services

### Tables
- `carbon_forum_posts`
- `carbon_forum_comments`

### Operations

#### Create Post
```typescript
createPost(post: any): Promise<{data, error}>
```

#### Get Post
```typescript
getPost(id: string): Promise<{data, error}>
```

#### List Posts
```typescript
listPosts(type?: string): Promise<{data, error}>
```

#### Create Comment
```typescript
createComment(comment: any): Promise<{data, error}>
```

#### List Comments
```typescript
listComments(postId: string): Promise<{data, error}>
```

---

## 5. Authentication & Authorization

### Supabase Auth
All authenticated requests automatically include JWT tokens via Supabase client.

**Row Level Security (RLS):**
- All database tables have RLS enabled
- Policies enforce user-scoped data access
- `auth.uid()` used to validate ownership

---

## 6. Error Handling

### Standard Error Response
```typescript
{
  error: {
    message: string;
    code?: string;
  }
}
```

---

## 7. CSRF Protection

SokoConnect is protected against CSRF attacks through:
1. **JWT Authentication**: Supabase automatically validates tokens
2. **RLS Policies**: Database-level security
3. **HttpOnly Cookies**: Session tokens not accessible via JavaScript
4. **Same-Origin Policy**: Only allowed origins can make requests

See `CSRF_SECURITY.md` for complete security documentation.

---

## Support

For API issues:
- Phone: +254 745824354
- Email: support@sokoconnect.ke
