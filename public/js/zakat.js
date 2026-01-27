// Client-side copy of zakat utilities for browser imports
export const KADAR = 0.025; // 2.5%

export function calcIncomeZakat(incomeYear = 0, incomeOther = 0){
  const total = Number(incomeYear || 0) + Number(incomeOther || 0);
  return total * KADAR;
}

export function calcTradeZakat(modal = 0, profit = 0, receivables = 0, debts = 0, losses = 0){
  const net = (Number(modal || 0) + Number(profit || 0) + Number(receivables || 0)) - (Number(debts || 0) + Number(losses || 0));
  return Math.max(0, net) * KADAR;
}

export function calcMetalZakat(netGrams = 0, pricePerGr = 0){
  const net = Number(netGrams || 0);
  const zakatGr = Math.max(0, net) * KADAR; // grams
  return zakatGr * Number(pricePerGr || 0);
}

export function nisabValueForGold(pricePerGr){
  return 85 * Number(pricePerGr || 0);
}

export function nisabValueForSilver(pricePerGr){
  return 595 * Number(pricePerGr || 0);
}

export default { calcIncomeZakat, calcTradeZakat, calcMetalZakat, nisabValueForGold, nisabValueForSilver };
