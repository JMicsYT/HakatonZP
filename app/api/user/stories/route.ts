import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

// Get all stories for the current user
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    // Get user stories with pagination
    const stories = await prisma.story.findMany({
      where: {
        authorId: session.user.id,
      },
      include: {
        images: {
          take: 1, // Get only the first image for preview
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    })

    // Get total count for pagination
    const total = await prisma.story.count({
      where: {
        authorId: session.user.id,
      },
    })

    return NextResponse.json({
      stories,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching user stories:", error)
    return NextResponse.json({ message: "An error occurred while fetching stories" }, { status: 500 })
  }
}
