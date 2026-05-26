export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({
      ok: false,
      message: "Méthode non autorisée.",
    });
  }

  const body = request.body || {};

  if (body.website_url) {
    return response.status(200).json({
      ok: true,
      message: "Demande reçue.",
    });
  }

  const requiredFields = ["email", "consentement_confidentialite"];

  const missing = requiredFields.filter((field) => {
    return !body[field] || String(body[field]).trim().length === 0;
  });

  const firstName = String(body.prenom || "").trim();
  const lastName = String(body.nom || "").trim();
  const phone = String(body.telephone || body.phone || "").trim();
  const message = String(body.message || "").trim();
  const fullName = [firstName, lastName].filter(Boolean).join(" ") || lastName;

  if (!fullName) {
    missing.push("nom");
  }

  const emailIsValid =
    typeof body.email === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email);

  if (missing.length > 0 || !emailIsValid) {
    return response.status(400).json({
      ok: false,
      message: "Certains champs obligatoires sont invalides.",
      missing,
    });
  }

  const makeWebhookUrl = process.env.MAKE_CONTACT_WEBHOOK_URL;

  if (!makeWebhookUrl) {
    console.error("[Nova Connexion contact request] MAKE_CONTACT_WEBHOOK_URL is missing.");

    return response.status(500).json({
      ok: false,
      message: "Configuration serveur manquante.",
    });
  }

  const contactSummary = [
    `Prénom: ${firstName || "-"}`,
    `Nom: ${lastName || "-"}`,
    `Téléphone: ${phone || "Non fourni"}`,
    `Courriel: ${body.email || ""}`,
    `Entreprise: ${body.entreprise || ""}`,
  ].join("\n");

  const mainNeedWithContact = [message, contactSummary].filter(Boolean).join("\n\n");

  const payload = {
    source: body.source || "nova_connexion_site_principal",
    form_type: "diagnostic_site_principal",
    prenom: firstName,
    nom: lastName,
    telephone: phone,
    numero_telephone: phone,
    phone_number: phone,
    first_name: firstName,
    last_name: lastName,
    full_name: fullName,
    company_name: body.entreprise || "",
    phone,
    email: body.email || "",
    message: mainNeedWithContact,
    main_need: mainNeedWithContact,
    contact_summary: contactSummary,
    consent: body.consentement_confidentialite || "",
    language: body.language || "fr",
    page_url: body.page_url || "",
    submitted_at: body.submitted_at || new Date().toISOString(),
  };

  const webhookResponse = await fetch(makeWebhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!webhookResponse.ok) {
    const details = await webhookResponse.text().catch(() => "");

    console.error("[Nova Connexion contact request] Make webhook failed.", {
      status: webhookResponse.status,
      details,
    });

    return response.status(502).json({
      ok: false,
      message: "La demande n'a pas pu être envoyée.",
    });
  }

  return response.status(200).json({
    ok: true,
    message: "Merci. Votre demande a bien été envoyée.",
  });
}
