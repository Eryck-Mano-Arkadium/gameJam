import { NextResponse } from "next/server";

export async function GET() {
  // Minimal: return server time in ms
  return NextResponse.json({ now: Date.now() });
}
