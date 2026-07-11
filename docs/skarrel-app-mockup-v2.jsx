import React, { useState } from "react";
import {
  Home, ShoppingBasket, PiggyBank, User, ChevronRight, MapPin, Clock, Plus, Check,
  TrendingDown, Flame, Heart, Share2, Trophy, Coffee, Moon, MessageSquarePlus,
  ShieldCheck, ChevronDown, Medal, GraduationCap, Zap, X,
} from "lucide-react";

const TEAL = "#0f766e";
const TEAL_DARK = "#0b5a54";
const CORAL = "#ff7a59";
const BG = "#f6f5f2";

const deals = [
  { id: 1, retailer: "Checkers", branch: "Westville Pavilion", product: "Full Cream Milk 1L", price: 18.99, was: 24.99, category: "Dairy", expires: "3 days left", tag: "Save R6", fav: true },
  { id: 2, retailer: "Pick n Pay", branch: "Jan Hofmeyr Rd", product: "White Bread 700g", price: 14.49, was: 19.99, category: "Bakery", expires: "5 days left", tag: "Save R5.50" },
  { id: 3, retailer: "Superspar", branch: "Westway Mall", product: "Beef Mince 500g", price: 54.99, was: 69.99, category: "Meat", expires: "2 days left", tag: "Save R15", hot: true },
  { id: 4, retailer: "Woolworths", branch: "Pavilion", product: "Free Range Eggs 18s", price: 42.99, was: 49.99, category: "Dairy", expires: "6 days left", tag: "Save R7" },
];

const categories = ["All", "Dairy", "Bakery", "Meat", "Pantry"];
const suburbs = ["Westville", "Pinetown", "Upper Highway", "All Suburbs"];

const basketItems = [
  { name: "Full Cream Milk 1L", qty: 2 },
  { name: "White Bread 700g", qty: 1 },
  { name: "Beef Mince 500g", qty: 1 },
];

const storeComparison = [
  { store: "Checkers", branch: "Westville Pavilion", total: 148.5, cheapest: true },
  { store: "Pick n Pay", branch: "Jan Hofmeyr Rd", total: 161.2, cheapest: false },
];

const badges = [
  { icon: Medal, label: "First R500", earned: true },
  { icon: GraduationCap, label: "Student", earned: true },
  { icon: Zap, label: "5-Week Streak", earned: true },
  { icon: Trophy, label: "Top 10", earned: false },
];

const leaderboardRand = [
  { rank: 1, name: "Thando_savez", amount: 2140.5, you: false },
  { rank: 2, name: "MrsN", amount: 1980.0, you: false },
  { rank: 3, name: "Luke", amount: 1842.75, you: true },
  { rank: 4, name: "budget_bru", amount: 1690.2, you: false },
];

function Logo({ size = 16 }) {
  return (
    <span className="font-extrabold" style={{ color: "#ffffff", fontSize: size * 1.15, letterSpacing: -0.5 }}>
      Ska<span style={{ color: CORAL }}>rr</span>el
    </span>
  );
}

function DealCard({ deal }) {
  const [fav, setFav] = useState(!!deal.fav);
  return (
    <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-gray-100 flex gap-3">
      <div className="rounded-xl flex-shrink-0 flex items-center justify-center text-white font-bold text-[10px] text-center leading-tight px-1" style={{ width: 60, height: 60, background: TEAL }}>
        {deal.retailer}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold text-gray-900 text-[14px] leading-snug">{deal.product}</p>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {deal.hot && (
              <span className="flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: "#fff0eb", color: CORAL }}>
                <Flame size={9} /> HOT
              </span>
            )}
            <button onClick={() => setFav(!fav)}>
              <Heart size={16} fill={fav ? CORAL : "none"} color={fav ? CORAL : "#c0c0c0"} strokeWidth={2} />
            </button>
            <Share2 size={15} color="#b0b0b0" />
          </div>
        </div>
        <div className="flex items-center gap-1 text-gray-400 text-[11px] mt-0.5">
          <MapPin size={10} />
          <span>{deal.branch}</span>
        </div>
        <div className="flex items-end justify-between mt-1.5">
          <div className="flex items-baseline gap-1.5">
            <span className="font-extrabold text-base" style={{ color: TEAL }}>R{deal.price.toFixed(2)}</span>
            <span className="text-gray-400 text-[10px] line-through">R{deal.was.toFixed(2)}</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: CORAL }}>{deal.tag}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-400 text-[10px] mt-1">
          <Clock size={9} /><span>{deal.expires}</span>
        </div>
      </div>
    </div>
  );
}

function HomeScreen() {
  const [active, setActive] = useState("All");
  const [suburbOpen, setSuburbOpen] = useState(false);
  const [suburb, setSuburb] = useState("All Suburbs");
  const filtered = active === "All" ? deals : deals.filter((d) => d.category === active);
  return (
    <div className="flex flex-col h-full relative">
      <div className="px-4 pt-5 pb-4" style={{ background: TEAL }}>
        <div className="flex items-center justify-between mb-3">
          <Logo size={15} />
          <button onClick={() => setSuburbOpen(!suburbOpen)} className="flex items-center gap-1 bg-white/15 rounded-full px-2.5 py-1">
            <span className="text-white text-[11px] font-semibold">{suburb}</span>
            <ChevronDown size={12} color="white" />
          </button>
        </div>
        <p className="text-white text-lg font-extrabold">This week's deals</p>
      </div>
      {suburbOpen && (
        <div className="absolute top-14 right-4 bg-white rounded-xl shadow-lg border border-gray-100 z-10 py-1 w-40">
          {suburbs.map((s) => (
            <button key={s} onClick={() => { setSuburb(s); setSuburbOpen(false); }} className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50">
              {s}
            </button>
          ))}
        </div>
      )}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto" style={{ background: BG }}>
        {categories.map((c) => (
          <button key={c} onClick={() => setActive(c)} className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold"
            style={active === c ? { background: TEAL, color: "white" } : { background: "white", color: "#6b7280", border: "1px solid #e5e7eb" }}>
            {c}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2.5" style={{ background: BG }}>
        {filtered.map((d) => <DealCard key={d.id} deal={d} />)}
      </div>
    </div>
  );
}

function BasketScreen() {
  return (
    <div className="flex flex-col h-full" style={{ background: BG }}>
      <div className="px-4 pt-5 pb-4" style={{ background: TEAL }}>
        <p className="text-white text-lg font-extrabold">My Basket</p>
        <p className="text-white/70 text-[11px] mt-0.5">3 items · updated for this week's prices</p>
      </div>
      <div className="px-4 pt-4">
        <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100 shadow-sm">
          {basketItems.map((item, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3">
              <span className="text-gray-800 text-sm font-medium">{item.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-xs">x{item.qty}</span>
                <ChevronRight size={16} className="text-gray-300" />
              </div>
            </div>
          ))}
          <button className="w-full flex items-center justify-center gap-1.5 py-3 text-sm font-semibold" style={{ color: TEAL }}>
            <Plus size={15} /> Add item
          </button>
        </div>
        <p className="text-gray-500 text-[11px] font-semibold mt-5 mb-2 px-1">CHEAPEST STORE FOR THIS BASKET</p>
        <div className="space-y-2">
          {storeComparison.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-3.5 flex items-center justify-between border shadow-sm" style={s.cheapest ? { borderColor: TEAL, borderWidth: 1.5 } : { borderColor: "#f0f0f0" }}>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center rounded-xl" style={{ width: 38, height: 38, background: s.cheapest ? TEAL : "#f3f4f6" }}>
                  {s.cheapest ? <Check size={17} color="white" /> : <ShoppingBasket size={15} color="#9ca3af" />}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{s.store}</p>
                  <p className="text-gray-400 text-[11px]">{s.branch}</p>
                </div>
              </div>
              <p className="font-extrabold text-[15px]" style={{ color: s.cheapest ? TEAL : "#111827" }}>R{s.total.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SavingsScreen({ goToLeaderboard }) {
  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ background: BG }}>
      <div className="px-4 pt-5 pb-6" style={{ background: TEAL }}>
        <p className="text-white text-lg font-extrabold">Your Savings</p>
        <p className="text-white/70 text-[11px] mt-0.5">vs. average price across stores checked</p>
        <div className="mt-4 text-center">
          <p className="text-white/70 text-[10px] font-semibold tracking-wide">SKARREL'D SO FAR THIS MONTH</p>
          <p className="text-white font-extrabold" style={{ fontSize: 40, letterSpacing: -1 }}>R842<span className="text-xl">.50</span></p>
        </div>
      </div>

      <div className="px-4 -mt-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-full p-2" style={{ background: "#fff0eb" }}><TrendingDown size={15} color={CORAL} /></div>
            <div><p className="text-[10px] text-gray-400">Total saved this year</p><p className="font-extrabold text-gray-900 text-sm">R6,140.75</p></div>
          </div>
          <ChevronRight size={15} className="text-gray-300" />
        </div>
      </div>

      <div className="px-4 mt-4">
        <p className="text-gray-500 text-[11px] font-semibold mb-2 px-1">YOUR BADGES</p>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex justify-between">
          {badges.map((b, i) => {
            const Icon = b.icon;
            return (
              <div key={i} className="flex flex-col items-center gap-1" style={{ opacity: b.earned ? 1 : 0.3 }}>
                <div className="rounded-full flex items-center justify-center" style={{ width: 40, height: 40, background: b.earned ? "#e6f4f2" : "#f3f4f6" }}>
                  <Icon size={18} color={b.earned ? TEAL : "#9ca3af"} />
                </div>
                <span className="text-[9px] font-semibold text-gray-600 text-center w-14">{b.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-4 mt-4">
        <button onClick={goToLeaderboard} className="w-full rounded-2xl p-4 flex items-center justify-between shadow-sm" style={{ background: TEAL_DARK }}>
          <div className="flex items-center gap-2.5">
            <Trophy size={20} color={CORAL} />
            <div className="text-left">
              <p className="text-white font-bold text-sm">You're #3 in Westville</p>
              <p className="text-white/60 text-[10px]">Tap to view full leaderboard</p>
            </div>
          </div>
          <ChevronRight size={16} color="white" />
        </button>
      </div>

      <div className="px-4 mt-4 pb-4">
        <button className="w-full rounded-2xl p-3.5 flex items-center justify-center gap-2 border-2 border-dashed" style={{ borderColor: "#e5e7eb" }}>
          <Coffee size={16} color={CORAL} />
          <span className="text-sm font-semibold" style={{ color: TEAL_DARK }}>Leave a tip for Skarrel</span>
        </button>
      </div>
    </div>
  );
}

function LeaderboardScreen({ goBack }) {
  const [metric, setMetric] = useState("rand");
  const [period, setPeriod] = useState("Monthly");
  return (
    <div className="flex flex-col h-full" style={{ background: BG }}>
      <div className="px-4 pt-5 pb-4" style={{ background: TEAL }}>
        <button onClick={goBack} className="text-white/80 text-xs font-semibold mb-2">← Back</button>
        <p className="text-white text-lg font-extrabold">Leaderboard</p>
        <p className="text-white/70 text-[11px] mt-0.5">Opted in · visible as "Luke"</p>
      </div>
      <div className="px-4 pt-3 flex gap-2">
        {["rand", "achievements"].map((m) => (
          <button key={m} onClick={() => setMetric(m)} className="flex-1 py-2 rounded-full text-xs font-bold" style={metric === m ? { background: TEAL, color: "white" } : { background: "white", color: "#6b7280", border: "1px solid #e5e7eb" }}>
            {m === "rand" ? "Rand Saved" : "Achievements"}
          </button>
        ))}
      </div>
      <div className="px-4 pt-2 flex gap-1.5">
        {["Weekly", "Monthly", "All-time"].map((p) => (
          <button key={p} onClick={() => setPeriod(p)} className="px-2.5 py-1 rounded-full text-[10px] font-semibold" style={period === p ? { background: TEAL_DARK, color: "white" } : { background: "#eee", color: "#888" }}>
            {p}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-4 space-y-2">
        {leaderboardRand.map((u) => (
          <div key={u.rank} className="bg-white rounded-2xl p-3 flex items-center justify-between shadow-sm border" style={u.you ? { borderColor: CORAL, borderWidth: 1.5 } : { borderColor: "#f0f0f0" }}>
            <div className="flex items-center gap-3">
              <span className="font-extrabold text-sm w-5 text-center" style={{ color: u.rank <= 3 ? CORAL : "#9ca3af" }}>{u.rank}</span>
              <div className="rounded-full flex items-center justify-center font-bold text-white text-xs" style={{ width: 30, height: 30, background: TEAL }}>
                {u.name[0]}
              </div>
              <span className="text-sm font-semibold text-gray-800">{u.you ? "You" : u.name}</span>
            </div>
            <span className="font-extrabold text-sm" style={{ color: TEAL }}>R{u.amount.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AccountScreen() {
  const [darkMode, setDarkMode] = useState(false);
  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ background: BG }}>
      <div className="px-4 pt-5 pb-6" style={{ background: TEAL }}>
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-white/20 flex items-center justify-center" style={{ width: 48, height: 48 }}>
            <User size={22} color="white" />
          </div>
          <div>
            <p className="text-white font-bold text-base">Luke</p>
            <p className="text-white/70 text-[11px]">Free plan</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-2.5">
        <button className="w-full bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="rounded-full p-2" style={{ background: "#fff0eb" }}><Zap size={16} color={CORAL} /></div>
            <span className="text-sm font-bold text-gray-900">Compare Free vs Premium</span>
          </div>
          <ChevronRight size={16} className="text-gray-300" />
        </button>

        <button className="w-full bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="rounded-full p-2" style={{ background: "#e6f4f2" }}><Coffee size={16} color={TEAL} /></div>
            <span className="text-sm font-semibold text-gray-800">Leave a tip</span>
          </div>
          <ChevronRight size={16} className="text-gray-300" />
        </button>

        <button className="w-full bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="rounded-full p-2" style={{ background: "#e6f4f2" }}><Trophy size={16} color={TEAL} /></div>
            <span className="text-sm font-semibold text-gray-800">Leaderboard settings</span>
          </div>
          <ChevronRight size={16} className="text-gray-300" />
        </button>

        <div className="w-full bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="rounded-full p-2" style={{ background: "#e6f4f2" }}><Moon size={16} color={TEAL} /></div>
            <span className="text-sm font-semibold text-gray-800">Dark mode</span>
          </div>
          <button onClick={() => setDarkMode(!darkMode)} className="rounded-full transition-colors" style={{ width: 38, height: 22, background: darkMode ? TEAL : "#e5e7eb", position: "relative" }}>
            <div className="rounded-full bg-white shadow transition-all" style={{ width: 18, height: 18, position: "absolute", top: 2, left: darkMode ? 18 : 2 }} />
          </button>
        </div>

        <button className="w-full bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="rounded-full p-2" style={{ background: "#e6f4f2" }}><MessageSquarePlus size={16} color={TEAL} /></div>
            <span className="text-sm font-semibold text-gray-800">Suggest a feature</span>
          </div>
          <ChevronRight size={16} className="text-gray-300" />
        </button>

        <button className="w-full bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="rounded-full p-2" style={{ background: "#e6f4f2" }}><ShieldCheck size={16} color={TEAL} /></div>
            <span className="text-sm font-semibold text-gray-800">Two-factor authentication</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ background: "#e6f4f2", color: TEAL }}>ON</span>
        </button>

        <button className="w-full bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-gray-100">
          <span className="text-sm font-semibold text-gray-800">What's new (changelog)</span>
          <ChevronRight size={16} className="text-gray-300" />
        </button>
      </div>
    </div>
  );
}

export default function SkarrelMockup() {
  const [tab, setTab] = useState("home");
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#e8e8e8" }}>
      <div className="relative overflow-hidden bg-white flex flex-col" style={{ width: 375, height: 780, borderRadius: 44, boxShadow: "0 20px 60px rgba(0,0,0,0.25)", border: "10px solid #1a1a1a" }}>
        <div className="flex-1 overflow-hidden relative">
          {showLeaderboard ? (
            <LeaderboardScreen goBack={() => setShowLeaderboard(false)} />
          ) : (
            <>
              {tab === "home" && <HomeScreen />}
              {tab === "basket" && <BasketScreen />}
              {tab === "savings" && <SavingsScreen goToLeaderboard={() => setShowLeaderboard(true)} />}
              {tab === "account" && <AccountScreen />}
            </>
          )}
        </div>

        {!showLeaderboard && (
          <div className="flex items-center justify-around border-t border-gray-100 bg-white py-2.5 px-2">
            {[
              { id: "home", label: "Deals", icon: Home },
              { id: "basket", label: "Basket", icon: ShoppingBasket },
              { id: "savings", label: "Savings", icon: PiggyBank },
              { id: "account", label: "Account", icon: User },
            ].map((t) => {
              const Icon = t.icon;
              const isActive = tab === t.id;
              return (
                <button key={t.id} onClick={() => setTab(t.id)} className="flex flex-col items-center gap-0.5 px-3 py-1">
                  <Icon size={19} color={isActive ? TEAL : "#b0b0b0"} strokeWidth={isActive ? 2.4 : 2} />
                  <span className="text-[9px] font-semibold" style={{ color: isActive ? TEAL : "#b0b0b0" }}>{t.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
