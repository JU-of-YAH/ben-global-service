import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const TO_EMAIL = "jtape3005@gmail.com";

serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response("Method Not Allowed", {
        status: 405,
      });
    }

    const lead = await req.json();

    const typeLabels: Record<string, string> = {
      contact: "Demande de contact",
      test_drive: "Demande d'essai",
      sell: "Vente de véhicule",
    };

    const typeLabel =
      typeLabels[lead.type] || "Nouvelle demande";

    const subject = `BEN GLOBAL SERVICE — ${typeLabel}`;

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Nouvelle demande — BEN GLOBAL SERVICE</h2>

        <p><strong>Type :</strong> ${typeLabel}</p>

        <hr />

        <h3>Informations du client</h3>

        <p>
          <strong>Nom :</strong> ${lead.name || "Non renseigné"}<br />
          <strong>Téléphone :</strong> ${lead.phone || "Non renseigné"}<br />
          <strong>Email :</strong> ${lead.email || "Non renseigné"}
        </p>

        ${
          lead.car_slug
            ? `
              <h3>Véhicule concerné</h3>
              <p>${lead.car_slug}</p>
            `
            : ""
        }

        ${
          lead.message
            ? `
              <h3>Message</h3>
              <p>${String(lead.message).replace(/\n/g, "<br />")}</p>
            `
            : ""
        }

        <hr />

        <p>
          Cette demande a également été enregistrée
          dans le tableau de bord administrateur.
        </p>
      </div>
    `;

    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY est manquante.");
    }

    const resendResponse = await fetch(
      "https://api.resend.com/emails",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "BEN GLOBAL SERVICE <onboarding@resend.dev>",
          to: [TO_EMAIL],
          subject,
          html,
        }),
      },
    );

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error("Resend error:", resendData);

      return new Response(
        JSON.stringify({
          error: "Erreur lors de l'envoi de l'e-mail.",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        resend: resendData,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error(error);

    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : "Erreur inconnue.",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
});