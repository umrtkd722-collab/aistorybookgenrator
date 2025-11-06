// app/api/sync/plans/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Plan } from "@/lib/modals/Plant";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { plans } = body;

    if (!plans || !Array.isArray(plans) || plans.length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid payload: 'plans' array is required." },
        { status: 400 }
      );
    }


    let inserted = 0;

    for (const planData of plans) {
      const { name } = planData;

      if (!name) continue;

      // Agar plan already exist → skip
      const exists = await Plan.findOne({ name });
      if (exists) continue;

      // Insert new
      await Plan.create(planData);
      inserted++;
    }

    return NextResponse.json({
      success: true,
      message: "Plans inserted successfully!",
      inserted,
    });

  } catch (error: any) {
    console.error("Plan insert error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Insert failed" },
      { status: 500 }
    );
  }
}