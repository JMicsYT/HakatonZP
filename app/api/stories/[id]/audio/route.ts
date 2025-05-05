import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const id = params.id
    const { audioUrl } = await req.json()

    if (!audioUrl) {
      return NextResponse.json({ message: "Audio URL is required" }, { status: 400 })
    }

    // Проверяем, существует ли история и имеет ли пользователь доступ к ней
    const story = await prisma.story.findUnique({
      where: { id },
      select: { authorId: true },
    })

    if (!story) {
      return NextResponse.json({ message: "Story not found" }, { status: 404 })
    }

    // Обновляем историю с аудио URL
    const updatedStory = await prisma.story.update({
      where: { id },
      data: {
        audioUrl,
      },
    })

    return NextResponse.json({ success: true, audioUrl })
  } catch (error) {
    console.error("Error saving audio URL:", error)
    return NextResponse.json({ message: "An error occurred while saving audio URL" }, { status: 500 })
  }
}
