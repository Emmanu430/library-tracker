    import { NextResponse } from "next/server";
    import crypto from "crypto";
    import { prisma } from "@/lib/prisma";
    import { Resend } from "resend";

    const resend = new Resend(process.env.RESEND_API_KEY);

    export async function POST(request: Request) {
    const { email } = await request.json();

    const user = await prisma.user.findUnique({ where: { email } });

    // Always return the same response, whether or not the user exists —
    // this is the security requirement from the spec.
    if (user) {
        const token = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

        await prisma.passwordResetToken.create({
        data: { token, userId: user.id, expiresAt },
        });

        const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

        await resend.emails.send({
        from: "Athenaeum <onboarding@resend.dev>",
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