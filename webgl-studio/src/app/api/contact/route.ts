import { NextResponse } from 'next/server';

type ContactPayload = {
  name?: string;
  email?: string;
  message?: string;
  eventDate?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  let body: ContactPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Corps de requête invalide.' }, { status: 400 });
  }

  const { name, email, message, eventDate } = body;

  if (!name || name.trim().length < 2) {
    return NextResponse.json({ ok: false, error: 'Merci d’indiquer votre nom.' }, { status: 422 });
  }
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: 'Adresse e-mail invalide.' }, { status: 422 });
  }
  if (!message || message.trim().length < 10) {
    return NextResponse.json({ ok: false, error: 'Dites-nous en un peu plus sur votre projet.' }, { status: 422 });
  }

  // NOTE: no email provider is configured in this prototype. Wire one up by
  // setting RESEND_API_KEY (or any provider's key) as an environment variable
  // and sending the message here — e.g. via the Resend SDK or fetch() to
  // your provider's REST API. Until then, submissions are only logged.
  console.log('[contact] new enquiry', { name, email, eventDate, message });

  return NextResponse.json({ ok: true });
}
