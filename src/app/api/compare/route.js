function determineStoreType(storeName) {
  const name = (storeName || "").toLowerCase();
  if (
    name.includes("whole foods") ||
    name.includes("sprouts") ||
    name.includes("fresh market") ||
    name.includes("bristol farms") ||
    name.includes("wegmans")
  )
    return "premium";
  if (
    name.includes("walmart") ||
    name.includes("aldi") ||
    name.includes("lidl") ||
    name.includes("food 4 less") ||
    name.includes("save a lot") ||
    name.includes("grocery outlet") ||
    name.includes("dollar")
  )
    return "budget";
  if (
    name.includes("costco") ||
    name.includes("sam's club") ||
    name.includes("bj's")
  )
    return "warehouse";
  return "mid-range";
}

const BASE_URL =
  process.env.NEXT_PUBLIC_CREATE_APP_URL || "http://localhost:3000";

function buildSearchUrl(website, itemName) {
  if (!website) return null;
  const domain = website.toLowerCase();
  const encoded = encodeURIComponent(itemName);
  if (domain.includes("walmart.com"))
    return `https://www.walmart.com/search?q=${encoded}`;
  if (domain.includes("kroger.com"))
    return `https://www.kroger.com/search?query=${encoded}&searchType=natural`;
  if (domain.includes("target.com"))
    return `https://www.target.com/s?searchTerm=${encoded}`;
  if (domain.includes("safeway.com"))
    return `https://www.safeway.com/shop/search-results.html?q=${encoded}`;
  if (domain.includes("wholefoodsmarket.com"))
    return `https://www.wholefoodsmarket.com/search?text=${encoded}`;
  if (domain.includes("costco.com"))
    return `https://www.costco.com/s?keyword=${encoded}`;
  if (domain.includes("traderjoes.com"))
    return `https://www.traderjoes.com/home/search?q=${encoded}`;
  if (domain.includes("publix.com"))
    return `https://www.publix.com/pd/search?q=${encoded}`;
  if (domain.includes("heb.com"))
    return `https://www.heb.com/search/?q=${encoded}`;
  if (domain.includes("meijer.com"))
    return `https://www.meijer.com/shopping/search.html?search=${encoded}`;
  if (domain.includes("stop") && domain.includes("shop"))
    return `https://stopandshop.com/pages/search-results?q=${encoded}`;
  if (domain.includes("wegmans.com"))
    return `https://www.wegmans.com/search/#w=${encoded}`;
  // Generic fallback
  const base = website.replace(/\/$/, "");
  return `${base}/search?q=${encoded}`;
}

async function tryScrapePrices(website, items) {
  if (!website || items.length === 0) return null;
  const firstItem = items[0];
  const searchUrl = buildSearchUrl(website, firstItem.name);
  if (!searchUrl) return null;

  try {
    const res = await fetch(`${BASE_URL}/integrations/web-scraping/post`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: searchUrl, getText: true }),
    });
    if (!res.ok) return null;
    const text = await res.text();
    if (!text || text.length < 100) return null;
    return text.substring(0, 4000);
  } catch {
    return null;
  }
}

async function estimatePricesWithAI(store, items, scrapedContext) {
  const storeType = determineStoreType(store.name);
  const contextNote = scrapedContext
    ? `Here is partial text scraped from the store's website search page:\n${scrapedContext}\n\nUse any prices you can extract from this text. For items not found in the scraped text, estimate based on the store type.`
    : `No website data was available. Estimate realistic prices based on the store type.`;

  const prompt = `You are a grocery price analyst for US supermarkets.

Store: "${store.name}" — this is a ${storeType} grocery store.
${contextNote}

Provide realistic per-unit prices in USD for each item below. Prices should reflect the store type:
- Budget stores: 10-25% below national average
- Mid-range: national average
- Premium: 15-40% above national average
- Warehouse: bulk pricing, may differ by quantity

Items to price:
${items.map((i) => `- id:${i.id} | ${i.name} | unit: ${i.unit || "each"}`).join("\n")}`;

  const res = await fetch(
    `${BASE_URL}/integrations/chat-gpt/conversationgpt4`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: prompt }],
        stream: false,
        json_schema: {
          name: "store_prices",
          schema: {
            type: "object",
            properties: {
              prices: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    price: { type: "number" },
                    scraped: { type: "boolean" },
                  },
                  required: ["id", "price", "scraped"],
                  additionalProperties: false,
                },
              },
              affordability_tier: { type: "string" },
              store_note: { type: "string" },
            },
            required: ["prices", "affordability_tier", "store_note"],
            additionalProperties: false,
          },
          strict: true,
        },
      }),
    },
  );

  if (!res.ok) throw new Error("AI pricing failed");
  const data = await res.json();
  return JSON.parse(data.choices[0].message.content);
}

async function generateAlternatives(items, storeName) {
  const res = await fetch(
    `${BASE_URL}/integrations/chat-gpt/conversationgpt4`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: `For the grocery list below, suggest 1 cheaper alternative for each item (e.g. store brand, smaller size, or similar product). Keep it realistic.

Items: ${items.map((i) => i.name).join(", ")}
Store: ${storeName}

Return a JSON array of alternatives.`,
          },
        ],
        stream: false,
        json_schema: {
          name: "alternatives",
          schema: {
            type: "object",
            properties: {
              alternatives: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    original: { type: "string" },
                    suggested: { type: "string" },
                    savings: { type: "string" },
                    reason: { type: "string" },
                  },
                  required: ["original", "suggested", "savings", "reason"],
                  additionalProperties: false,
                },
              },
            },
            required: ["alternatives"],
            additionalProperties: false,
          },
          strict: true,
        },
      }),
    },
  );
  if (!res.ok) return [];
  const data = await res.json();
  const parsed = JSON.parse(data.choices[0].message.content);
  return parsed.alternatives || [];
}

async function findNearbyStores(location) {
  const isZip = /^\d{5}(-\d{4})?$/.test(location.trim());

  // Build a set of queries to try, broadest to most specific
  const queries = isZip
    ? [
        `grocery store near ${location} USA`,
        `supermarket near ${location} USA`,
        `food market near ${location} USA`,
      ]
    : [
        `grocery store in ${location} USA`,
        `supermarket in ${location} USA`,
        `food market near ${location} USA`,
      ];

  for (const query of queries) {
    const encoded = encodeURIComponent(query);
    const res = await fetch(
      `${BASE_URL}/integrations/local-business-data/search?query=${encoded}&limit=20&region=us&business_status=OPEN`,
    );
    if (!res.ok) continue;
    const data = await res.json();
    const candidates = (data.data || []).filter((s) => s.name);
    if (candidates.length === 0) continue;

    // Try to prefer stores that look like grocery stores
    const groceryKeywords = [
      "grocery",
      "supermarket",
      "market",
      "food",
      "fresh",
      "mart",
      "store",
      "aldi",
      "lidl",
      "walmart",
      "kroger",
      "safeway",
      "publix",
      "wegmans",
      "trader",
      "whole foods",
      "stop & shop",
      "giant",
      "acme",
      "weis",
      "price chopper",
      "shoprite",
      "harris teeter",
    ];
    const preferred = candidates.filter((s) => {
      const nameLower = (s.name || "").toLowerCase();
      const isGrocerySubtype = s.subtypes?.some((t) =>
        [
          "Grocery store",
          "Supermarket",
          "Warehouse store",
          "Health food store",
          "Organic food store",
          "Discount store",
        ].includes(t),
      );
      const hasGroceryName = groceryKeywords.some((kw) =>
        nameLower.includes(kw),
      );
      return isGrocerySubtype || hasGroceryName || s.type === "Grocery store";
    });

    // Use preferred if any found, otherwise fall back to all candidates (for small towns)
    const result = preferred.length > 0 ? preferred : candidates;
    return result.slice(0, 5);
  }

  return [];
}

export async function POST(request) {
  try {
    const { items, location, zipCode, radius } = await request.json();
    const searchLocation = location || zipCode || "";

    if (!items || items.length === 0) {
      return Response.json({ error: "No items provided" }, { status: 400 });
    }
    if (!searchLocation) {
      return Response.json(
        { error: "Please provide a city or zip code" },
        { status: 400 },
      );
    }

    // 1. Find real grocery stores near the location
    const stores = await findNearbyStores(searchLocation);

    if (stores.length === 0) {
      return Response.json(
        {
          error: `No grocery stores found near "${searchLocation}". Try a nearby city name (e.g. "Allentown, PA") or a different zip code.`,
        },
        { status: 404 },
      );
    }

    // 2. For each store, scrape a search page and estimate prices (run in parallel)
    const storeResults = await Promise.all(
      stores.map(async (store) => {
        const scrapedText = await tryScrapePrices(store.website, items);

        let priceData;
        try {
          priceData = await estimatePricesWithAI(store, items, scrapedText);
        } catch {
          priceData = {
            prices: items.map((i) => ({
              id: String(i.id),
              price: i.typical_price || 3.99,
              scraped: false,
            })),
            affordability_tier: determineStoreType(store.name),
            store_note: "Price estimation unavailable",
          };
        }

        const total = priceData.prices.reduce((sum, p) => {
          const item = items.find((i) => String(i.id) === String(p.id));
          return sum + p.price * (item?.quantity || 1);
        }, 0);

        const tierScores = {
          budget: 90,
          "mid-range": 65,
          premium: 35,
          warehouse: 75,
        };
        const baseScore = tierScores[priceData.affordability_tier] || 60;

        return {
          id: store.business_id || store.place_id,
          name: store.name,
          address: store.full_address || store.address || "",
          website: store.website || null,
          rating: store.rating || null,
          affordability_score: baseScore,
          affordability_tier: priceData.affordability_tier,
          store_note: priceData.store_note,
          total: total.toFixed(2),
          itemsFound: priceData.prices.length,
          itemsRequested: items.length,
          breakdown: priceData.prices.map((p) => {
            const item = items.find((i) => String(i.id) === String(p.id));
            return {
              ...p,
              item_name: item?.name || "Unknown",
              unit: item?.unit || "each",
              quantity: item?.quantity || 1,
              line_total: (p.price * (item?.quantity || 1)).toFixed(2),
            };
          }),
          alternatives: [],
          scraped: !!scrapedText,
        };
      }),
    );

    storeResults.sort((a, b) => parseFloat(a.total) - parseFloat(b.total));

    const best = storeResults[0];
    try {
      best.alternatives = await generateAlternatives(items, best.name);
    } catch {
      best.alternatives = [];
    }

    return Response.json({
      bestOption: best,
      allStores: storeResults,
      location: searchLocation,
      radius,
      storesFound: storeResults.length,
    });
  } catch (error) {
    console.error("compare error:", error);
    return Response.json(
      { error: "Comparison failed: " + error.message },
      { status: 500 },
    );
  }
}
