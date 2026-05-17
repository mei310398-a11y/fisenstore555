import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET() {

  try {

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'mei310398@mail.com',
      subject: 'FISENSTORE555',
      html: '<h1>Produk berhasil dikirim</h1>',
    })

    return Response.json({
      success: true
    })

  } catch (error) {

    return Response.json({
      success: false,
      error
    })

  }
}