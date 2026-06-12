import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    let seeded = false;

    // Track existing data by title for incremental seeding
    const existingArticles = await db.article.findMany({ select: { title: true } });
    const existingTitles = new Set(existingArticles.map(a => a.title));

    const existingTips = await db.tip.findMany({ select: { title: true } });
    const existingTipTitles = new Set(existingTips.map(t => t.title));

    const existingQuizzes = await db.quiz.findMany({ select: { title: true } });
    const existingQuizTitles = new Set(existingQuizzes.map(q => q.title));

    const existingPosts = await db.communityPost.count();

    // Seed Articles (only new ones)
    const articles = [
      {
        title: 'Como Proteger a sua Conta Multicaixa Express',
        content: `## Segurança no Multicaixa Express

O Multicaixa Express é uma das plataformas de pagamento digital mais utilizadas em Angola. Proteger a sua conta é fundamental.

### Dicas de Segurança:

1. **Nunca partilhe o seu PIN** - Nem com familiares, amigos ou supostos funcionários do banco
2. **Active a autenticação de dois factores** - Disponível nas definições da app
3. **Verifique sempre o remetente** - Antes de transferir dinheiro, confirme o número
4. **Mantenha a app actualizada** - Actualizações corrigem vulnerabilidades de segurança
5. **Cuidado com links suspeitos** - Não clique em links que prometem prémios ou bónus

### Sinais de Alerta:
- Mensagens a pedir o seu PIN ou código de confirmação
- Ofertas de dinheiro fácil ou prémios inesperados
- Pedidos de transferência urgentes de pessoas desconhecidas

### O Que Fazer se Suspeitar:
1. Mude imediatamente a sua senha
2. Contacte o seu banco
3. Denuncie na plataforma CIDSeguro`,
        category: 'banco',
        readTime: 5,
        featured: true
      },
      {
        title: 'Phishing em Angola: Como Identificar Golpes Digitais',
        content: `## Phishing: O Golpe Digital Mais Comum

O phishing é uma técnica usada por criminosos para enganar pessoas e roubar informações pessoais, senhas e dados financeiros.

### Golpes Comuns em Angola:

1. **Falsas mensagens da Unitel/MTN** - "Parabéns! Ganhou 50.000 Kz. Clique aqui"
2. **Falsos e-mails bancários** - Pedindo actualização de dados
3. **Falsos concursos em redes sociais** - "Partilhe e ganhe um telemóvel"
4. **Mensagens WhatsApp de "empregos"** - Pedindo dados pessoais

### Como Identificar:
- ✅ Verifique sempre o remetente
- ✅ Desconfie de ofertas demasiado boas
- ✅ Não clique em links encurtados desconhecidos
- ✅ Verifique o URL do site (deve começar com https://)
- ✅ Os bancos NUNCA pedem dados por mensagem

### Se Caiu num Golpe:
1. Mude todas as suas senhas imediatamente
2. Contacte as instituições afectadas
3. Denuncie às autoridades
4. Avise amigos e familiares`,
        category: 'phishing',
        readTime: 7,
        featured: true
      },
      {
        title: 'Senha Segura: Guia Completo para Cidadãos Angolanos',
        content: `## Criar Senhas Fortes e Memoráveis

Uma senha fraca é como uma porta aberta para os seus dados pessoais.

### Regras para uma Senha Forte:
- Mínimo de 12 caracteres
- Misture maiúsculas, minúsculas, números e símbolos
- Nunca use informações pessoais (data de nascimento, nome do cônjuge)
- Não reutilize a mesma senha em vários sites

### Método da Frase-Senha:
Crie uma frase e use as primeiras letras:
"Eu gosto de comer muamba de galinha em Luanda!" → **EgdcmgdgiLEm1!**

### Gestão de Senhas:
- Use um gestor de senhas (como o integrado no seu telemóvel)
- Active a verificação em duas etapas sempre que possível
- Mude senhas a cada 3-6 meses
- Nunca escreva senhas em papéis

### Senhas para Evitar:
- ❌ 123456, password, angola2024
- ❌ O seu nome ou data de nascimento
- ❌ Sequências simples (abcdef, qwerty)`,
        category: 'senhas',
        readTime: 4,
        featured: false
      },
      {
        title: 'Segurança no WhatsApp: Proteja as suas Conversas',
        content: `## WhatsApp Seguro em Angola

O WhatsApp é a aplicação de mensagens mais usada em Angola. Saiba como se proteger.

### Configurações Essenciais:

1. **Active a Verificação em Duas Etapas**
   - Vá a Configurações > Conta > Verificação em Duas Etapas
   - Crie um PIN de 6 dígitos

2. **Controle quem vê as suas informações**
   - Última vez online: "Ninguém"
   - Foto de perfil: "Meus Contactos"
   - Info: "Meus Contactos"

3. **Cuidado com grupos desconhecidos**
   - Não partilhe dados pessoais em grupos públicos
   - Saia de grupos que partilham conteúdo suspeito

### Golpes Comuns no WhatsApp:
- Mensagens de "prémios" com links
- Pedidos de dinheiro de contactos "sequestrados"
- Cadeias de mensagens alarmistas
- Falsas ofertas de emprego

### Dicas:
- ✅ Verifique sempre com a pessoa por outra via
- ✅ Bloqueie contactos desconhecidos que enviam spam
- ✅ Active as notificações de login em novo dispositivo`,
        category: 'redes-sociais',
        readTime: 5,
        featured: false
      },
      {
        title: 'Cibersegurança para Empresas Angolanas: Guia Básico',
        content: `## Proteger o seu Negócio Digital

As empresas angolanas enfrentam crescentes ameaças cibernéticas. Este guia ajuda a proteger o seu negócio.

### Passos Essenciais:

1. **Formação dos Funcionários**
   - Treine a sua equipa sobre phishing e segurança digital
   - Estabeleça políticas claras de uso de dispositivos
   - Faça simulações de phishing periodicamente

2. **Protecção de Dados**
   - Faça backup regular dos dados importantes
   - Use antivírus actualizado em todos os computadores
   - Criptografe dados sensíveis

3. **Rede Segura**
   - Use passwords fortes no Wi-Fi da empresa
   - Separe a rede de visitantes da rede interna
   - Use VPN para ligações remotas

4. **Plano de Resposta**
   - Tenha um plano para incidentes de segurança
   - Mantenha contactos de apoio técnico actualizados
   - Documente todos os procedimentos

### Ferramentas Recomendadas:
- Antivírus: Windows Defender (gratuito), Kaspersky
- Backup: Google Drive, OneDrive (planos gratuitos)
- Gestão de senhas: Bitwarden (gratuito)`,
        category: 'empresas',
        readTime: 8,
        featured: true
      },
      {
        title: 'Protecção de Crianças e Jovens na Internet',
        content: `## Cibersegurança para a Família Angolana

As crianças e jovens angolanos passam cada vez mais tempo online. Proteja-os.

### Riscos Principais:
- Contacto com desconhecidos
- Cyberbullying
- Acesso a conteúdo inadequado
- Vício em redes sociais
- Partilha excessiva de informações

### Dicas para Pais:

1. **Comunicação Aberta**
   - Fale com os seus filhos sobre os perigos online
   - Não proíba, eduque
   - Mantenha-se informado sobre as apps que eles usam

2. **Controles Parentais**
   - Use os controles parentais do Android/iOS
   - Configure horários de uso
   - Monitorize as transferências (com conhecimento do filho)

3. **Redes Sociais**
   - Ensine a não partilhar localização
   - Configure perfis como privados
   - Explique que nada na internet é verdadeiramente privado

### Sinais de Alerta:
- Criança secreta sobre o uso do telemóvel
- Mudanças de comportamento
- Mensagens de desconhecidos
- Pedidos de encontros com pessoas online`,
        category: 'familia',
        readTime: 6,
        featured: false
      },
      {
        title: 'Golpes de Emprego Online: Como Identificar e Evitar',
        content: `## Falsas Ofertas de Emprego Digital

Os golpes de emprego online são cada vez mais comuns em Angola, especialmente em redes sociais.

### Tipos de Golpe:

1. **Taxa de Inscrição** - Pedem dinheiro para "processar" a candidatura
2. **Dados Bancários** - Pedem o IBAN para "pagar o salário adiantado"
3. **Formação Paga** - Obrigam a pagar cursos inúteis para ser "qualificado"
4. **Trabalho Remoto Falso** - Prometem ganhos fáceis trabalhando de casa

### Sinais de uma Oferta Falsa:
- ❌ Salário muito alto para trabalho simples
- ❌ Sem entrevista presencial ou por vídeo
- ❌ Pedem dinheiro antecipadamente
- ❌ Gramática e ortografia ruins no anúncio
- ❌ Contacto apenas por WhatsApp
- ❌ Empresa sem site oficial ou presença digital

### Como Verificar:
1. Procure a empresa no Google
2. Verifique se têm site e redes sociais oficiais
3. Contacte a empresa directamente (não pelo número do anúncio)
4. Desconfie de ofertas urgentes ("últimas vagas!")
5. Nunca envie dinheiro ou dados bancários`,
        category: 'golpes',
        readTime: 5,
        featured: false
      },
      {
        title: 'Ransomware em Angola: Como Proteger os Seus Ficheiros',
        content: `## Ransomware: A Ameaça que Criptografa os Seus Dados

O ransomware é um tipo de malware que criptografa os ficheiros da vítima e exige pagamento para os devolver. Nos últimos anos, África tem sido um dos continentes mais afectados por esta ameaça.

### O que é Ransomware?

O ransomware é um programa malicioso que:
- Criptografa todos os ficheiros do seu computador ou telemóvel
- Exige pagamento (normalmente em criptomoedas) para devolver o acesso
- Pode espalhar-se por redes inteiras de empresas
- Pode destruir ficheiros permanentemente se o resgate não for pago

### Tendências Recentes em África:
- **Aumento de 300%** em ataques ransomware na região subsaariana desde 2021
- Empresas angolanas dos sectores bancário, petrolífero e de telecomunicações têm sido alvos
- Grupos como LockBit e BlackCat têm actividade crescente em África
- Ataques a infraestrutura crítica (hospitais, governos) estão a aumentar

### Como Proteger-se:

1. **Faça Backups Regulares**
   - Use a regra 3-2-1: 3 cópias, 2 tipos de media, 1 offsite
   - Faça backup de ficheiros importantes em Google Drive ou pendrive
   - Verifique os seus backups periodicamente

2. **Mantenha Software Actualizado**
   - Actualizações corrigem vulnerabilidades que ransomware explora
   - Active actualizações automáticas no Windows/Android

3. **Cuidado com E-mails e Links**
   - Não abra anexos de e-mails desconhecidos
   - Não clique em links suspeitos
   - Verifique sempre o remetente

4. **Use Antivírus**
   - Instale um antivírus confiável
   - Active a verificação em tempo real

### Se For Vítima de Ransomware:
1. **Não pague o resgate** — não há garantia de recuperar os ficheiros
2. **Desligue o dispositivo** da rede imediatamente
3. **Denuncie** às autoridades competentes
4. **Contacte um especialista** em recuperação de dados
5. **Formate o dispositivo** se não conseguir recuperar`,
        category: 'malware',
        readTime: 8,
        featured: true
      },
      {
        title: 'Segurança no Facebook e Instagram em Angola',
        content: `## Redes Sociais Seguras: Proteja a sua Identidade Online

O Facebook e o Instagram são as redes sociais mais usadas em Angola. Infelizmente, também são plataformas favoritas para criminosos digitais.

### Privacidade: Configurações Essenciais

**Facebook:**
- Vá a Configurações > Privacidade
- Defina "Quem pode ver as suas publicações" como "Amigos"
- Desactive a localização nas publicações
- Reveja quem pode encontrar o seu perfil por e-mail/telefone
- Active a autenticação em duas etapas

**Instagram:**
- Alterne para conta privada (Configurações > Conta > Privacidade)
- Desactive a partilha de localização nos stories
- Controle quem pode partilhar as suas stories
- Desactive sugestões nos Explorar

### Golpes Comuns em Angola:

1. **Perfis Falsos de Celebridades**
   - Criminosos criam perfis falsos de artistas angolanos
   - Oferecem "oportunidades" de negócio ou emprego
   - Pedem transferências para "processar documentos"

2. **Sorteios Falsos (Giveaways)**
   - "Partilhe e ganhe um iPhone!" — é sempre falso
   - Perfis que oferecem carros, viagens ou dinheiro
   - Pedem para clicar em links que roubam dados

3. **Clonagem de Contas**
   - Copiam a sua foto de perfil e criam uma conta com o seu nome
   - Contactam os seus amigos pedindo dinheiro
   - Dizem que estão "em apuros financeiros"

4. **Venda Falsa de Produtos**
   - Perfis que vendem telemóveis, roupas ou eletrónicos
   - Pedem pagamento antecipado e desaparecem
   - Sem garantias nem loja física

### Como Verificar um Perfil:
- ✅ Verifique se tem selo de verificação (✓ azul)
- ✅ Verifique há quanto tempo a conta existe
- ✅ Analise a qualidade das fotos (são roubadas?)
- ✅ Desconfie de perfis sem publicações próprias
- ✅ Pesquise o nome em Google + "golpe" ou "fraude"

### Se a sua Conta For Clonada:
1. Denuncie imediatamente ao Facebook/Instagram
2. Avise todos os seus contactos
3. Não envie dinheiro a ninguém que contacte pela conta falsa
4. Fortaleça a segurança da sua conta original`,
        category: 'redes-sociais',
        readTime: 9,
        featured: true
      },
      {
        title: 'Dispositivos Inteligentes: Riscos Escondidos em Casa',
        content: `## IoT: Quando a Tecnologia se Torna uma Ameaça

Os dispositivos inteligentes (Internet of Things - IoT) estão cada vez mais presentes nas casas angolanas: Smart TVs, câmaras de segurança, routers, eletrodomésticos inteligentes. Mas poucos sabem os riscos que representam.

### Dispositivos IoT Comuns em Angola:

1. **Smart TVs** — Samsung, LG, Hisense
   - Risco: microfones e câmaras que podem ser acedidos remotamente
   - Câmaras de seguranças podem ser hackeadas

2. **Routers Wi-Fi** — O gateway para a sua rede doméstica
   - Senhas fracas = acesso à toda a rede
   - Firmware desactualizado = vulnerabilidades abertas

3. **Telemóveis** — O dispositivo mais pessoal
   - Apps com permissões excessivas
   - Localização sempre activa

4. **Câmaras IP / Baby Monitors**
   - Podem ser acedidas por terceiros
   - Transmitem vídeo não criptografado

### Como os Dispositivos IoT São Explorados:
- **Botnets** — Dispositivos infectados que atacam outros sistemas
- **Roubo de dados** — Acesso a conversas, vídeos, localização
- **Espionagem** — Câmaras e microfones usados para vigiar
- **Ransomware** — Dispositivos bloqueados até pagamento

### Como Proteger os Seus Dispositivos:

1. **Mude as senhas padrão** de todos os dispositivos
2. **Actualize o firmware** regularmente
3. **Desactive funcionalidades** que não usa (microfone, câmara)
4. **Crie uma rede Wi-Fi separada** para dispositivos IoT
5. **Desligue dispositivos** quando não estiver em uso
6. **Compre marcas conhecidas** com histórico de segurança

### Dicas Específicas para Angola:
- Desactive a função de voz das Smart TVs se não usa
- Coloque fita adesiva sobre a câmara do laptop
- Configure o router com uma senha forte e WPA3
- Não compre dispositivos IoT de marcas desconhecidas
- Verifique regularmente os dispositivos ligados à sua rede`,
        category: 'iot',
        readTime: 7,
        featured: false
      },
      {
        title: 'Golpes com Criptomoedas: O que os Angolanos Devem Saber',
        content: `## Criptomoedas em Angola: Oportunidade ou Golpe?

Com o interesse crescente em criptomoedas em Angola, os golpistas estão a aproveitar a falta de conhecimento da maioria dos cidadãos para aplicar esquemas fraudulentos.

### Golpes de Criptomoedas Mais Comuns:

1. **Esquemas de Ponzi / Pirâmides**
   - Prometem retornos garantidos de 20%, 50% ou 100% ao mês
   - Funcionam pagando aos primeiros com o dinheiro dos novos
   - Quando param de entrar novos investidores, o esquema colapsa
   - Muitos operam em grupos WhatsApp e Telegram

2. **Falsas Plataformas de Trading**
   - Sites que parecem corretoras legítimas
   - Mostram lucros falsos no painel
   - Quando tenta levantar o dinheiro, pedem "taxas adicionais"

3. **Falsos Investidores / Gurus**
   - Perfis no Instagram e Facebook mostrando "lucros"
   - Pedem que envie criptomoedas para eles "investirem"
   - Prometem multiplicar o seu dinheiro em dias

4. **Airdrops Falsos**
   - Oferecem criptomoedas grátis se enviar primeiro uma "taxa de verificação"
   - Pedem que conecte a sua carteira a um site malicioso
   - Roubam todo o saldo da sua carteira

5. **Golpe do Romance + Crypto**
   - Conhecem pessoas em apps de encontros
   - Após criar relação emocional, pedem para "investir juntos"

### Sinais de um Golpe:
- ❌ Retornos garantidos e altos demais
- ❌ Pressão para investir rapidamente
- ❌ Não há documento legal ou registo
- ❌ Apenas contactam por WhatsApp ou Telegram
- ❌ Recusam reuniões presenciais
- ❌ Pedem que recrute mais pessoas (pirâmide)

### Como Investir com Segurança:
1. Use apenas corretoras regulamentadas e conhecidas (Binance, Coinbase)
2. Nunca envie criptomoedas para desconhecidos
3. Desconfie de retornos superiores a 10% ao mês
4. Informe-se antes de investir qualquer valor
5. Comece com valores pequenos que pode perder
6. Guarde as suas criptomoedas em carteira própria (não na corretora)

### Se Foi Vítima:
1. Não envie mais dinheiro tentando "recuperar"
2. Denuncie à Polícia Nacional e ao INACOM
3. Documente tudo (prints, mensagens, transacções)
4. Avise amigos e familiares sobre o esquema`,
        category: 'criptomoedas',
        readTime: 10,
        featured: true
      },
      {
        title: 'Cibersegurança para Crianças e Adolescentes Angolanos',
        content: `## Proteger os Mais Jovens no Mundo Digital

Com o crescimento do acesso à internet em Angola, crianças e adolescentes passam cada vez mais tempo online — em redes sociais, jogos, e aplicações de chat. A segurança digital deles é responsabilidade de todos.

### Os Números em Angola:
- Mais de 60% dos jovens angolanos entre 12-17 anos têm acesso à internet
- O TikTok, Instagram e WhatsApp são as apps mais usadas
- Muitos acedem à internet apenas pelo telemóvel
- Pais e educadores muitas vezes não conhecem os riscos

### Principais Riscos para Crianças:

1. **Cyberbullying (Ciberbullying)**
   - Insultos e humilhações nas redes sociais
   - Criação de grupos para zombar de colegas
   - Partilha de fotos sem consentimento
   - Impacto: ansiedade, depressão, isolamento social

2. **Contacto com Desconhecidos**
   - Predadores online em jogos e chats
   - Pedidos de fotos e vídeos impróprios
   - Grooming: construção de confiança para fins maliciosos

3. **Partilha Excessiva de Informações**
   - Localização em tempo real
   - Fotos da escola e da rotina diária
   - Informações sobre a família e residência

4. **Conteúdo Inadequado**
   - Violência, pornografia, discurso de ódio
   - Desinformação e fake news
   - Desafios perigosos nas redes sociais

5. **Vício em Ecrãs**
   - Tempo excessivo no telemóvel
   - Impacto no sono e desempenho escolar
   - Isolamento social

### Controles Parentais: Guia Prático

**Android (Google Family Link):**
- Grátis na Play Store
- Limita tempo de uso por app
- Aprova downloads de apps
- Rastreia a localização do dispositivo

**iOS (Tempo de Uso):**
- Integrado no iOS (Configurações > Tempo de Uso)
- Define limites diários de app
- Controla compras na App Store
- Bloqueia conteúdo adulto

### O Que Fazer se o seu Filho For Vítima de Cyberbullying:
1. **Escute e acolha** — não minimise o problema
2. **Tire prints** como evidência
3. **Bloqueie o agressor** em todas as plataformas
4. **Denuncie** à escola e à plataforma
5. **Procure ajuda profissional** se necessário

### Dicas para Educadores:
- Inclua cibersegurança no currículo escolar
- Promova campanhas de consciencialização
- Crie canais seguros para denúncias
- Envolva os pais nas actividades digitais`,
        category: 'familia',
        readTime: 8,
        featured: false
      },
      {
        title: 'Segurança em Redes Wi-Fi Públicas em Angola',
        content: `## Wi-Fi Público: Use com Precaução

As redes Wi-Fi públicas (em cafés, shoppings, aeroportos) são convenientes mas perigosas.

### Riscos:
- Interceptação de dados (sniffing)
- Redes Wi-Fi falsas (evil twin)
- Ataques man-in-the-middle
 Roubo de sessões de login

### Como se Proteger:

1. **Evite transacções financeiras** - Não faça bankng ou compras em Wi-Fi público
2. **Use VPN** - Uma VPN criptografa o seu tráfego
3. **Verifique o nome da rede** - Confirme com o estabelecimento o nome correcto do Wi-Fi
4. **Esqueça redes após usar** - Configure o telemóvel para não se ligar automaticamente
5. **Use HTTPS** - Verifique se os sites usam https://

### Dicas para Angolanos:
- Desactive a partilha de ficheiros quando ligado a Wi-Fi público
- Use o seu plano de dados móveis para operações sensíveis
- Active a opção "esquecer rede" após usar Wi-Fi público
- Mantenha o sistema operativo actualizado`,
        category: 'redes',
        readTime: 4,
        featured: false
      }
    ];

    for (const article of articles) {
      if (!existingTitles.has(article.title)) {
        await db.article.create({ data: article });
        seeded = true;
      }
    }

    // Seed Tips (Sabias Que?)
    const tips = [
      { title: 'Senhas Fortes', content: 'Usar uma frase longa como senha é mais seguro do que uma senha curta com símbolos complexos. Exemplo: "EuComproPaoNaPadariaDoBairro!" é mais forte que "P@ssw0rd123".', category: 'senhas', icon: '🔐' },
      { title: 'Verificação em Duas Etapas', content: 'A verificação em duas etapas (2FA) reduz em 99.9% a probabilidade de uma conta ser comprometida. Active-a em todas as suas contas importantes!', category: 'protecção', icon: '📱' },
      { title: 'Phishing por WhatsApp', content: 'Se receber uma mensagem no WhatsApp de um contacto pedindo dinheiro, mesmo que pareça ser de alguém conhecido, confirme por ligação telefónica antes de enviar qualquer valor.', category: 'phishing', icon: '💬' },
      { title: 'Atualizações de Segurança', content: 'As actualizações do seu telemóvel não são apenas para novas funcionalidades. A maioria corrige vulnerabilidades de segurança que podem ser exploradas por hackers.', category: 'actualizações', icon: '🔄' },
      { title: 'Wi-Fi Público', content: 'Nunca faça transacções bancárias ou introduza senhas importantes quando conectado a uma rede Wi-Fi pública. Use sempre o seu plano de dados para essas operações.', category: 'redes', icon: '📡' },
      { title: 'Backup dos Dados', content: 'Faça backup regular dos seus dados importantes. Um ataque de ransomware pode criptografar todos os seus ficheiros e pedir resgate para os devolver.', category: 'backup', icon: '💾' },
      { title: 'Cuidado com APKs', content: 'Não instale aplicações de fontes desconhecidas. APKs de sites de terceiros podem conter malware que rouba os seus dados bancários e senhas.', category: 'malware', icon: '🚫' },
      { title: 'Redes Sociais Privadas', content: 'Configure as suas redes sociais como privadas. Partilhar informações pessoais publicamente (localização, rotina, fotos de documentos) facilita o trabalho de criminosos.', category: 'privacidade', icon: '👤' },
      { title: 'Golpe do Prémio', content: 'Se receber uma mensagem dizendo que "ganhou um prémio" mas precisa "pagar uma taxa" para receber, é um golpe! Nenhum concurso legítimo pede dinheiro adiantado.', category: 'golpes', icon: '🏆' },
      { title: 'Verifique o URL', content: 'Antes de introduzir dados num site, verifique se o URL está correcto. Criminals criam sites falsos que parecem idênticos aos sites legítimos dos bancos.', category: 'phishing', icon: '🔍' },
      { title: 'Multicaixa Express Seguro', content: 'Nunca partilhe o seu código PIN do Multicaixa Express com ninguém. O banco nunca pedirá o seu PIN por telefone, SMS ou WhatsApp.', category: 'banco', icon: '💳' },
      { title: 'Software Pirata', content: 'Software pirata é uma das principais portas de entrada para malware em Angola. Use software livre ou versões gratuitas legais sempre que possível.', category: 'malware', icon: '💿' },
      { title: 'Senha do Wi-Fi', content: 'Mude a senha padrão do seu router Wi-Fi imediatamente. Senhas padrão como "admin/admin" são conhecidas por todos os hackers.', category: 'redes', icon: '📶' },
      { title: 'E-mails Suspeitos', content: 'Se um e-mail parece vir do seu banco mas tem erros ortográficos ou um endereço estranho, não clique em nenhum link. Contacte o banco directamente.', category: 'phishing', icon: '📧' },
      { title: 'Dados Pessoais', content: 'O seu BI, NUIT e dados bancários são tão valiosos quanto dinheiro. Nunca os envie por mensagem ou e-mail não criptografado.', category: 'privacidade', icon: '🪪' },
      { title: 'PIN do Multicaixa Express', content: 'Nunca partilhe o seu PIN do Multicaixa Express com ninguém, incluindo supostos funcionários do banco. Funcionários legítimos nunca pedem o seu PIN.', category: 'banco', icon: '🏧' },
      { title: 'Verifique o Remetente no WhatsApp', content: 'Antes de clicar em qualquer link recebido por WhatsApp, verifique quem o enviou. Se for desconhecido ou parecer suspeito, não clique e elimine a mensagem.', category: 'phishing', icon: '🔗' },
      { title: 'Senhas Únicas por Conta', content: 'Use uma senha diferente para cada conta importante (banco, e-mail, redes sociais). Se uma for comprometida, as outras continuam protegidas.', category: 'senhas', icon: '🔑' },
      { title: 'Active o 2FA em Tudo', content: 'A verificação em duas etapas (2FA) é a melhor protecção contra acessos não autorizados. Active-a no e-mail, redes sociais, e aplicações bancárias.', category: 'protecção', icon: '🛡️' },
      { title: 'Ofertas de Emprego Suspeitas', content: 'Se uma oferta de emprego em redes sociais promete salários muito altos para trabalho simples, é provavelmente um golpe. Empregos legítimos não pedem dinheiro adiantado.', category: 'golpes', icon: '💼' },
      { title: 'Wi-Fi Público e Transacções', content: 'Nunca utilize Wi-Fi público para aceder à sua conta bancária, Multicaixa Express ou introduzir senhas. Use sempre o seu plano de dados móveis para operações sensíveis.', category: 'redes', icon: '🏦' },
      { title: 'Actualize o Seu Telemóvel', content: 'Mantenha o sistema operativo e as aplicações do seu telemóvel sempre actualizados. As actualizações corrigem falhas de segurança que hackers podem explorar.', category: 'actualizações', icon: '📲' },
      { title: 'Revise Permissões das Apps', content: 'Verifique regularmente as permissões das suas aplicações. Revogue acesso a câmara, microfone e localização para apps que não precisam desses recursos.', category: 'privacidade', icon: '⚙️' },
      { title: 'Documentos nas Redes Sociais', content: 'Nunca partilhe fotos do seu BI, passaporte, NUIT ou comprovativos bancários nas redes sociais. Esses documentos podem ser usados para roubo de identidade.', category: 'privacidade', icon: '📄' },
      { title: 'PIN do Cartão SIM', content: 'Proteja o seu cartão SIM com um PIN forte. Golpistas podem fazer "SIM swap" para aceder às suas contas bancárias e redes sociais.', category: 'protecção', icon: '📱' }
    ];

    for (const tip of tips) {
      if (!existingTipTitles.has(tip.title)) {
        await db.tip.create({ data: tip });
        seeded = true;
      }
    }

    // Seed Quizzes
    const quizzes = [
      {
        title: 'Fundamentos de Cibersegurança',
        description: 'Teste os seus conhecimentos básicos sobre segurança digital',
        difficulty: 'iniciante',
        category: 'basico',
        questions: {
          create: [
            {
              question: 'Qual é a melhor prática para criar uma senha segura?',
              options: JSON.stringify(['Usar o seu nome e data de nascimento', 'Usar uma frase longa e única', 'Usar "123456" por ser fácil de lembrar', 'Usar a mesma senha em tudo']),
              correctIndex: 1,
              explanation: 'Frases longas e únicas (como "EuGostoDeComerMuambaEmLuanda!") são mais seguras do que senhas curtas e complexas, porque são mais difíceis de adivinhar e mais fáceis de lembrar.'
            },
            {
              question: 'O que é phishing?',
              options: JSON.stringify(['Um tipo de vírus de computador', 'Uma técnica para enganar pessoas e roubar informações', 'Um programa para acelerar o internet', 'Um sistema de backup de dados']),
              correctIndex: 1,
              explanation: 'Phishing é uma técnica de engenharia social usada para enganar pessoas, fazendo-as revelar informações pessoais como senhas e dados bancários através de mensagens falsas.'
            },
            {
              question: 'Recebeu uma mensagem no WhatsApp de um "prémio" que pede para clicar num link. O que deve fazer?',
              options: JSON.stringify(['Clicar imediatamente para não perder o prémio', 'Enviar para todos os contactos', 'Não clicar e eliminar a mensagem', 'Responder pedindo mais informações']),
              correctIndex: 2,
              explanation: 'Mensagens de prémios inesperados são quase sempre golpes de phishing. Nunca clique em links suspeitos e elimine a mensagem imediatamente.'
            },
            {
              question: 'O que é a verificação em duas etapas (2FA)?',
              options: JSON.stringify(['Um antivírus para telemóvel', 'Uma camada extra de segurança que exige um segundo código para aceder à conta', 'Um tipo de Wi-Fi seguro', 'Uma app para esconder ficheiros']),
              correctIndex: 1,
              explanation: 'A verificação em duas etapas adiciona uma camada extra de segurança. Mesmo que alguém saiba a sua senha, precisará de um segundo código (gerado no seu telemóvel) para aceder.'
            },
            {
              question: 'Qual é o risco de usar Wi-Fi público para transacções bancárias?',
              options: JSON.stringify(['Não há risco nenhum', 'Os dados podem ser interceptados por hackers', 'Apenas fica mais lento', 'A bateria gasta mais rápido']),
              correctIndex: 1,
              explanation: 'Em redes Wi-Fi públicas, criminosos podem interceptar os dados que você envia, incluindo senhas e informações bancárias. Use sempre o seu plano de dados para operações financeiras.'
            }
          ]
        }
      },
      {
        title: 'Segurança no Ambiente Digital Angolano',
        description: 'Questões sobre cibersegurança específicas para o contexto angolano',
        difficulty: 'intermediário',
        category: 'angola',
        questions: {
          create: [
            {
              question: 'Qual é a plataforma de pagamento digital mais usada em Angola?',
              options: JSON.stringify(['PayPal', 'Multicaixa Express', 'Venmo', 'Skrill']),
              correctIndex: 1,
              explanation: 'O Multicaixa Express é a plataforma de pagamento digital mais popular em Angola, tornando-a um alvo frequente para golpistas.'
            },
            {
              question: 'Um falso funcionário do banco liga a pedir o seu PIN do Multicaixa Express. O que faz?',
              options: JSON.stringify(['Fornece o PIN porque é do banco', 'Fornece apenas alguns dígitos do PIN', 'Não fornece o PIN e reporta à operadora', 'Pede para ligar mais tarde']),
              correctIndex: 2,
              explanation: 'Nenhum funcionário legítimo de banco pedirá o seu PIN por telefone. Isto é um golpe comum. Nunca partilhe o seu PIN e reporte imediatamente.'
            },
            {
              question: 'Qual destes é um sinal de que uma oferta de emprego online é falsa?',
              options: JSON.stringify(['Pedem entrevista por vídeo', 'Pedem dinheiro para processar a candidatura', 'Têm um website oficial', 'Pedem o seu currículo por e-mail']),
              correctIndex: 1,
              explanation: 'Ofertas de emprego legítimas NUNCA pedem dinheiro. Pedir taxas de inscrição ou formação paga é um dos sinais mais claros de um golpe.'
            },
            {
              question: 'Por que é importante manter o seu telemóvel actualizado?',
              options: JSON.stringify(['Para ter as apps mais recentes', 'Para corrigir vulnerabilidades de segurança', 'Para gastar mais dados', 'Para o telemóvel ficar mais rápido']),
              correctIndex: 1,
              explanation: 'As actualizações do sistema operativo corrigem vulnerabilidades de segurança que podem ser exploradas por hackers para aceder aos seus dados.'
            },
            {
              question: 'O que deve fazer se clicou num link suspeito e introduziu os seus dados bancários?',
              options: JSON.stringify(['Nada, se não notou nada de estranho', 'Esperar para ver se acontece algo', 'Mudar imediatamente as senhas e contactar o banco', 'Desligar o telemóvel']),
              correctIndex: 2,
              explanation: 'Tempo é crucial! Mude as senhas imediatamente, contacte o banco para bloquear acessos, e monitorize as suas contas por actividade suspeita.'
            }
          ]
        }
      },
      {
        title: 'Protecção Avançada contra Ameaças',
        description: 'Desafio avançado sobre protecção contra ciberameaças modernas',
        difficulty: 'avançado',
        category: 'avancado',
        questions: {
          create: [
            {
              question: 'O que é um ataque "Man-in-the-Middle" (MITM)?',
              options: JSON.stringify(['Um vírus que se espalha entre dispositivos', 'Quando um atacante intercepta a comunicação entre duas partes', 'Um tipo de ataque DDoS', 'Uma técnica de engenharia social por e-mail']),
              correctIndex: 1,
              explanation: 'Num ataque MITM, o atacante posiciona-se entre o utilizador e o serviço, interceptando e potencialmente alterando a comunicação sem que nenhuma das partes saiba.'
            },
            {
              question: 'Qual é a diferença entre vírus e ransomware?',
              options: JSON.stringify(['São a mesma coisa', 'Ransomware criptografa os ficheiros e pede resgate, vírus replicam-se', 'Vírus são mais perigosos que ransomware', 'Ransomware só afecta computadores']),
              correctIndex: 1,
              explanation: 'Ransomware é um tipo específico de malware que criptografa os ficheiros da vítima e pede pagamento (resgate) para os devolver. É uma das ameaças mais perigosas.'
            },
            {
              question: 'O que é "typosquatting"?',
              options: JSON.stringify(['Erros de digitação no teclado', 'Registar domínios com nomes parecidos aos de sites legítimos para enganar utilizadores', 'Um tipo de ataque a servidores', 'Uma técnica de programação']),
              correctIndex: 1,
              explanation: 'Typosquatting é quando criminosos registam domínios com erros de digitação de sites populares (ex: "facebok.com" em vez de "facebook.com") para enganar utilizadores distraídos.'
            },
            {
              question: 'Para que serve uma VPN (Virtual Private Network)?',
              options: JSON.stringify(['Para acelerar a internet', 'Para criptografar e proteger o seu tráfego online', 'Para fazer download de filmes', 'Para partilhar ficheiros']),
              correctIndex: 1,
              explanation: 'Uma VPN criptografa todo o seu tráfego de internet, tornando-o ilegível para terceiros. É especialmente útil em redes Wi-Fi públicas.'
            },
            {
              question: 'O que é "engenharia social" no contexto de cibersegurança?',
              options: JSON.stringify(['Engenharia de redes sociais', 'Manipulação psicológica para fazer pessoas revelar informações confidenciais', 'Uma especialidade de engenharia', 'Programação de redes sociais']),
              correctIndex: 1,
              explanation: 'Engenharia social é a manipulação psicológica de pessoas para que realizem acções ou divulguem informações confidenciais. É a base da maioria dos ataques cibernéticos bem-sucedidos.'
            }
          ]
        }
      },
      {
        title: 'Segurança no WhatsApp',
        description: 'Teste os seus conhecimentos sobre segurança no WhatsApp, a app mais usada em Angola',
        difficulty: 'intermediário',
        category: 'whatsapp',
        questions: {
          create: [
            {
              question: 'O que é a Verificação em Duas Etapas no WhatsApp e por que deve activá-la?',
              options: JSON.stringify(['Um filtro anti-spam para mensagens indesejadas', 'Um PIN extra que protege a sua conta mesmo que alguém tenha o seu código SMS', 'Um bloqueio de segurança que impede chamadas de desconhecidos', 'Uma forma de esconder o seu número de telefone']),
              correctIndex: 1,
              explanation: 'A Verificação em Duas Etapas cria um PIN de 6 dígitos que é exigido ao registar o WhatsApp num novo dispositivo. Sem ele, alguém com acesso ao seu código SMS não conseguiria roubar a sua conta.'
            },
            {
              question: 'Recebeu uma mensagem de um contacto conhecido pedindo dinheiro urgentemente. Qual é a melhor atitude?',
              options: JSON.stringify(['Enviar o dinheiro imediatamente pois é um amigo', 'Ligar para a pessoa por telefone para confirmar antes de enviar qualquer valor', 'Pedir que envie uma foto para provar que é realmente ela', 'Transferir apenas metade do valor pedido']),
              correctIndex: 1,
              explanation: 'Um dos golpes mais comuns no WhatsApp é quando criminosos hackeiam a conta de alguém e pedem dinheiro a todos os contactos. Sempre confirme por ligação telefónica antes de enviar qualquer valor.'
            },
            {
              question: 'Qual destas configurações de privacidade é a mais segura para o seu perfil do WhatsApp?',
              options: JSON.stringify(['"Todos" podem ver a última vez online e a foto de perfil', '"Ninguém" pode ver a última vez online, "Meus Contactos" para a foto', '"Todos" podem ver tudo pois é uma app privada', '"Meus Contactos" para tudo não é seguro o suficiente']),
              correctIndex: 1,
              explanation: 'Configurar "Ninguém" para a última vez online e "Meus Contactos" para a foto de perfil limita drasticamente a informação disponível para criminosos que tentam monitorizar a sua actividade.'
            },
            {
              question: 'O WhatsApp faz backup das suas conversas. O que é verdade sobre a segurança desses backups?',
              options: JSON.stringify(['Os backups são criptografados automaticamente no Google Drive e iCloud', 'Os backups NÃO são criptografados por padrão no Google Drive/iCloud, mas pode activar a criptografia ponta-a-ponta dos backups', 'Os backups nunca são armazenados em servidores externos', 'O WhatsApp não faz backup de mensagens']),
              correctIndex: 1,
              explanation: 'Até recentemente, os backups do WhatsApp não eram criptografados. Agora pode activar a criptografia ponta-a-ponta dos backups nas configurações, o que é altamente recomendado para proteger conversas sensíveis.'
            },
            {
              question: 'Como identificar uma conta comercial falsa no WhatsApp?',
              options: JSON.stringify(['Pelo número de telefone — contas falsas usam números estrangeiros', 'Pela existência do selo verde (✓) de verificação junto ao nome da empresa', 'Pelo tipo de mensagem — contas falsas só enviam áudio', 'Pela hora do envio — contas falsas só enviam mensagens de noite']),
              correctIndex: 1,
              explanation: 'Contas comerciais verificadas no WhatsApp têm um selo verde (✓) junto ao nome. Empresas como bancos, operadoras e lojas legítimas têm este selo. Se uma conta comercial não o tiver, desconfie.'
            }
          ]
        }
      },
      {
        title: 'Protecção de Dados Pessoais',
        description: 'Desafio avançado sobre protecção de dados pessoais e privacidade digital',
        difficulty: 'avançado',
        category: 'dados',
        questions: {
          create: [
            {
              question: 'Qual é o princípio fundamental de protecção de dados que diz que só se deve recolher os dados estritamente necessários?',
              options: JSON.stringify(['Princípio da Transparência', 'Princípio da Minimização de Dados', 'Princípio do Consentimento', 'Princípio da Portabilidade']),
              correctIndex: 1,
              explanation: 'O princípio da Minimização de Dados estabelece que apenas os dados absolutamente necessários devem ser recolhidos para o fim proposto. Uma app que pede acesso ao seu microfone só para funcionar como lanterna está a violar este princípio.'
            },
            {
              question: 'O que é a "pegada digital" e como ela afecta a sua privacidade?',
              options: JSON.stringify(['O rasto de pisadas deixado ao usar dispositivos electrónicos', 'O conjunto de todos os dados e actividades que você deixa na internet', 'A senha usada para aceder a sites seguros', 'O endereço IP do seu provedor de internet']),
              correctIndex: 1,
              explanation: 'A pegada digital inclui todas as suas publicações nas redes sociais, histórico de pesquisas, compras online, apps instaladas, localizações visitadas e muito mais. Quanto maior a pegada, mais fácil é para criminosos ou empresas perfilá-lo.'
            },
            {
              question: 'O que significa o "direito ao esquecimento" no contexto de protecção de dados?',
              options: JSON.stringify(['O direito de apagar mensagens enviadas por engano', 'O direito de uma pessoa solicitar a eliminação dos seus dados pessoais de bases de dados e motores de busca', 'O direito de usar internet de forma anónima', 'O direito de não ter redes sociais']),
              correctIndex: 1,
              explanation: 'O direito ao esquecimento permite que uma pessoa solicite que as empresas e motores de busca (como Google) removam os seus dados pessoais dos resultados de pesquisa. É um direito fundamental na Lei de Protecção de Dados.'
            },
            {
              question: 'Se descobrir que os seus dados pessoais foram expostos numa violação de dados (data breach), qual deve ser o primeiro passo?',
              options: JSON.stringify(['Apagar todas as suas redes sociais imediatamente', 'Mudar imediatamente as senhas de todas as contas afectadas e activar 2FA', 'Esperar que a empresa responsável resolva o problema', 'Ligar para a Polícia antes de tomar qualquer outra acção']),
              correctIndex: 1,
              explanation: 'Tempo é essencial numa violação de dados. O primeiro passo é mudar as senhas de todas as contas potencialmente afectadas e activar verificação em duas etapas. Isto impede que os criminosos usem os dados roubados para aceder às suas contas.'
            },
            {
              question: 'Qual destas informações é considerada "dado sensível" e requer protecção especial por lei?',
              options: JSON.stringify(['Nome completo e endereço de e-mail', 'Origem étnica, saúde, opiniões políticas e dados biométricos', 'Número de telefone e endereço residencial', 'Histórico de compras e preferências de navegação']),
              correctIndex: 1,
              explanation: 'Dados sensíveis incluem origem racial ou étnica, opiniões políticas, dados de saúde, orientação sexual, dados biométricos (impressão digital, reconhecimento facial) e convicções religiosas. A legislação exige protecção reforçada para estes dados.'
            }
          ]
        }
      }
    ];

    for (const quiz of quizzes) {
      if (!existingQuizTitles.has(quiz.title)) {
        await db.quiz.create({ data: quiz });
        seeded = true;
      }
    }

    // Seed Community Posts
    const communityPosts = [
      {
        authorName: 'Maria Silva',
        title: 'Recebi mensagem falsa da Unitel - Cuidado!',
        content: 'Acabei de receber uma mensagem SMS dizendo que ganhei dados grátis e pedindo para clicar num link. Não cliquei porque me lembrei das dicas do CIDSeguro. Quero alertar todos!',
        category: 'alerta'
      },
      {
        authorName: 'João Pereira',
        title: 'Dica: Como configurei a 2FA no meu email',
        content: 'Depois de ler o artigo sobre verificação em duas etapas, configurei no meu Gmail e foi super simples! Agora sinto-me muito mais seguro. Recomendo a todos.',
        category: 'dica'
      },
      {
        authorName: 'Ana Costa',
        title: 'Golpe de emprego no Facebook',
        content: 'Vi uma oferta de emprego no Facebook com salário de 500.000 Kz para trabalho simples em casa. Pediam 5.000 Kz para "material de trabalho". Claramente um golpe. Alguém mais viu isto?',
        category: 'alerta'
      },
      {
        authorName: 'Carlos Mendes',
        title: 'Como proteger crianças na internet',
        content: 'Sou pai de dois adolescentes e estou preocupado com o tempo que passam online. Que medidas práticas posso tomar sem ser muito restritivo? Alguém tem experiência?',
        category: 'pergunta'
      }
    ];

    if (existingPosts === 0) {
      for (const post of communityPosts) {
        await db.communityPost.create({ data: post });
        seeded = true;
      }
    }

    // Seed Notifications
    const notifications = [
      { title: 'Alerta: Novo golpe de phishing detectado', content: 'Foi detectada uma nova campanha de phishing que se passa pela Unitel. A mensagem promete dados grátis e contém um link malicioso.', type: 'alerta', priority: 'alta' },
      { title: 'Novo curso disponível na Academia', content: 'O curso "Segurança Digital para Iniciantes" está agora disponível. Complete-o para ganhar 50 pontos!', type: 'academia', priority: 'media' },
      { title: 'Dica do dia', content: 'Active a verificação em duas etapas no seu Multicaixa Express para maior segurança nas suas transacções.', type: 'dica', priority: 'baixa' },
      { title: 'Actualização de segurança', content: 'Recomendamos actualizar o seu telemóvel com as últimas correcções de segurança disponíveis.', type: 'info', priority: 'media' },
      { title: 'Webinar: Cibersegurança para PMEs', content: 'Junte-se ao nosso webinar gratuito sobre como proteger o seu pequeno negócio. Sexta-feira às 15h.', type: 'evento', priority: 'media' },
      { title: 'Estatísticas do mês', content: 'Foram bloqueados mais de 1.200 links maliciosos em Angola este mês. A sua contribuição é importante!', type: 'info', priority: 'baixa' }
    ];

    const existingNotifs = await db.notification.count();
    if (existingNotifs === 0) {
      for (const notif of notifications) {
        await db.notification.create({ data: notif });
        seeded = true;
      }
    }

    return NextResponse.json({
      success: true,
      message: seeded ? 'Dados adicionados com sucesso' : 'Dados já existem',
      seeded,
      stats: {
        articles: articles.length,
        tips: tips.length,
        quizzes: quizzes.length,
        communityPosts: communityPosts.length,
        notifications: notifications.length
      }
    });

  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Erro ao semear dados' }, { status: 500 });
  }
}