import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const id = params.id

    const story = await prisma.story.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        images: true,
      },
    })

    if (!story) {
      return NextResponse.json({ message: "Story not found" }, { status: 404 })
    }

    return NextResponse.json(story)
  } catch (error) {
    console.error("Error fetching story for admin:", error)
    return NextResponse.json({ message: "An error occurred while fetching the story" }, { status: 500 })
  }
}
