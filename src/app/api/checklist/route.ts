import { NextRequest, NextResponse } from 'next/server';

const CHECKLIST_DATA = [
  {
    id: 'senhas-contas',
    title: 'Senhas e Contas',
    icon: 'KeyRound',
    color: 'emerald',
    items: [
      {
        id: 'sc-1',
        text: 'Usar senhas únicas para cada conta importante',
        detail: 'Nunca reutilize a mesma senha em múltiplos serviços. Se uma for comprometida, as outras ficam vulneráveis. Use um gestor de senhas como Bitwarden ou KeePass para gerir senhas complexas.',
      },
      {
        id: 'sc-2',
        text: 'Activar autenticação de dois factores (2FA) no email',
        detail: 'O email é a chave de acesso a todas as suas contas. Active 2FA no Gmail, Outlook ou Yahoo para adicionar uma camada extra de segurança. Prefira apps autenticadores como Google Authenticator.',
      },
      {
        id: 'sc-3',
        text: 'Activar 2FA no Multicaixa Express',
        detail: 'O Multicaixa Express é o alvo mais comum de golpistas em Angola. Active a verificação em duas etapas nas configurações da app para proteger suas transacções financeiras.',
      },
      {
        id: 'sc-4',
        text: 'Verificar senhas fracas e actualizá-las',
        detail: 'Senhas como "123456", "password" ou o seu nome são extremamente fáceis de adivinhar. Use pelo menos 12 caracteres com letras maiúsculas, minúsculas, números e símbolos.',
      },
      {
        id: 'sc-5',
        text: 'Revogar acesso de apps de terceiros',
        detail: 'Muitas apps pedem acesso à sua conta Google ou Facebook. Revise regularmente em Configurações > Apps com acesso e remova as que não reconhece ou não usa mais.',
      },
    ],
  },
  {
    id: 'telemovel-apps',
    title: 'Telemóvel e Apps',
    icon: 'Smartphone',
    color: 'sky',
    items: [
      {
        id: 'ta-1',
        text: 'Actualizar sistema operativo do telemóvel',
        detail: 'As actualizações de sistema corrigem vulnerabilidades de segurança descobertas. Configure actualizações automáticas no seu Android ou iOS para manter-se sempre protegido.',
      },
      {
        id: 'ta-2',
        text: 'Instalar apps apenas de fontes oficiais',
        detail: 'Evite instalar apps de fontes desconhecidas (APKs fora da Play Store). Apps piratas podem conter malware que rouba seus dados bancários e senhas.',
      },
      {
        id: 'ta-3',
        text: 'Revistar permissões das apps instaladas',
        detail: 'Vá em Configurações > Apps > Permissões e verifique quais apps têm acesso à câmara, microfone, localização e contactos. Revogue permissões desnecessárias.',
      },
      {
        id: 'ta-4',
        text: 'Activar bloqueio de ecrã com PIN/biométrico',
        detail: 'Sem bloqueio de ecrã, qualquer pessoa que pegar no seu telemóvel tem acesso a todas as suas contas. Use PIN de 6 dígitos, padrão ou impressão digital.',
      },
      {
        id: 'ta-5',
        text: 'Configurar localização remota (Find My Device)',
        detail: 'Active "Encontrar meu dispositivo" no Android ou "Find My" no iOS. Em caso de perda ou roubo, pode localizar, bloquear ou apagar dados remotamente.',
      },
    ],
  },
  {
    id: 'redes-sociais',
    title: 'Redes Sociais',
    icon: 'Share2',
    color: 'violet',
    items: [
      {
        id: 'rs-1',
        text: 'Rever configurações de privacidade do Facebook',
        detail: 'Vá em Configurações > Privacidade e limite quem pode ver seus posts, lista de amigos e informações de contacto. Defina para "Apenas eu" dados sensíveis como número de telefone.',
      },
      {
        id: 'rs-2',
        text: 'Activar verificação em duas etapas no WhatsApp',
        detail: 'No WhatsApp, vá em Configurações > Conta > Verificação em duas etapas. Isso impede que alguém registre seu número noutro dispositivo sem o PIN.',
      },
      {
        id: 'rs-3',
        text: 'Desactivar geolocalização em posts públicos',
        detail: 'Nunca partilhe a sua localização exacta em posts públicos. Golpistas usam essa informação para saber quando você não está em casa ou para roubo.',
      },
      {
        id: 'rs-4',
        text: 'Rever lista de seguidores e bloquear suspeitos',
        detail: 'Verifique periodicamente quem segue você no Facebook, Instagram e outras redes. Bloqueie perfis falsos, sem fotos ou com actividade suspeita.',
      },
      {
        id: 'rs-5',
        text: 'Não aceitar pedidos de desconhecidos',
        detail: 'Golpistas criam perfis falsos para adicionar pessoas e depois tentam aplicar golpes. Nunca aceite pedidos de pessoas que não conhece pessoalmente.',
      },
    ],
  },
  {
    id: 'bancario-financeiro',
    title: 'Bancário e Financeiro',
    icon: 'Landmark',
    color: 'amber',
    items: [
      {
        id: 'bf-1',
        text: 'Nunca partilhar PIN ou senhas bancárias',
        detail: 'Nenhum banco, incluindo BNA, BAI, BIC ou Millennium Atlântico, pedirá seu PIN por telefone, SMS ou email. Se alguém pedir, é um golpe.',
      },
      {
        id: 'bf-2',
        text: 'Verificar URL do banco antes de aceder',
        detail: 'Antes de aceder ao internet banking, verifique se o URL começa com "https://" e se o domínio está correcto. Golpistas criam sites falsos com URLs parecidas.',
      },
      {
        id: 'bf-3',
        text: 'Activar alertas SMS do Multicaixa Express',
        detail: 'Active as notificações por SMS para cada transacção. Assim, será alertado imediatamente de qualquer movimentação suspeita na sua conta.',
      },
      {
        id: 'bf-4',
        text: 'Nunca clicar em links de SMS bancários',
        detail: 'Golpistas enviam SMS falsos pedindo para clicar num link para "actualizar dados" ou "desbloquear conta". Aceda sempre directamente ao app ou site do banco.',
      },
      {
        id: 'bf-5',
        text: 'Contactar o banco directamente em caso de dúvida',
        detail: 'Se receber uma mensagem suspeita sobre sua conta, ligue directamente para o número oficial do seu banco. Nunca use os números fornecidos na mensagem suspeita.',
      },
    ],
  },
  {
    id: 'wifi-internet',
    title: 'Wi-Fi e Internet',
    icon: 'Wifi',
    color: 'rose',
    items: [
      {
        id: 'wi-1',
        text: 'Evitar transacções em Wi-Fi público',
        detail: 'Redes Wi-Fi públicas em cafés, aeroportos e shoppings podem ser monitoradas por criminosos. Nunca faça transacções bancárias ou acesse dados sensíveis nessas redes.',
      },
      {
        id: 'wi-2',
        text: 'Verificar nome da rede Wi-Fi antes de ligar',
        detail: 'Golpistas criam redes Wi-Fi falsas com nomes parecidos com redes legítimas (ex: "Shopping_Centro" vs "Shopping Centro"). Verifique sempre com o estabelecimento o nome correcto.',
      },
      {
        id: 'wi-3',
        text: 'Desactivar Wi-Fi automático fora de casa',
        detail: 'Configure seu telemóvel para não se ligar automaticamente a redes Wi-Fi abertas. Isso evita que se ligue a redes maliciosas sem o seu conhecimento.',
      },
      {
        id: 'wi-4',
        text: 'Usar VPN quando necessário',
        detail: 'Uma VPN (Virtual Private Network) criptografa seus dados mesmo em redes não seguras. Use uma VPN confiável quando precisar aceder a dados sensíveis fora de casa.',
      },
      {
        id: 'wi-5',
        text: 'Verificar certificado HTTPS nos sites',
        detail: 'Antes de introduzir dados pessoais num site, verifique se o URL começa com "https://" e se há um ícone de cadeado na barra de endereço. Sites sem HTTPS não são seguros.',
      },
    ],
  },
  {
    id: 'familia-criancas',
    title: 'Família e Crianças',
    icon: 'UsersRound',
    color: 'teal',
    items: [
      {
        id: 'fc-1',
        text: 'Configurar controlo parental nos dispositivos',
        detail: 'Use ferramentas como Google Family Link ou Screen Time do iOS para limitar tempo de uso, bloquear apps inadequadas e monitorizar actividade das crianças.',
      },
      {
        id: 'fc-2',
        text: 'Conversar com filhos sobre perigos online',
        detail: 'Explique às crianças que nunca devem partilhar dados pessoais, fotos ou localização com desconhecidos online. Mantenha um diálogo aberto e sem julgamentos.',
      },
      {
        id: 'fc-3',
        text: 'Monitorizar actividade online das crianças',
        detail: 'Especialmente para crianças menores de 13 anos, mantenha-se informado sobre quais apps usam, com quem conversam e que conteúdo acessam. Coloque o computador numa área comum.',
      },
      {
        id: 'fc-4',
        text: 'Ensinar crianças a não partilhar dados pessoais',
        detail: 'Ensine que informações como nome completo, escola, morada, número de telefone e fotos não devem ser partilhadas online. Use exemplos simples e adequados à idade.',
      },
      {
        id: 'fc-5',
        text: 'Definir regras para uso de redes sociais',
        detail: 'Estabeleça idades mínimas para redes sociais (13 anos para maioria das plataformas), limite o tempo diário e verifique regularmente as configurações de privacidade das contas dos seus filhos.',
      },
    ],
  },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    categories: CHECKLIST_DATA,
    totalItems: CHECKLIST_DATA.reduce((sum, cat) => sum + cat.items.length, 0),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { completedItems } = body as { completedItems: string[] };

    if (!Array.isArray(completedItems)) {
      return NextResponse.json(
        { success: false, error: 'completedItems deve ser uma lista de strings' },
        { status: 400 }
      );
    }

    // Client-side state is primary, but we save to DB for future use
    const { db } = await import('@/lib/db');

    // Upsert: find existing or create new
    const existing = await db.securityChecklist.findFirst();

    if (existing) {
      await db.securityChecklist.update({
        where: { id: existing.id },
        data: { completedItems: JSON.stringify(completedItems) },
      });
    } else {
      await db.securityChecklist.create({
        data: { completedItems: JSON.stringify(completedItems) },
      });
    }

    return NextResponse.json({ success: true, message: 'Lista salva com sucesso' });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Erro ao salvar lista de verificação' },
      { status: 500 }
    );
  }
}