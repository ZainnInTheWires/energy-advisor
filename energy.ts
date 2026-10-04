export interface Appliance { id: number; name: string; watts: number; hours: number; qty: number }
export interface Result { dailyKwh: number; monthlyKwh: number; monthlyCost: number; rows: { name: string; kwh: number; share: number }[]; tips: string[] }

export const PRESETS: Omit<Appliance, "id">[] = [
  { name: "LED Bulb", watts: 10, hours: 6, qty: 4 },
  { name: "Ceiling Fan", watts: 75, hours: 12, qty: 2 },
  { name: "Air Conditioner", watts: 1500, hours: 8, qty: 1 },
  { name: "Refrigerator", watts: 150, hours: 24, qty: 1 },
  { name: "Laptop", watts: 60, hours: 6, qty: 1 },
  { name: "Water Heater", watts: 2000, hours: 1, qty: 1 },
];

export function calculate(items: Appliance[], tariff: number, days: number): Result {
  const rows = items.map((a) => ({ name: a.name || "Unnamed", kwh: (a.watts * a.hours * a.qty) / 1000 }));
  const dailyKwh = rows.reduce((s, r) => s + r.kwh, 0);
  const monthlyKwh = dailyKwh * days;
  const monthlyCost = monthlyKwh * tariff;
  const sorted = rows
    .map((r) => ({ ...r, share: dailyKwh ? (r.kwh / dailyKwh) * 100 : 0 }))
    .sort((a, b) => b.kwh - a.kwh);
  return { dailyKwh, monthlyKwh, monthlyCost, rows: sorted, tips: advise(items, sorted, monthlyCost) };
}

// Built-in demo advisor. To use a real AI later, send `items` to your API here.
function advise(items: Appliance[], rows: Result["rows"], cost: number): string[] {
  const tips: string[] = [];
  if (!rows.length || rows[0].kwh === 0) return ["Add appliances with power and hours to get advice."];
  const top = rows[0];
  tips.push(`${top.name} uses ${top.share.toFixed(0)}% of your energy. Reducing its use gives the biggest saving.`);
  if (items.some((a) => /(ac|air cond|heater|geyser)/i.test(a.name)))
    tips.push("Set the AC to 24-26 °C and use a timer. Each degree lower adds roughly 6% to its consumption.");
  if (items.some((a) => /(bulb|light|tube)/i.test(a.name) && a.watts > 20))
    tips.push("Replace high-watt bulbs and tubes with LED. LEDs use about 80% less power for the same light.");
  if (items.some((a) => a.hours >= 10 && !/(fridge|refrigerator)/i.test(a.name)))
    tips.push("Some appliances run 10+ hours a day. Switch them off when the room is empty.");
  tips.push("Unplug chargers and devices on standby. They can waste 5-10% of a bill.");
  tips.push(`A 10% cut in use would save about ${(cost * 0.1).toFixed(0)} per month.`);
  return tips;
}
