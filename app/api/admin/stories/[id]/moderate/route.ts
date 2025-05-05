import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const id = params.id
    const { approved, moderationComment } = await req.json()

    // Check if story exists
    const story = await prisma.story.findUnique({
      where: { id },
      select: { id: true },
    })

    if (!story) {
      return NextResponse.json({ message: "Story not found" }, { status: 404 })
    }

    // Update story with moderation decision
    const updatedStory = await prisma.story.update({
      where: { id },
      data: {
        status: approved ? "PUBLISHED" : "REJECTED",
        published: approved,
        moderatorId: session.user.id,
        moderationComment,
        moderatedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      status: updatedStory.status,
    })
  } catch (error) {
    console.error("Error moderating story:", error)
    return NextResponse.json({ message: "An error occurred while moderating the story" }, { status: 500 })
  }
}
