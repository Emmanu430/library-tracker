    import { NextResponse } from "next/server";
    import bcrypt from "bcryptjs";
    import { prisma } from "@/lib/prisma";

    export async function POST(request: Request) {
    const { token, password } = await request.json();

    const resetToken = await prisma.passwordResetToken.findUnique({
        where: { token },
    });

    if (!resetToken) {
        return NextResponse.json({ message: "Invalid or expired link." }, { status: 400 });
    }

    if (resetToken.expiresAt < new Date()) {
        await prisma.passwordResetToken.delete({ where: { id: resetToken.id } });
        return NextResponse.json({ message: "This link has expired." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: hashedPassword },
    });

    await prisma.passwordResetToken.delete({ where: { id: resetToken.id } });

    return NextResponse.json({ message: "Password updated." }, { status: 200 });
}