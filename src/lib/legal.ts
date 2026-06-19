import type { Metadata } from "next";
import { PUBLIC_CONTACT_EMAIL } from "@/lib/contact";
import type { Locale } from "@/lib/i18n";

export type LegalDocument = {
  eyebrow: string;
  title: string;
  description: string;
  lastUpdated: string;
  sections: Array<{
    title: string;
    body: string[];
  }>;
};

type LegalContent = {
  privacy: LegalDocument;
  terms: LegalDocument;
};

export const legalContent: Record<Locale, LegalContent> = {
  en: {
    privacy: {
      eyebrow: "Legal",
      title: "Privacy Policy",
      description:
        "This policy explains what CosmoRemote handles when you use the app, the local bridge, account features, remote relay, and subscription services.",
      lastUpdated: "Last updated: May 7, 2026",
      sections: [
        {
          title: "1. Information we process",
          body: [
            "CosmoRemote may process account details, device identifiers, app diagnostics, purchase status, paired-device metadata, project names, prompts, outputs, and session history when those features are enabled.",
            "The exact data depends on how you use the product. Local Wi-Fi sessions can stay between your devices, while account sync, remote relay, purchase restoration, and cloud history require backend processing.",
          ],
        },
        {
          title: "2. Code, prompts, and session content",
          body: [
            "CosmoRemote is designed to connect your phone or tablet to the computer running Claude Code or Codex. Your code, prompts, and command output may pass through the local bridge or remote relay so the app can display and control the session.",
            "If cloud history or account sync is enabled, session content and related metadata may be stored so you can review previous work across devices. You can delete local history from the app, and backend deletion controls will be provided through the app or support flow.",
          ],
        },
        {
          title: "3. Third-party providers",
          body: [
            "CosmoRemote works with third-party tools and services, including Claude Code, Codex, app store payment systems, analytics, crash reporting, authentication, and infrastructure providers.",
            "Those providers process data under their own terms and privacy policies. Review the policies for any AI CLI, API account, app store, or connected provider you use with CosmoRemote.",
          ],
        },
        {
          title: "4. How we use information",
          body: [
            "We use information to provide pairing, live streaming, remote relay, session history, account access, subscription entitlement checks, fraud prevention, diagnostics, security, support, and product improvement.",
            "We do not sell your personal information. We do not use your private code or session content for advertising.",
          ],
        },
        {
          title: "5. Security and retention",
          body: [
            "We use reasonable technical and organizational safeguards for transport security, authentication, and entitlement checks. No internet-connected system can be guaranteed to be perfectly secure.",
            "We keep information only as long as needed for the product, legal obligations, security, backups, and support. Some deleted data may remain in backups for a limited period before being purged.",
          ],
        },
        {
          title: "6. Your choices",
          body: [
            "You can limit data processing by using local-only workflows where available, disabling optional telemetry, deleting local session history, signing out, or removing paired devices.",
            `For account, deletion, or privacy requests, contact CosmoRemote at ${PUBLIC_CONTACT_EMAIL}.`,
          ],
        },
      ],
    },
    terms: {
      eyebrow: "Legal",
      title: "Terms of Service",
      description:
        "These terms govern access to CosmoRemote, including the mobile apps, desktop bridge, remote relay, session history, and subscription features.",
      lastUpdated: "Last updated: May 7, 2026",
      sections: [
        {
          title: "1. Acceptance",
          body: [
            "By downloading, accessing, or using CosmoRemote, you agree to these Terms. If you do not agree, do not use the product.",
            "CosmoRemote is in pre-launch or early availability until real store links are published. Features, pricing, and platform support may change before general release.",
          ],
        },
        {
          title: "2. Product use",
          body: [
            "CosmoRemote lets you control supported coding agents and command-line tools from another device. You are responsible for the projects, commands, prompts, code, outputs, and credentials you use with the app.",
            "Do not use CosmoRemote to violate laws, infringe rights, attack systems, bypass access controls, or process data you are not authorized to handle.",
          ],
        },
        {
          title: "3. Accounts, devices, and access",
          body: [
            "Some features may require an account, paired devices, a local bridge, or remote relay access. Keep your devices, account credentials, pairing codes, and tokens secure.",
            "We may suspend or limit access if we believe use of the service creates security, abuse, payment, legal, or operational risk.",
          ],
        },
        {
          title: "4. Subscriptions and purchases",
          body: [
            "Paid features may be offered through app store subscriptions or in-app purchases. Billing, renewals, cancellations, refunds, and trials are handled by the applicable app store unless stated otherwise.",
            "Prices and feature limits shown in the landing page or app must come from current store or product configuration. If a store link or purchase flow is not live, purchase availability remains coming soon.",
          ],
        },
        {
          title: "5. Third-party tools and output",
          body: [
            "Claude Code, Codex, app stores, infrastructure providers, and other connected services are not controlled by CosmoRemote. Your use of those services is governed by their own terms.",
            "AI and command-line output may be incomplete, incorrect, unsafe, or unsuitable for your project. You are responsible for reviewing, testing, and deciding whether to use any generated output.",
          ],
        },
        {
          title: "6. Disclaimers and liability",
          body: [
            "CosmoRemote is provided as is and as available, without warranties of uninterrupted operation, error-free behavior, or fitness for a particular purpose.",
            "To the maximum extent permitted by law, CosmoRemote will not be liable for lost profits, lost data, lost code, security incidents caused by your environment, third-party provider issues, or indirect damages.",
          ],
        },
      ],
    },
  },
  "pt-BR": {
    privacy: {
      eyebrow: "Legal",
      title: "Política de Privacidade",
      description:
        "Esta política explica o que o CosmoRemote trata quando você usa o app, o bridge local, recursos de conta, relay remoto e assinaturas.",
      lastUpdated: "Última atualização: 7 de maio de 2026",
      sections: [
        {
          title: "1. Informações que tratamos",
          body: [
            "O CosmoRemote pode tratar dados de conta, identificadores de dispositivo, diagnósticos do app, status de compra, metadados de dispositivos pareados, nomes de projetos, prompts, respostas e histórico de sessões quando esses recursos estiverem ativados.",
            "Os dados exatos dependem de como você usa o produto. Sessões na mesma rede Wi-Fi podem ficar entre seus dispositivos, enquanto sincronização de conta, relay remoto, restauração de compras e histórico em nuvem exigem processamento no backend.",
          ],
        },
        {
          title: "2. Código, prompts e conteúdo das sessões",
          body: [
            "O CosmoRemote foi criado para conectar seu celular ou tablet ao computador que roda Claude Code ou Codex. Seu código, prompts e saídas de comando podem passar pelo bridge local ou pelo relay remoto para que o app exiba e controle a sessão.",
            "Se histórico em nuvem ou sincronização de conta estiverem ativados, o conteúdo das sessões e metadados relacionados podem ser armazenados para você revisar trabalhos anteriores em outros dispositivos. Você pode apagar o histórico local no app, e controles de exclusão no backend serão oferecidos pelo app ou pelo suporte.",
          ],
        },
        {
          title: "3. Provedores de terceiros",
          body: [
            "O CosmoRemote funciona com ferramentas e serviços de terceiros, incluindo Claude Code, Codex, sistemas de pagamento das lojas, analytics, crash reporting, autenticação e provedores de infraestrutura.",
            "Esses provedores tratam dados de acordo com seus próprios termos e políticas de privacidade. Revise as políticas de qualquer CLI de IA, conta de API, loja de apps ou provedor conectado que você usar com o CosmoRemote.",
          ],
        },
        {
          title: "4. Como usamos informações",
          body: [
            "Usamos informações para oferecer pareamento, streaming ao vivo, relay remoto, histórico de sessões, acesso à conta, verificação de assinatura, prevenção de fraude, diagnósticos, segurança, suporte e melhoria do produto.",
            "Não vendemos suas informações pessoais. Não usamos seu código privado nem conteúdo de sessão para publicidade.",
          ],
        },
        {
          title: "5. Segurança e retenção",
          body: [
            "Usamos salvaguardas técnicas e organizacionais razoáveis para segurança em trânsito, autenticação e verificação de assinatura. Nenhum sistema conectado à internet pode ser garantido como perfeitamente seguro.",
            "Mantemos informações apenas pelo tempo necessário para o produto, obrigações legais, segurança, backups e suporte. Alguns dados excluídos podem permanecer em backups por um período limitado antes da remoção definitiva.",
          ],
        },
        {
          title: "6. Suas escolhas",
          body: [
            "Você pode limitar o tratamento de dados usando fluxos locais quando disponíveis, desativando telemetria opcional, apagando histórico local de sessões, saindo da conta ou removendo dispositivos pareados.",
            `Para solicitações sobre conta, exclusão ou privacidade, entre em contato com o CosmoRemote pelo email ${PUBLIC_CONTACT_EMAIL}.`,
          ],
        },
      ],
    },
    terms: {
      eyebrow: "Legal",
      title: "Termos de Serviço",
      description:
        "Estes termos regem o acesso ao CosmoRemote, incluindo apps móveis, bridge de desktop, relay remoto, histórico de sessões e recursos de assinatura.",
      lastUpdated: "Última atualização: 7 de maio de 2026",
      sections: [
        {
          title: "1. Aceite",
          body: [
            "Ao baixar, acessar ou usar o CosmoRemote, você concorda com estes Termos. Se não concordar, não use o produto.",
            "O CosmoRemote está em pré-lançamento ou disponibilidade inicial até que links reais das lojas sejam publicados. Recursos, preços e suporte a plataformas podem mudar antes do lançamento geral.",
          ],
        },
        {
          title: "2. Uso do produto",
          body: [
            "O CosmoRemote permite controlar agentes de código e ferramentas de linha de comando compatíveis a partir de outro dispositivo. Você é responsável pelos projetos, comandos, prompts, código, respostas e credenciais que usar com o app.",
            "Não use o CosmoRemote para violar leis, infringir direitos, atacar sistemas, burlar controles de acesso ou tratar dados que você não tem autorização para manipular.",
          ],
        },
        {
          title: "3. Contas, dispositivos e acesso",
          body: [
            "Alguns recursos podem exigir conta, dispositivos pareados, bridge local ou acesso por relay remoto. Mantenha seus dispositivos, credenciais de conta, códigos de pareamento e tokens em segurança.",
            "Podemos suspender ou limitar o acesso se entendermos que o uso do serviço cria risco de segurança, abuso, pagamento, legal ou operacional.",
          ],
        },
        {
          title: "4. Assinaturas e compras",
          body: [
            "Recursos pagos podem ser oferecidos por assinaturas nas lojas de apps ou compras dentro do app. Cobranças, renovações, cancelamentos, reembolsos e testes são tratados pela loja aplicável, salvo indicação em contrário.",
            "Preços e limites de recursos exibidos na landing page ou no app devem vir da configuração atual da loja ou do produto. Se um link de loja ou fluxo de compra não estiver no ar, a compra continua marcada como em breve.",
          ],
        },
        {
          title: "5. Ferramentas de terceiros e respostas",
          body: [
            "Claude Code, Codex, lojas de apps, provedores de infraestrutura e outros serviços conectados não são controlados pelo CosmoRemote. Seu uso desses serviços é regido pelos termos próprios de cada um.",
            "Saídas de IA e de linha de comando podem ser incompletas, incorretas, inseguras ou inadequadas para seu projeto. Você é responsável por revisar, testar e decidir se vai usar qualquer saída gerada.",
          ],
        },
        {
          title: "6. Isenções e responsabilidade",
          body: [
            "O CosmoRemote é fornecido no estado em que se encontra e conforme disponível, sem garantias de operação ininterrupta, ausência de erros ou adequação a um fim específico.",
            "Na máxima extensão permitida por lei, o CosmoRemote não será responsável por lucros cessantes, perda de dados, perda de código, incidentes de segurança causados pelo seu ambiente, problemas de provedores terceiros ou danos indiretos.",
          ],
        },
      ],
    },
  },
  es: {
    privacy: {
      eyebrow: "Legal",
      title: "Política de Privacidad",
      description:
        "Esta política explica qué procesa CosmoRemote cuando usas la app, el bridge local, las funciones de cuenta, el relay remoto y las suscripciones.",
      lastUpdated: "Última actualización: 7 de mayo de 2026",
      sections: [
        {
          title: "1. Información que procesamos",
          body: [
            "CosmoRemote puede procesar datos de cuenta, identificadores de dispositivo, diagnósticos de la app, estado de compra, metadatos de dispositivos vinculados, nombres de proyectos, prompts, respuestas e historial de sesiones cuando esas funciones están activadas.",
            "Los datos exactos dependen de cómo uses el producto. Las sesiones en la misma red Wi-Fi pueden quedarse entre tus dispositivos, mientras que la sincronización de cuenta, el relay remoto, la restauración de compras y el historial en la nube requieren procesamiento en el backend.",
          ],
        },
        {
          title: "2. Código, prompts y contenido de sesiones",
          body: [
            "CosmoRemote está diseñado para conectar tu celular o tablet con la computadora que ejecuta Claude Code o Codex. Tu código, prompts y salidas de comando pueden pasar por el bridge local o el relay remoto para que la app muestre y controle la sesión.",
            "Si el historial en la nube o la sincronización de cuenta están activados, el contenido de las sesiones y los metadatos relacionados pueden almacenarse para que puedas revisar trabajos anteriores en otros dispositivos. Puedes borrar el historial local desde la app, y los controles de eliminación del backend estarán disponibles por la app o el flujo de soporte.",
          ],
        },
        {
          title: "3. Proveedores externos",
          body: [
            "CosmoRemote funciona con herramientas y servicios externos, incluidos Claude Code, Codex, sistemas de pago de las tiendas, analytics, reportes de fallos, autenticación e infraestructura.",
            "Esos proveedores procesan datos bajo sus propios términos y políticas de privacidad. Revisa las políticas de cualquier CLI de IA, cuenta de API, tienda de apps o proveedor conectado que uses con CosmoRemote.",
          ],
        },
        {
          title: "4. Cómo usamos la información",
          body: [
            "Usamos información para ofrecer vinculación, streaming en vivo, relay remoto, historial de sesiones, acceso a cuenta, verificación de suscripción, prevención de fraude, diagnósticos, seguridad, soporte y mejora del producto.",
            "No vendemos tu información personal. No usamos tu código privado ni el contenido de tus sesiones para publicidad.",
          ],
        },
        {
          title: "5. Seguridad y retención",
          body: [
            "Usamos salvaguardas técnicas y organizativas razonables para seguridad en tránsito, autenticación y verificación de suscripción. Ningún sistema conectado a internet puede garantizar seguridad perfecta.",
            "Conservamos información solo durante el tiempo necesario para el producto, obligaciones legales, seguridad, copias de respaldo y soporte. Algunos datos eliminados pueden permanecer en respaldos por un periodo limitado antes de ser purgados.",
          ],
        },
        {
          title: "6. Tus opciones",
          body: [
            "Puedes limitar el procesamiento usando flujos locales cuando estén disponibles, desactivando telemetría opcional, borrando el historial local de sesiones, cerrando sesión o eliminando dispositivos vinculados.",
            `Para solicitudes de cuenta, eliminación o privacidad, contacta a CosmoRemote en ${PUBLIC_CONTACT_EMAIL}.`,
          ],
        },
      ],
    },
    terms: {
      eyebrow: "Legal",
      title: "Términos de Servicio",
      description:
        "Estos términos regulan el acceso a CosmoRemote, incluidas las apps móviles, el bridge de escritorio, el relay remoto, el historial de sesiones y las funciones de suscripción.",
      lastUpdated: "Última actualización: 7 de mayo de 2026",
      sections: [
        {
          title: "1. Aceptación",
          body: [
            "Al descargar, acceder o usar CosmoRemote, aceptas estos Términos. Si no estás de acuerdo, no uses el producto.",
            "CosmoRemote está en pre-lanzamiento o disponibilidad inicial hasta que se publiquen enlaces reales de tienda. Las funciones, precios y plataformas compatibles pueden cambiar antes del lanzamiento general.",
          ],
        },
        {
          title: "2. Uso del producto",
          body: [
            "CosmoRemote permite controlar agentes de código y herramientas de línea de comandos compatibles desde otro dispositivo. Eres responsable de los proyectos, comandos, prompts, código, respuestas y credenciales que uses con la app.",
            "No uses CosmoRemote para violar leyes, infringir derechos, atacar sistemas, evadir controles de acceso o procesar datos que no estás autorizado a manejar.",
          ],
        },
        {
          title: "3. Cuentas, dispositivos y acceso",
          body: [
            "Algunas funciones pueden requerir una cuenta, dispositivos vinculados, bridge local o acceso por relay remoto. Mantén seguros tus dispositivos, credenciales de cuenta, códigos de vinculación y tokens.",
            "Podemos suspender o limitar el acceso si creemos que el uso del servicio crea riesgos de seguridad, abuso, pago, legales u operativos.",
          ],
        },
        {
          title: "4. Suscripciones y compras",
          body: [
            "Las funciones pagas pueden ofrecerse mediante suscripciones de tiendas de apps o compras dentro de la app. La facturación, renovaciones, cancelaciones, reembolsos y pruebas son gestionados por la tienda aplicable salvo que se indique lo contrario.",
            "Los precios y límites de funciones mostrados en la landing page o la app deben venir de la configuración actual de la tienda o del producto. Si un enlace de tienda o flujo de compra no está activo, la compra sigue marcada como próximamente.",
          ],
        },
        {
          title: "5. Herramientas externas y respuestas",
          body: [
            "Claude Code, Codex, tiendas de apps, proveedores de infraestructura y otros servicios conectados no están controlados por CosmoRemote. Tu uso de esos servicios se rige por sus propios términos.",
            "Las salidas de IA y de línea de comandos pueden ser incompletas, incorrectas, inseguras o inadecuadas para tu proyecto. Eres responsable de revisar, probar y decidir si usar cualquier salida generada.",
          ],
        },
        {
          title: "6. Exclusiones y responsabilidad",
          body: [
            "CosmoRemote se ofrece tal cual y según disponibilidad, sin garantías de operación ininterrumpida, ausencia de errores o aptitud para un fin específico.",
            "En la máxima medida permitida por la ley, CosmoRemote no será responsable por lucro cesante, pérdida de datos, pérdida de código, incidentes de seguridad causados por tu entorno, problemas de proveedores externos o daños indirectos.",
          ],
        },
      ],
    },
  },
};

export function generateLegalMetadata(
  locale: Locale,
  document: keyof LegalContent,
): Metadata {
  const content = legalContent[locale][document];
  const route = document === "privacy" ? "privacy" : "terms";
  const path = locale === "en" ? `/${route}` : `/${locale}/${route}`;

  return {
    title: content.title,
    description: content.description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: content.title,
      description: content.description,
      url: path,
      siteName: "CosmoRemote",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: content.title,
      description: content.description,
    },
  };
}
