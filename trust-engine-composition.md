# 🧠 TRUST ENGINE COMPOSITION - HOW TRUST IS CALCULATED

## 🏗️ TRUST ENGINE ARCHITECTURE

The Trust Engine is a **multi-dimensional reputation system** that combines quantitative data with qualitative feedback to create a comprehensive trust score for African supply chains.

---

## 📊 CORE TRUST COMPONENTS

### 1. **QUANTITATIVE METRICS (70% weight)**

#### **Reliability Score (25%)**
```sql
reliability_score = (successful_transactions / total_transactions) * 100 + (trust_points * 0.1)
```
- **Transaction success rate**: Historical performance
- **Trust points boost**: QR scans + activities
- **Range**: 0-100 points

#### **Payment Reliability (20%)**
```sql
payment_reliability = on_time_payment_rate + (trust_points * 0.05)
```
- **On-time payments**: Financial responsibility
- **Payment method consistency**: M-Pesa, bank, cash patterns
- **Creditworthiness**: SACCO relationships, default rates

#### **Delivery Consistency (15%)**
```sql
delivery_consistency = punctuality_score + (completion_rate * 0.8)
```
- **On-time delivery**: Meeting windows (Kenyan flexibility)
- **Route reliability**: Real road conditions
- **Communication quality**: Status updates, notifications

#### **Transaction Volume (10%)**
```sql
volume_score = MIN(100, (total_transactions / 10) * 10)
```
- **Experience level**: More transactions = higher trust
- **Market presence**: Active participation
- **Network effects**: Connected ecosystem

---

### 2. **QUALITATIVE METRICS (30% weight)**

#### **Reviews & Feedback (15%)**
```json
{
  "reviews": [
    {
      "reviewer_id": "uuid",
      "reviewer_type": "buyer|supplier|transporter",
      "rating": 1-5,
      "comment": "text",
      "transaction_type": "delivery|payment|quality",
      "review_date": "timestamp",
      "verified": true,
      "helpful_votes": 12
    }
  ],
  "average_rating": 4.2,
  "review_count": 23,
  "sentiment_score": 0.85
}
```

**Review Components:**
- **Star rating**: 1-5 scale
- **Sentiment analysis**: Positive/negative/neutral
- **Review verification**: Confirmed transactions only
- **Helpfulness voting**: Community validation
- **Transaction context**: Type of interaction reviewed

#### **Trust Badges (10%)**
```json
{
  "trust_badges": [
    "reliable_transporter",
    "prompt_payer", 
    "quality_supplier",
    "verified_farmer",
    "community_helper",
    "dispute_resolver"
  ]
}
```

**Badge Categories:**
- **Payment badges**: `prompt_payer`, `no_disputes`
- **Delivery badges**: `reliable_transporter`, `on_time_always`
- **Quality badges**: `quality_supplier`, `verified_farmer`
- **Community badges**: `helpful_member`, `dispute_resolver`

#### **Dispute Rate (5%)**
```sql
dispute_impact = (dispute_rate * -2) + resolution_quality * 1.5
```
- **Dispute frequency**: How often conflicts arise
- **Resolution quality**: How disputes are settled
- **Fairness rating**: Community perception

---

## 🔄 DYNAMIC TRUST CALCULATION

### **Real-Time Trust Score Formula**
```sql
CREATE OR REPLACE FUNCTION calculate_composite_trust_score(p_entity_id UUID, p_entity_type TEXT)
RETURNS DECIMAL(5,2) AS $$
DECLARE
  quantitative_score DECIMAL(5,2);
  qualitative_score DECIMAL(5,2);
  final_score DECIMAL(5,2);
BEGIN
  -- Quantitative component (70%)
  SELECT 
    (reliability_score * 0.25) +
    (payment_reliability * 0.20) +
    (delivery_consistency * 0.15) +
    (LEAST(100, (total_transactions::DECIMAL / 10) * 10) * 0.10)
  INTO quantitative_score
  FROM supply_chain_trust_scores
  WHERE entity_id = p_entity_id AND entity_type = p_entity_type;
  
  -- Qualitative component (30%)
  SELECT 
    (COALESCE(average_rating, 3) * 20) + -- Convert 1-5 to 20-100 scale
    (CARDINALITY(trust_badges) * 5) + -- 5 points per badge
    (GREATEST(0, 100 - (dispute_rate * 20))) -- Lower dispute rate = higher score
  INTO qualitative_score
  FROM supply_chain_trust_scores
  WHERE entity_id = p_entity_id AND entity_type = p_entity_type;
  
  -- Final composite score
  final_score := (quantitative_score * 0.7) + (qualitative_score * 0.3);
  
  RETURN GREATEST(0, LEAST(100, final_score));
END;
$$ LANGUAGE plpgsql;
```

---

## 📈 TRUST LEVEL PROGRESSION

### **Level Requirements (Points + Score)**
| Level | Points Required | Min Trust Score | Benefits |
|-------|----------------|------------------|-----------|
| 🥉 Bronze | 0-49 | 60-70 | Basic market access |
| 🥈 Silver | 50-199 | 70-80 | Priority loading |
| 🥇 Gold | 200-499 | 80-90 | Better rates |
| 💎 Platinum | 500-999 | 90-95 | Premium support |
| 💠 Diamond | 1000+ | 95-100 | VIP benefits |

### **Level Benefits**
```json
{
  "bronze": {
    "market_access": "basic",
    "payment_terms": "standard",
    "support_priority": 3
  },
  "diamond": {
    "market_access": "premium",
    "payment_terms": "favorable",
    "support_priority": 1,
    "capacity_pooling": "priority_access",
    "decision_intelligence": "advanced_insights"
  }
}
```

---

## 🔄 TRUST DECAY & RECENCY

### **Time-Based Weighting**
```sql
-- Recent transactions weighted more heavily
time_weight = EXP(-DATEDIFF(days, CURRENT_DATE, transaction_date) / 365)

-- QR scan recency bonus
scan_recency_bonus = CASE 
  WHEN DATEDIFF(days, CURRENT_DATE, last_qr_scan) <= 7 THEN 5
  WHEN DATEDIFF(days, CURRENT_DATE, last_qr_scan) <= 30 THEN 2
  ELSE 0
END
```

### **Trust Decay Mechanism**
- **Monthly decay**: 0.5% if no activity
- **Quarterly review**: Adjust for market conditions
- **Annual reset**: Remove old negative events

---

## 🌍 KENYAN CONTEXT FACTORS

### **Local Trust Indicators**
```json
{
  "kenyan_context": {
    "sacco_membership": {
      "weight": 0.1,
      "verification": "sacco_confirmation"
    },
    "market_presence": {
      "weight": 0.15,
      "verification": "market_attendance_logs"
    },
    "community_vouching": {
      "weight": 0.2,
      "verification": "peer_recommendations"
    },
    "informal_network": {
      "weight": 0.1,
      "verification": "broker_relationships"
    }
  }
}
```

### **Cultural Trust Elements**
- **SACCO membership**: Financial community trust
- **Market day attendance**: Physical presence verification
- **Peer recommendations**: Community vouching system
- **Broker relationships**: Informal network validation

---

## 🎯 TRUST ENGINE OUTPUTS

### **Decision Intelligence Integration**
```sql
-- Trust-informed recommendations
CREATE VIEW trust_enhanced_decisions AS
SELECT 
  de.*,
  ts.trust_score,
  ts.trust_level,
  CASE 
    WHEN ts.trust_score >= 90 THEN 'high_confidence'
    WHEN ts.trust_score >= 70 THEN 'medium_confidence'
    ELSE 'low_confidence'
  END as recommendation_confidence,
  CASE 
    WHEN ts.trust_level = 'diamond' THEN 'premium_partners_only'
    WHEN ts.trust_level = 'platinum' THEN 'verified_network'
    ELSE 'open_market'
  END as recommended_market_tier
FROM supply_chain_decision_engine de
JOIN supply_chain_trust_scores ts ON de.entity_id = ts.entity_id;
```

### **Trust-Based Risk Assessment**
```json
{
  "risk_assessment": {
    "entity_risk": "LOW|MEDIUM|HIGH",
    "recommended_actions": [
      "require_advance_payment",
      "use_escrow_service",
      "request_additional_verification"
    ],
    "trust_signals": {
      "qr_scan_frequency": "high",
      "payment_history": "excellent",
      "community_reviews": "positive"
    }
  }
}
```

---

## 🏆 TRUST ENGINE SUMMARY

### **What Makes It Powerful:**

1. **Multi-dimensional**: Combines hard data + human feedback
2. **Context-aware**: Kenyan reality built-in
3. **Dynamic**: Real-time updates with decay
4. **Predictive**: Informs decision intelligence
5. **Inclusive**: All entity types (users, suppliers, transporters)
6. **Transparent**: Clear calculation methodology
7. **Gamified**: Levels and badges drive engagement

### **Trust as Currency:**
- **Market access**: Higher trust = better opportunities
- **Payment terms**: Trusted entities get favorable terms
- **Capacity sharing**: Only trusted partners can pool resources
- **Decision weight**: Trust influences AI recommendations

### **African Innovation:**
- **Informal network validation**: Beyond formal systems
- **Community-based verification**: Peer trust matters
- **Flexible time expectations**: Kenyan reality
- **Shared economy integration**: Resource pooling based on trust

---

## 🚀 IMPLEMENTATION PRIORITY

1. **Phase 1**: Core quantitative metrics
2. **Phase 2**: Review system implementation  
3. **Phase 3**: Badge system rollout
4. **Phase 4**: Kenyan context factors
5. **Phase 5**: Decision intelligence integration

This Trust Engine transforms reputation from a simple score into a **comprehensive intelligence system** that powers the entire African supply chain ecosystem.
