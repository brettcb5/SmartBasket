const BASE_URL =
  process.env.NEXT_PUBLIC_CREATE_APP_URL || "http://localhost:3000";

export async function POST(request) {
  try {
    const { query } = await request.json();
    if (!query || query.trim().length < 2) {
      return Response.json([]);
    }

    const res = await fetch(
      `${BASE_URL}/integrations/chat-gpt/conversationgpt4`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "You are a grocery shopping assistant. When given a search query, you return a JSON array of relevant grocery items. Always respond with ONLY valid JSON — no markdown, no explanation, no code fences.",
            },
            {
              role: "user",
              content: `Search query: "${query}"

Return a JSON array of up to 8 grocery items that match this query. Include brand-name and generic/store-brand options. Each item must have:
- name: descriptive product name (string)
- category: one of "Produce", "Dairy", "Meat & Seafood", "Bakery", "Beverages", "Snacks", "Pantry", "Frozen", "Deli", "Personal Care", "Household"
- unit: how it's typically sold, e.g. "each", "lb", "oz", "gallon", "dozen", "pack"
- typical_price: estimated US retail price as a number (e.g. 3.99)
- brand: brand name or "Store Brand" if generic

Example for "milk": [{"name":"Whole Milk","category":"Dairy","unit":"gallon","typical_price":4.29,"brand":"Horizon Organic"},{"name":"2% Reduced Fat Milk","category":"Dairy","unit":"gallon","typical_price":3.49,"brand":"Store Brand"}]`,
            },
          ],
          stream: false,
          json_schema: {
            name: "grocery_items",
            schema: {
              type: "object",
              properties: {
                items: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      category: { type: "string" },
                      unit: { type: "string" },
                      typical_price: { type: "number" },
                      brand: { type: "string" },
                    },
                    required: [
                      "name",
                      "category",
                      "unit",
                      "typical_price",
                      "brand",
                    ],
                    additionalProperties: false,
                  },
                },
              },
              required: ["items"],
              additionalProperties: false,
            },
            strict: true,
          },
        }),
      },
    );

    if (!res.ok) throw new Error("AI search failed");
    const data = await res.json();
    const parsed = JSON.parse(data.choices[0].message.content);
    return Response.json(parsed.items || []);
  } catch (error) {
    console.error("search-items error:", error);
    return Response.json({ error: "Search failed" }, { status: 500 });
  }
}
