import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

interface IParams {
    listingId: string;
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<IParams> }
) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) return NextResponse.error();

        const { listingId } = await params; 

        if (!listingId || typeof listingId !== "string") {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }

        const listing = await prisma.listing.deleteMany({
            where: {
                id: listingId,
                userId: currentUser.id,
            }
        });

        return NextResponse.json(listing);
    } catch (error) {
        console.error("❌ Error deleting listing:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
