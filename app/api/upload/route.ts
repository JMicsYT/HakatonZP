import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { v2 as cloudinary } from "cloudinary"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 })
    }

    // Check file type
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: "Invalid file type. Only JPEG, PNG, and WebP images are allowed." },
        { status: 400 },
      )
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ message: "File size exceeds the limit of 5MB" }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary
    const dataURI = `data:${file.type};base64,${buffer.toString("base64")}`

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        dataURI,
        {
          folder: "pomnim",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error)
          } else {
            resolve(result)
          }
        },
      )
    })

    return NextResponse.json({
      url: (result as any).secure_url,
      public_id: (result as any).public_id,
    })
  } catch (error) {
    console.error("Error uploading image:", error)
    return NextResponse.json({ message: "An error occurred while uploading the image" }, { status: 500 })
  }
}
