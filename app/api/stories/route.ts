import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

// Get all stories (public)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get("q") || ""
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    // Build the where clause for search
    const where = query
      ? {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { fullName: { contains: query, mode: "insensitive" } },
            { content: { contains: query, mode: "insensitive" } },
            { rank: { contains: query, mode: "insensitive" } },
            { militaryUnit: { contains: query, mode: "insensitive" } },
            { awards: { contains: query, mode: "insensitive" } },
          ],
          status: "PUBLISHED",
        }
      : { status: "PUBLISHED" }

    // Get stories with pagination
    const stories = await prisma.story.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
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
    const total = await prisma.story.count({ where })

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
    console.error("Error fetching stories:", error)
    return NextResponse.json({ message: "An error occurred while fetching stories" }, { status: 500 })
  }
}

// Create a new story (authenticated)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

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
      published = false,
      imageUrls = [],
    } = await req.json()

    // Validate required fields
    if (!title || !fullName || !content) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Determine status based on published flag
    const status = published ? "PENDING_REVIEW" : "DRAFT"

    // Create story with images
    const story = await prisma.story.create({
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
        published: false, // Always false until approved by admin
        status,
        authorId: session.user.id,
        images: {
          create: imageUrls.map((url: string) => ({
            url,
          })),
        },
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

    return NextResponse.json(story, { status: 201 })
  } catch (error) {
    console.error("Error creating story:", error)
    return NextResponse.json({ message: "An error occurred while creating the story" }, { status: 500 })
  }
}
