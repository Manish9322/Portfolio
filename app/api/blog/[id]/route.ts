import { NextResponse } from "next/server"
import { blogs } from "../route"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const blog = blogs.find((b) => b._id === params.id)
  
  if (!blog) {
    return new NextResponse("Blog not found", { status: 404 })
  }
  
  return NextResponse.json(blog)
}
