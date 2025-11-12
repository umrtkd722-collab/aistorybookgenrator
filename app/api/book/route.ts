// app/api/books/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { BookPlan } from "@/lib/modals/Book";
import { Order } from "@/lib/modals/Order";
import { Story } from "@/lib/modals/Story";

interface BookResponse {
  _id: string;
  userId: string;
  planId: string;
  title: string;
  description?: string;
  type: "relationship" | "gift" | "other";
  storyIds: Array<{
    _id: string;
    title: string;
    coverUrl?: string;
  }>;
  coverUrl?: string;
  pdfFileId?: string;
  createdAt: string;
  status: "draft" | "ordered";
  orderId?: string;
  orderStatus?: string;
}

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Base URL
    const baseUrl = "http://localhost:3000".replace(/\/+$/, "");

    // Fetch BookPlans with populated stories
    const bookPlans = await BookPlan.find({ userId: user._id })
      .populate({
        path: "storyIds",
        select: "title coverUrl", // sirf chahiye
      })
      .sort({ createdAt: -1 })
      .lean();

    // Fetch Orders
    const orders = await Order.find({ userId: user._id })
      .select("bookPlanId status")
      .lean();

    // Map to clean response
    const books: BookResponse[] = bookPlans.map((bp: any) => {
      const order = orders.find(
        (o) => o.bookPlanId.toString() === bp._id.toString()
      );

      // Cover URL: Story se ya fallback
      const storyCover = bp.storyIds[0]?.coverUrl;
      const coverUrl = storyCover
        ? storyCover.startsWith("http")
          ? storyCover
          : `${baseUrl}${storyCover.startsWith("/") ? "" : "/"}${storyCover}`
        : undefined;

      const base = {
        _id: bp._id.toString(),
        userId: bp.userId.toString(),
        planId: bp.planId.toString(),
        title: bp.title,
        description: bp.description || undefined,
        type: bp.type,
        storyIds: bp.storyIds.map((s: any) => ({
          _id: s._id.toString(),
          title: s.title,
          coverUrl: s.coverUrl
            ? s.coverUrl.startsWith("http")
              ? s.coverUrl
              : `${baseUrl}${s.coverUrl.startsWith("/") ? "" : "/"}${s.coverUrl}`
            : undefined,
        })),
        coverUrl,
        pdfFileId: bp.pdfFileId?.toString() || undefined,
        createdAt: new Date(bp.createdAt).toISOString(),
      };

      return order
        ? {
            ...base,
            status: "ordered" as const,
            orderId: order._id.toString(),
            orderStatus: order.status || "pending",
          }
        : {
            ...base,
            status: "draft" as const,
          };
    });

    return NextResponse.json({ books }, { status: 200 });

  } catch (error: any) {
    console.error("Books fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 }
    );
  }
}