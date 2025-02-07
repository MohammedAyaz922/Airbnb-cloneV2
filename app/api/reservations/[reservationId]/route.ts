import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

interface IParams {
    reservationId: string;
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<IParams> } 
) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) return NextResponse.error();

        const { reservationId } = await params; 

        if (!reservationId || typeof reservationId !== "string") {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }

        const reservation = await prisma.reservation.deleteMany({
            where: {
                id: reservationId,
                OR: [
                    { userId: currentUser.id },
                    { listing: { userId: currentUser.id } }
                ]
            }
        });

        return NextResponse.json(reservation);
    } catch (error) {
        console.error("❌ Error deleting reservation:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
