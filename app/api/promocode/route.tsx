import { NextResponse } from "next/server";
import PromoCode from "@/models/promoCode";
import connectToDB from "@/config/database";


/**
 * GET: Check if a promo code exists and return discount
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ message: "Code is required" }, { status: 400 });
  }

  try {
    await connectToDB();
    const promo = await PromoCode.findOne({ code });

    if (!promo) {
      return NextResponse.json({ message: "Invalid promo code" }, { status: 404 });
    }

    if (!promo.isActive || (promo.expiresAt && new Date(promo.expiresAt) < new Date())) {
      return NextResponse.json({ message: "Promo code expired or inactive" }, { status: 400 });
    }

    return NextResponse.json({ message: "Code valid", discount: promo.discount }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error", error }, { status: 500 });
  }
}

/**
 * POST: Add a new promo code
 */
export async function POST(req: Request) {
  try {
    await connectToDB();
    const { code, discount, expiresAt } = await req.json();

    if (!code || discount == null) {
      return NextResponse.json({ message: "Code and discount are required" }, { status: 400 });
    }

    const existingPromo = await PromoCode.findOne({ code });
    if (existingPromo) {
      return NextResponse.json({ message: "Promo code already exists" }, { status: 400 });
    }

    const newPromo = await PromoCode.create({
      code,
      discount,
      isActive: true,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    });

    return NextResponse.json({ message: "Promo code added", promo: newPromo }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error", error }, { status: 500 });
  }
}
