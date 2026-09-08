    import { NextResponse } from "next/server";
    import crypto from "crypto";
    import nodemailer from "nodemailer";
    import { prisma } from "@/lib/prisma";

    const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
    });
    // @ts-ignore
    transporter.options.family = 4;

    export async function POST(request: Request) {
    const { email } = await request.json();

    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
        const token = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

        await prisma.passwordResetToken.create({
        data: { token, userId: user.id, expiresAt },
        });

        const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

        await transporter.sendMail({
        from: `"Athenaeum" <${process.env.SMTP_USER}>`,
        to: user.email,
        subject: "Reset your password",
        html: `<p>Click below to reset your password. This link expires in 1 hour.</p>
                <p><a href="${resetUrl}">${resetUrl}</a></p>`,
        });
    }

    return NextResponse.json({
        message: "If that email exists, a reset link was sent.",
    });
}