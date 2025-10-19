/**
 * Pricing Constants
 * 
 * Centralized pricing configuration for subscription plans
 * Used across payment and pricing pages to ensure consistency
 */

export const SUBSCRIPTION_PLANS = {
  MONTHLY: {
    name: "Hàng tháng",
    price: 59000, // VND
    period: "tháng",
    displayPrice: "59.000đ/tháng",
    originalPrice: 59000
  },
  YEARLY: {
    name: "Hàng năm", 
    price: 599000, // VND
    period: "năm",
    displayPrice: "599.000đ/năm",
    originalPrice: 599000,
    savings: 109000, // VND
    savingsPercentage: 17 // Will be updated dynamically
  }
};

// Calculate savings for yearly plan
export const calculateYearlySavings = () => {
  const monthlyTotal = SUBSCRIPTION_PLANS.MONTHLY.price * 12;
  const yearlyPrice = SUBSCRIPTION_PLANS.YEARLY.price;
  const savings = monthlyTotal - yearlyPrice;
  const savingsPercentage = Math.round((savings / monthlyTotal) * 100);
  
  return {
    amount: savings,
    percentage: savingsPercentage
  };
};

// Calculate actual savings
const actualSavings = calculateYearlySavings();

// Update YEARLY plan with calculated values
SUBSCRIPTION_PLANS.YEARLY.savings = actualSavings.amount;
SUBSCRIPTION_PLANS.YEARLY.savingsPercentage = actualSavings.percentage;

// Format price for display
export const formatPrice = (price) => {
  return price.toLocaleString('vi-VN') + ' VNĐ';
};

// Get plan by type
export const getPlanByType = (type) => {
  return SUBSCRIPTION_PLANS[type.toUpperCase()];
};

// Get all plans
export const getAllPlans = () => {
  return SUBSCRIPTION_PLANS;
};
