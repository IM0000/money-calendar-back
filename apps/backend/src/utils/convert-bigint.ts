export const convertEarningsBigInt = (earnings: any[]) =>
  earnings.map((item) => ({
    ...item,
    releaseDate: Number(item.releaseDate),
  }));

export const convertDividendBigInt = (dividends: any[]) =>
  dividends.map((item) => ({
    ...item,
    exDividendDate: Number(item.exDividendDate),
    paymentDate: Number(item.paymentDate),
  }));

export const convertEconomicIndicatorBigInt = (indicators: any[]) =>
  indicators.map((item) => ({
    ...item,
    releaseDate: Number(item.releaseDate),
  }));
