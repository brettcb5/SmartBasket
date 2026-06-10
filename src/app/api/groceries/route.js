import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const groceries = await sql`SELECT * FROM groceries ORDER BY name ASC`;
    return Response.json(groceries);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to fetch groceries" },
      { status: 500 },
    );
  }
}
