# WalletPage Component Code Review & Refactor (React + TypeScript)

## Problem Statement

Analyze a given React functional component using TypeScript and hooks, identify computational inefficiencies and anti-patterns, and provide a **refactored version**.

---

## Issues Identified in the Original Code

1. **Redundant Calls to `getPriority`**  
   - `getPriority()` is invoked multiple times within `.filter()` and `.sort()`.

2. **Bug in Filtering Logic**  
   - Uses `lhsPriority` (undefined) instead of `balancePriority`.

3. **Unused Variable**  
   - `formattedBalances` is created but never used.

4. **Inaccurate `useMemo` Dependencies**  
   - `prices` is in the dependency array but not used inside.

5. **Inconsistent Interface**  
   - `blockchain` field used but not declared in `WalletBalance`.

6. **Unstable React Keys**  
   - Uses array `index` as a key in `.map()` — discouraged in React.

7. **Inline Computation in JSX**  
   - `usdValue` is computed directly inside `.map()` loop.

---

## Refactored Improvements

- Combined filtering, sorting, and transformation in one `useMemo`
- Eliminated duplicate `getPriority()` calls
- Ensured type safety (`blockchain` in interface)
- Used unique stable keys (`currency-blockchain`)
- Pre-calculated values like `usdValue` and `formatted`

---

## 📄 Original Code (With Issues)

```TypeScript
interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = ({ children, ...rest }) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  const getPriority = (blockchain: string): number => {
    const priorities: Record<string, number> = {
      Osmosis: 100,
      Ethereum: 50,
      Arbitrum: 30,
      Zilliqa: 20,
      Neo: 20,
    };
    return priorities[blockchain] ?? -99;
  };

  const enrichedBalances = useMemo(() => {
    return balances
      .filter((balance) => {
        const priority = getPriority(balance.blockchain);
        return priority > -99 && balance.amount > 0;
      })
      .sort((a, b) => getPriority(b.blockchain) - getPriority(a.blockchain))
      .map((balance) => ({
        ...balance,
        formatted: balance.amount.toFixed(),
        usdValue: prices[balance.currency] * balance.amount,
      }));
  }, [balances, prices]);

  return (
    <div {...rest}>
      {enrichedBalances.map((balance) => (
        <WalletRow
          key={`${balance.currency}-${balance.blockchain}`}
          className={classes.row}
          amount={balance.amount}
          usdValue={balance.usdValue}
          formattedAmount={balance.formatted}
        />
      ))}
    </div>
  );
};
