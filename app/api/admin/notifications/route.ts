import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { initDb, getUnreadAdminNotifications, markNotificationAsRead } from "@/lib/db";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        const user = session?.user as any;

        if (!session || !user || user.role !== 'admin') {
            return NextResponse.json({ message: "No autorizado" }, { status: 401 });
        }

        await initDb();
        const notifications = await getUnreadAdminNotifications();

        return NextResponse.json(notifications);
    } catch (error: any) {
        console.error("Error fetching notifications:", error);
        return NextResponse.json({ message: "Error al obtener notificaciones" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const user = session?.user as any;

        if (!session || !user || user.role !== 'admin') {
            return NextResponse.json({ message: "No autorizado" }, { status: 401 });
        }

        const { id } = await req.json();
        if (!id) {
            return NextResponse.json({ message: "ID de notificación requerido" }, { status: 400 });
        }

        await initDb();
        await markNotificationAsRead(id);

        return NextResponse.json({ message: "Notificación marcada como leída" });
    } catch (error: any) {
        console.error("Error marking notification as read:", error);
        return NextResponse.json({ message: "Error al actualizar notificación" }, { status: 500 });
    }
}
