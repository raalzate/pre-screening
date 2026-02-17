import nodemailer from 'nodemailer';
import 'dotenv/config';

// Configuración del Transporter (Igual que tu original)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Eliminamos el verify del top-level para evitar efectos secundarios durante el build
// transporter.verify(function (error) { ... });

/**
 * PLANTILLA BASE ESTILO SOFKA
 * Encapsula el diseño para reutilizarlo en todos los correos.
 */
const getSofkaTemplate = (title: string, bodyContent: string, ctaUrl: string, ctaText: string) => {
  // Colores aproximados de marca: Azul Oscuro (#0F172A), Cian Sofka (#00C8FF)
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap');
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f7f6; font-family: 'Montserrat', sans-serif, Arial;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td align="center" style="padding: 40px 0;">
            
            <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
              
              <tr>
                <td style="background-color: #1e293b; padding: 30px 40px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">SOFKA <span style="color: #38bdf8;">TEST</span></h1>
                </td>
              </tr>

              <tr>
                <td style="padding: 40px;">
                  <h2 style="color: #1e293b; margin-top: 0; font-size: 22px; font-weight: 700;">${title}</h2>
                  <div style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                    ${bodyContent}
                  </div>

                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <td align="center">
                        <a href="${ctaUrl}" style="background-color: #0ea5e9; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 50px; font-weight: 600; display: inline-block; font-size: 16px; box-shadow: 0 4px 14px rgba(14, 165, 233, 0.4);">
                          ${ctaText}
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td style="background-color: #f8fafc; padding: 20px 40px; border-top: 1px solid #e2e8f0; text-align: center;">
                  <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                    &copy; ${new Date().getFullYear()} Sofka Technologies. Todos los derechos reservados.<br>
                    Este es un mensaje automático, por favor no respondas a este correo.
                  </p>
                </td>
              </tr>
            </table>
            </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

// --- FUNCIONES DE ENVÍO ---

export async function sendCandidateWelcomeEmail(name: string, email: string, code: string) {
  const loginUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/login?code=${code}`;

  const title = `¡Hola, ${name}! Bienvenido al reto.`;
  const body = `
    <p>Nos emociona que participes en nuestro proceso de selección. En Sofka creemos en potenciar el talento y estamos ansiosos por conocer tus habilidades.</p>
    <p>Hemos preparado una evaluación inicial para ti. Tienes acceso exclusivo mediante el siguiente código:</p>
    <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; border-left: 4px solid #0ea5e9;">
      <span style="font-family: monospace; font-size: 24px; font-weight: bold; color: #1e293b; letter-spacing: 2px;">${code}</span>
    </div>
    <p>Asegúrate de contar con una conexión estable y un espacio tranquilo antes de comenzar.</p>
  `;

  const html = getSofkaTemplate(title, body, loginUrl, "Comenzar Evaluación");

  // Validación de configuración SMTP (Igual que tu original)
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error("ERROR SMTP: Faltan variables de entorno.");
    return;
  }

  try {
    await transporter.sendMail({
      from: `"Talento Sofka" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Bienvenido a tu Proceso de Selección - Sofka',
      html,
    });
    console.log(`Correo de bienvenida enviado a ${email}`);
  } catch (error: any) {
    console.error(`Error enviando correo a ${email}:`, error.message);
    throw error;
  }
}

export async function sendEvaluationCompleteEmail(name: string, email: string, code: string) {
  const loginUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/login?code=${code}`;

  const title = `¡Excelente trabajo, ${name}!`;
  const body = `
    <p>Hemos procesado tu evaluación inicial con éxito. Tu perfil nos resulta muy interesante y queremos invitarte a dar el siguiente paso.</p>
    <p>La siguiente etapa es la <strong>Certificación de Conocimientos</strong>. Aquí validaremos aspectos técnicos específicos clave para el rol.</p>
    <p style="font-size: 14px; color: #64748b;">Nota: Si tienes una sesión abierta, te recomendamos recargar la página o volver a ingresar.</p>
  `;

  const html = getSofkaTemplate(title, body, loginUrl, "Ir a Certificación");

  if (!process.env.SMTP_USER) return;

  await transporter.sendMail({
    from: `"Talento Sofka" <${process.env.SMTP_USER}>`,
    to: email,
    subject: '¡Avanzaste! Siguiente etapa: Certificación',
    html,
  });
}

export async function sendCertificationCompleteEmail(name: string, email: string, code: string) {
  const loginUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/login?code=${code}`;

  const title = `Certificación Completada`;
  const body = `
    <p>¡Felicitaciones ${name}! Has completado la etapa de certificación.</p>
    <p>Estás cada vez más cerca. Ahora llega el momento de la verdad: <strong>El Reto Técnico (Challenge)</strong>.</p>
    <p>En esta etapa podrás demostrar tu creatividad y calidad de código. El reto ya se encuentra habilitado en tu panel.</p>
  `;

  const html = getSofkaTemplate(title, body, loginUrl, "Aceptar el Reto");

  if (!process.env.SMTP_USER) return;

  await transporter.sendMail({
    from: `"Talento Sofka" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Reto Técnico Habilitado - Estás muy cerca',
    html,
  });
}

/**
 * Envía un correo de rechazo cordial cuando el candidato no cumple con el umbral técnico.
 */
export async function sendRejectionEmail(name: string, email: string) {
  const title = `¡Gracias por tu interés, ${name}!`;
  const body = `
    <p>Agradecemos el tiempo que has dedicado a completar nuestro pre-screening técnico.</p>
    <p>En este momento, hemos identificado que existe una brecha significativa entre tu perfil actual y los requerimientos específicos de esta vacante.</p>
    <p>Por esta razón, no continuaremos con tu proceso de selección en esta ocasión. Sin embargo, te animamos a seguir fortaleciendo tu perfil y a postularte a futuras oportunidades en Sofka.</p>
    <p>¡Te deseamos mucho éxito en tus proyectos!</p>
  `;

  const html = getSofkaTemplate(title, body, "#", "Ver otras vacantes");

  if (!process.env.SMTP_USER) return;

  await transporter.sendMail({
    from: `"Talento Sofka" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Actualización sobre tu proceso de selección - Sofka',
    html,
  });
}

export async function sendRecruiterNotification(
  recruiterEmail: string,
  candidateName: string,
  eventType: 'REJECTION' | 'RETRY',
  details: string
) {
  const title = eventType === 'REJECTION'
    ? 'Candidato Rechazado por el Sistema'
    : 'Candidato ha Iniciado un Reintento';

  const subject = eventType === 'REJECTION'
    ? `Notificación: Candidato ${candidateName} Rechazado`
    : `Notificación: Candidato ${candidateName} ha solicitado un Reintento`;

  const body = `
    <p>Hola,</p>
    <p>Te informamos sobre una actualización del candidato <strong>${candidateName}</strong>:</p>
    <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
      <p style="margin: 0;"><strong>Evento:</strong> ${eventType === 'REJECTION' ? 'Rechazo Automático' : 'Nuevo Intento de Evaluación'}</p>
      <p style="margin: 5px 0 0 0;"><strong>Detalles:</strong> ${details}</p>
    </div>
    <p>Por favor, ten esto en cuenta para la gestión del proceso y la agenda de entrevistas.</p>
  `;

  const html = getSofkaTemplate(title, body, "#", "Ver Panel Admin");

  if (!process.env.SMTP_USER) return;

  await transporter.sendMail({
    from: `"Sistema de Alertas Sofka" <${process.env.SMTP_USER}>`,
    to: recruiterEmail,
    subject: subject,
    html,
  });
}

export async function sendCandidateReminderEmail(name: string, email: string, code: string) {
  const loginUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/login?code=${code}`;

  const title = `¡Hola, ${name}! ¿Continuamos?`;
  const body = `
    <p>Hemos notado que has iniciado tu proceso de selección con nosotros pero aún no has completado la etapa de <strong>Pre-screening</strong>.</p>
    <p>En Sofka valoramos mucho tu interés y no queremos que pierdas la oportunidad de formar parte de nuestro equipo. El proceso es sencillo y solo te tomará unos minutos más.</p>
    <p>Haz clic en el botón de abajo para retomar justo donde quedaste.</p>
  `;

  const html = getSofkaTemplate(title, body, loginUrl, "Continuar Proceso");

  if (!process.env.SMTP_USER) {
    console.error("ERROR SMTP: SMTP_USER not set.");
    return;
  }

  await transporter.sendMail({
    from: `"Talento Sofka" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Recordatorio: Tu proceso de selección en Sofka te espera',
    html,
  });
}

export async function sendCandidateDeletionEmail(name: string, email: string, reason: string) {
  const title = `Actualización de tu proceso de selección`;
  const body = `
    <p>Hola, ${name}.</p>
    <p>Te escribimos para informarte que hemos realizado una actualización en nuestro sistema de reclutamiento y tu perfil ha sido retirado del proceso actual.</p>
    <p><strong>Motivo de la actualización:</strong> ${reason}</p>
    <p>Agradecemos profundamente el interés que has mostrado en formar parte de Sofka y el tiempo dedicado a las evaluaciones.</p>
    <p>Te deseamos mucho éxito en tus futuros proyectos profesionales.</p>
  `;

  const html = getSofkaTemplate(title, body, "#", "Ver otras vacantes");

  if (!process.env.SMTP_USER) return;

  await transporter.sendMail({
    from: `"Talento Sofka" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Actualización sobre tu proceso de selección - Sofka',
    html,
  });
}