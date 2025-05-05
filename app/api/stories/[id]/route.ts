import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

// Get a single story
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
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

    // If story is not published, check if the requester is the author or admin
    if (story.status !== "PUBLISHED") {
      const session = await getServerSession(authOptions)
      if (!session || (session.user.id !== story.authorId && session.user.role !== "ADMIN")) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
      }
    }

    return NextResponse.json(story)
  } catch (error) {
    console.error("Error fetching story:", error)
    return NextResponse.json({ message: "An error occurred while fetching the story" }, { status: 500 })
  }
}

// Update a story
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const id = params.id
    const {
      title,
      fullName,
      birthDate,
      deathDate,
      rank,
      militaryUnit,
      awards,
      content,
      videoUrl,
      published,
      imageUrls = [],
    } = await req.json()

    // Check if story exists and user is the author
    const existingStory = await prisma.story.findUnique({
      where: { id },
      select: { authorId: true, status: true },
    })

    if (!existingStory) {
      return NextResponse.json({ message: "Story not found" }, { status: 404 })
    }

    if (existingStory.authorId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Determine new status
    let status = existingStory.status
    if (published && existingStory.status === "DRAFT") {
      status = "PENDING_REVIEW"
    }

    // Update story
    const updatedStory = await prisma.story.update({
      where: { id },
      data: {
        title,
        fullName,
        birthDate: birthDate ? new Date(birthDate) : null,
        deathDate: deathDate ? new Date(deathDate) : null,
        rank,
        militaryUnit,
        awards,
        content,
        videoUrl,
        status,
        // Only admin can directly set published to true
        published: session.user.role === "ADMIN" ? published : existingStory.status === "PUBLISHED",
      },
      include: {
        images: true,
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    // Handle image updates if provided
    if (imageUrls.length > 0) {
      // Delete existing images
      await prisma.image.deleteMany({
        where: { storyId: id },
      })

      // Create new images
      await prisma.image.createMany({
        data: imageUrls.map((url: string) => ({
          url,
          storyId: id,
        })),
      })

      // Fetch updated story with new images
      const storyWithImages = await prisma.story.findUnique({
        where: { id },
        include: {
          images: true,
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      })

      return NextResponse.json(storyWithImages)
    }

    return NextResponse.json(updatedStory)
  } catch (error) {
    console.error("Error updating story:", error)
    return NextResponse.json({ message: "An error occurred while updating the story" }, { status: 500 })
  }
}

// Delete a story
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const id = params.id

    // Check if story exists and user is the author or admin
    const existingStory = await prisma.story.findUnique({
      where: { id },
      select: { authorId: true },
    })

    if (!existingStory) {
      return NextResponse.json({ message: "Story not found" }, { status: 404 })
    }

    if (existingStory.authorId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Delete story (will cascade delete images)
    await prisma.story.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Story deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting story:", error)
    return NextResponse.json({ message: "An error occurred while deleting the story" }, { status: 500 })
  }
}
