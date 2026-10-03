# AI Stock Research Terminal

Dark premium research terminal for **long-term investors**.
Principle: **DATA FIRST. ANALYSIS SECOND. DESIGN THIRD.**

## Quick start

No build step. Serve statically:

```powershell
# option 1 — VS Code Live Server / any static server
npx serve C:\Website\stocksme
# option 2 — python
python -m http.server 8000 --directory C:\Website\stocksme
```

Open `http://localhost:8000` → hash router:

- `#/` dashboard (market overview S&P/NASDAQ/Dow/VIX/BTC/USD-THB + watchlist) · `#/stock/NVDA` detail · `#/compare` · `#/valuation/NVDA`
- `#/industry` (Semiconductor AI supply-chain map) · `#/tools` (DCA + compound + portfolio) · `#/backtest` (monthly-DCA lab on real Stooq history) · `#/journal` · `#/news` · `#/settings`

## Live data (no API key)

Default provider is **live**: **TradingView scanner** (price, TTM
fundamentals, margins, RSI/SMA/MACD, analyst consensus + official chart
widget) + **Stooq** (delayed quotes, daily/weekly history) + **SEC EDGAR** (`companyfacts`, `submissions`, ticker→CIK map). Cached in
LocalStorage (quotes 15 min, history 1 h, fundamentals 24 h, facts 7 d).

Per stock page, all real: TTM revenue/NI/EPS, annual filing table, last-8
quarters, margin trends, FCF = OCF − CapEx, cash/debt/net-debt/D-E/current
ratio, share-count (buyback) trend, dividends declared, live trailing P/E and
market cap (formulas shown), filings feed (10-K/10-Q/8-K + insider Form 4),
1Y/3Y/5Y real returns + CAGR + max drawdown. Compare page adds a live
price/TTM-P/E row; DCF prefills base revenue + shares from SEC.

If a feed fails, the UI keeps the demo figure and says the feed is
unavailable — stale data is never presented as fresh.

## V2 additions

- **Market overview** (Stooq: S&P 500, NASDAQ 100, Dow, VIX, BTC, USD/THB + Updated timestamp).
- **Fundamental Score**: 6 explainable pillars (Growth/Profitability/Cash Flow/Balance/Efficiency/Valuation), every pillar shows formula + underlying values.
- **Scenario targets**: Bull/Base/Bear target = Rev3Y × NetM proxy × P/E ÷ Shares, assumptions stated, labeled SCENARIO.
- **Investment Thesis**: 5-question structure (what it does / growth drivers / earning power / cheap-vs-what / what breaks the thesis).
- **Price chart**: 1M–MAX ranges + MA 50/200 + volume toggles on real Stooq daily closes.
- **Compound calculator**: 1/5/10/20/30Y principal vs growth table + chart.
- **Backtest Lab**: monthly DCA on real monthly history (NVDA/AVGO/MU/ASML/AMD + VOO + BTC) with Total Return, CAGR, Max Drawdown, ann. Vol, best/worst year.
- **Semiconductor AI map**: clickable supply-chain nodes (SEED → detail, TSM/AMAT → TradingView).
- **Data confidence**: High/Medium/Low from source quality + freshness on every stock page.
- **News**: FACT vs AI-interpretation split per story.

## Research Assistant chat (💬 button, bottom-right)

Rule-based, data-grounded — answers compose **only** from SEED + live
TradingView/SEC data, never invented. Thai + English intents: price,
valuation, growth, margins, cash/debt, dividend, risk, moat, technical,
consensus, filings, compare (auto-picks a sector peer if one ticker given),
summary, watchlist, help. Unknown → "Data unavailable". History kept in
LocalStorage (`asrt_chat`, last 50).

## Data integrity rules (enforced in UI)

- Every seed figure carries a **DEMO DATA** badge until a live provider connects.
- Missing values render **"Data unavailable" / N/A** — never `0`.
- Every metric block shows **Source · Period · Updated + View Source**.
- Market price is explicitly labeled *"requires live market-data provider"*.
- No BUY/SELL language. Statuses (Growth/Financial/Valuation/Risk) are informational.
- Fact / Calculation / Interpretation / Assumption tags separate claims.
- Footer disclaimer on every screen.

## Architecture — real-data ready

```
Views (hash router in app.js)
  ↓
DataService  getQuote / getFinancials / getEarnings / getValuation / getHistoricalPrices / getNews
  ↓ (swap internals for live fetch; UI unchanged)
API base URL (Settings page / .env.example)
  ↓
Financial Data Provider (Tier-2) + SEC/IR filings (Tier-1)
```

To go live: set provider to **Custom API** in Settings, set base URL,
and replace the `DataService` methods with `fetch()` calls. Seed shape in
`SEED` is the contract (`price, mcap, rev5y, eps5y, fcf5y, margins …`).

## Extending

- **New stock** (e.g. AAPL/MSFT/META/TSM): add one entry to `SEED` in `app.js` —
  no UI changes needed; cards, detail, compare, DCF pick it up automatically.
- **Storage**: `store.get/set` wraps `localStorage` keys `asrt_*`; replace with a
  Supabase client using the same keys to migrate.
- **Charts**: dependency-free canvas primitives (`lineChart, bars, donut, spark`).

## Verification checklist

- [ ] All routes load, no dead-ends; every button has an action
- [ ] Search matches ticker / company / industry; `/` focuses search
- [ ] Watchlist add/remove/sort persists; notes + journal persist
- [ ] DCF bear/base/bull + PEG + DCA scenarios + portfolio weights=100 validation
- [ ] Mobile: bottom nav, stacked cards, horizontal-scroll tables
- [ ] Theme toggle persists; freshness badges + sources visible
