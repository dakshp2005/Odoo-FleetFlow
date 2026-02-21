import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params

  const { error } = await supabaseAdmin
    .from("vehicles")
    .delete()
    .eq("id", id)

  if (error) {
    const isFK = error.code === "23503"
    return NextResponse.json(
      { message: isFK ? "Vehicle has linked trips or maintenance records. Retire it instead." : error.message, code: error.code },
      { status: isFK ? 409 : 500 }
    )
  }

  return NextResponse.json({ success: true })
}
