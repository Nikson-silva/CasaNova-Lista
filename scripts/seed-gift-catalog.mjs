import { createHash } from "node:crypto"
import { readdir, readFile } from "node:fs/promises"
import path from "node:path"

import { createClient } from "@supabase/supabase-js"

const BUCKET = "gifts"
const STORAGE_PREFIX = "products"
const OFFICIAL_CATEGORIES = ["Cozinha", "Sala", "Quarto", "Banheiro", "Casal"]

const gifts = [
  {
    name: "Pix do Indeciso",
    category: null,
    kind: "normal",
    description:
      "Para quem não consegue decidir entre os itens da lista ou só quer mandar o dinheiro direto.",
    estimatedPrice: null,
    imageName: "Pix.jpg",
    recommendationUrl: null,
  },
  {
    name: "Mixer Vertical Turbo Chef Elgin 3 em 1 200W Preto 220v",
    category: "Cozinha",
    kind: "normal",
    description:
      "Mixer da cor preta, preferência o item que está na imagem, porém tudo bem se for de outra marca, contanto que seja preto ^^",
    estimatedPrice: 100,
    imageName: "Mixer.jpg",
    recommendationUrl: "https://a.co/d/0esufDBB",
  },
  {
    name: "Jogo de Panelas Tramontina Turim em Alumínio com Revestimento Interno e Externo em Antiaderente Starflon Max Preto 10 Peças",
    category: "Cozinha",
    kind: "normal",
    description:
      "Jogo de Panelas da marca Tramontina Turim antiaderente que seja preto.",
    estimatedPrice: 380,
    imageName: "Jogo de Panelas.jpg",
    recommendationUrl: "https://a.co/d/0gQ2sRRB",
  },
  {
    name: "Jogo de Utensílios Tramontina Utilità com Lâminas em Aço Inox e Cabos em Polipropileno Preto 10 Peças",
    category: "Cozinha",
    kind: "normal",
    description: "Jogo de utensílios da marca Tramontina da cor preta.",
    estimatedPrice: 150,
    imageName: "Jogo de utencilios.jpg",
    recommendationUrl: "https://a.co/d/03H8JI4c",
  },
  {
    name: "Panela de Pressão Tramontina Vancouver Effect em Alumínio com Revestimento Interno e Externo em Antiaderente Starflon Max Preto 20 cm 4,5 L",
    category: "Cozinha",
    kind: "normal",
    description: "Panela de Pressão da marca Tramontina, cor preta.",
    estimatedPrice: 180,
    imageName: "Panela de Pressao.jpg",
    recommendationUrl: "https://a.co/d/05s0bowy",
  },
  {
    name: "Panelux Cuscuzeiro 18 Magnific Grafite Antiaderente",
    category: "Cozinha",
    kind: "normal",
    description:
      "Cuscuzeira Antiaderente Preta, de preferência a que está na imagem.",
    estimatedPrice: 80,
    imageName: "Cuscuzeira.jpg",
    recommendationUrl: "https://a.co/d/0bDuDsEL",
  },
  {
    name: "Sanduicheira Elétrica Cadence Click - 220V",
    category: "Cozinha",
    kind: "normal",
    description: "Sanduicheira Elétrica da marca Cadence Preta.",
    estimatedPrice: 90,
    imageName: "Sanduicheira.jpg",
    recommendationUrl: "https://a.co/d/0d2F5yjA",
  },
  {
    name: "Liquidificador 1400 Full Oster Preto 3,2L - 220V",
    category: "Cozinha",
    kind: "normal",
    description: "Liquidificador da marca Oster Preto 3,2L.",
    estimatedPrice: 150,
    imageName: "Liquidificador.jpg",
    recommendationUrl: "https://a.co/d/00hX8k7P",
  },
  {
    name: "Jogo de Facas 6 Peças, Tramontina, Plenus 23498015, Preto",
    category: "Cozinha",
    kind: "normal",
    description: "Jogo de Facas da Tramontina Preto.",
    estimatedPrice: 170,
    imageName: "Jogo de Facas.jpg",
    recommendationUrl: "https://a.co/d/01BD3FH5",
  },
  {
    name: "Kit 15 Potes Herméticos para Alimentos com Tampa e Trava - Vedação Silicone - Organizador de Mantimentos e Armário de Cozinha - Livre de BPA - Material Premium.",
    category: "Cozinha",
    kind: "normal",
    description:
      "Kit de Potes Herméticos, não importa a marca, que tenha vedação Silicone.",
    estimatedPrice: 100,
    imageName: "Potes Hermeticos.jpg",
    recommendationUrl: "https://a.co/d/06chTVMt",
  },
  {
    name: "Jogo da Marinex Conjunto de Travessas 7 peças Variadas em Vidro Temperado próprias P/Forno",
    category: "Cozinha",
    kind: "normal",
    description: "Conjunto de Travessas 7 peças, não importa a marca.",
    estimatedPrice: 100,
    imageName: "Conjunto Travessa.jpg",
    recommendationUrl: "https://a.co/d/02ojNJ4P",
  },
  {
    name: "2 Jogos com 6 Copo de Vidro Grande Bristol Long Drink 410ml - Kit 6 Unidades - Multi Facetado - Elegante, Robusto Vidro 4mm Premium",
    category: "Cozinha",
    kind: "normal",
    description:
      "Jogo de Copos, de preferência o formato que está na imagem, mas fica a sua escolha.",
    estimatedPrice: 60,
    imageName: "Jogo de copos.jpg",
    recommendationUrl: "https://a.co/d/0d6HEaS2",
  },
  {
    name: "Jogo de Talheres Faqueiro Inox 24 Peças Búzios Tramontina",
    category: "Cozinha",
    kind: "normal",
    description: "Jogo de talheres inox da marca Tramontina.",
    estimatedPrice: 80,
    imageName: "Jogo de talheres.jpg",
    recommendationUrl: "https://a.co/d/05YxjVzf",
  },
  {
    name: "Escorredor de Louça Mak Inox 2 Andares Premium em Aço Inoxidável para 20 Pratos, com Porta-Talheres Removível, Design Moderno e Antiferrugem - Ideal para Cozinhas Modernas e Famílias Grandes",
    category: "Cozinha",
    kind: "normal",
    description: "Escorredor Inox, não importa a marca.",
    estimatedPrice: 85,
    imageName: "Escorredor Inox.jpg",
    recommendationUrl: "https://a.co/d/0azJgsc9",
  },
  {
    name: "Bebedouro Britânia BBE12P 10L ou 20L Sistema Perfurador Bivolt",
    category: "Cozinha",
    kind: "normal",
    description:
      "Bebedouro da marca Britânia da cor preto de preferência 20L.",
    estimatedPrice: 350,
    imageName: "Bebedouro.jpg",
    recommendationUrl: "https://a.co/d/0b18sYba",
  },
  {
    name: "Cortina Blackout/Blecaute Em Tecido Corta Luz Para Sala, Quarto e Escritorio 3,00M x 2,50M | Admirare (3,00M X 2,50M, Cinza Escuro)",
    category: "Sala",
    kind: "normal",
    description: "Cortina Blackout da cor Cinza, 3m x 2m.",
    estimatedPrice: 150,
    imageName: "Cortina.jpg",
    recommendationUrl: "https://a.co/d/02ZwOMbO",
  },
  {
    name: "Electrolux Menalux MOP Giratório Inox com Refil Extra de Microfibra",
    category: "Sala",
    kind: "normal",
    description:
      "MOP Giratório da cor branca ou cinza, não importa a marca.",
    estimatedPrice: 100,
    imageName: "MOP.jpg",
    recommendationUrl: "https://a.co/d/0jlxIoYS",
  },
  {
    name: "Multimóveis Painel Nairóbi para TV de até 60 Polegadas com Nicho e 4 Prateleiras - Preto",
    category: "Sala",
    kind: "normal",
    description: "Painel Nairóbi para TV, Cor preta.",
    estimatedPrice: 350,
    imageName: "Painel.jpg",
    recommendationUrl: "https://a.co/d/0g0tZYfi",
  },
  {
    name: "Feandrea Árvore para Gatos, Condomínio para Gatos 115 cm, Rampa Arranhadora, Cinza Claro BRPCT141W01V1 | Torre para gatos de 114 cm, condomínio de pelúcia com poste para arranhar, rampa, poleiro, caverna espaçosa, cinza claro",
    category: "Sala",
    kind: "normal",
    description: "Árvore para gato, para Nida brincar ^^",
    estimatedPrice: 380,
    imageName: "Torre pra gato.jpg",
    recommendationUrl: "https://a.co/d/01zfh4YU",
  },
  {
    name: "Jogo de Cama 400 Fios Percal Com Lençol de Cima e Aba Americana, Antiácaro, Anti-pilling com Toque Macio Elástico Hotel (Chumbo,Queen)",
    category: "Quarto",
    kind: "normal",
    description: "Jogo de Cama, cor a escolha.",
    estimatedPrice: 95,
    imageName: "Jogo de cama Chumbo.jpg",
    recommendationUrl: "https://a.co/d/01vRvv4i",
  },
  {
    name: "Jogo de Toalha Completo 5 Pçs de Banho, Rosto e Piso Noblesse (Branco)",
    category: "Quarto",
    kind: "normal",
    description: "Jogo de toalha, cor branco, não importa a marca.",
    estimatedPrice: 180,
    imageName: "toalha.jpg",
    recommendationUrl: "https://a.co/d/0g86OWxm",
  },
  {
    name: "220V Ferro de Passar Roupa, Passadeira a Vapor, Ferro a Vapor, Vaporizador de Roupas, Ferro de Passar, Steamer, Ferro a Vapor Portatil",
    category: "Quarto",
    kind: "normal",
    description: "Ferro de passar, não importa a marca, nem o modelo.",
    estimatedPrice: 150,
    imageName: "Ferro de passar.jpg",
    recommendationUrl: "https://a.co/d/0cU52MxI",
  },
  {
    name: "Smartwatch",
    category: "Casal",
    kind: "normal",
    description: "Queria um relogin Smartwatch ^^",
    estimatedPrice: 250,
    imageName: "relogio.jpg",
    recommendationUrl: null,
  },
  {
    name: "GA.MA ITALY Secador de Cabelo Gama Lichia Ceramic Ion 2100W 127V",
    category: "Casal",
    kind: "normal",
    description: "Secador de cabelo com Difusor de cachos.",
    estimatedPrice: 150,
    imageName: "Secador.jpg",
    recommendationUrl: "https://a.co/d/0hWprKHD",
  },
  {
    name: "Mesa para Escritório Para o Noivo Office Estilo Industrial 1,50m Kuadra, Compace",
    category: "Quarto",
    kind: "normal",
    description: "Mesa de escritório para o noivo.",
    estimatedPrice: 400,
    imageName: "Mesa escritorio.jpg",
    recommendationUrl: "https://a.co/d/0iWxFy5R",
  },
  {
    name: "Mesa para Escritório para Noiva Office Estilo Industrial 1,50m Kuadra, Compace",
    category: "Quarto",
    kind: "normal",
    description: "Mesa de escritório para a noiva.",
    estimatedPrice: 400,
    imageName: "Mesa escritorio.jpg",
    recommendationUrl: "https://a.co/d/0iWxFy5R",
  },
  {
    name: "Estante Multiuso Livreiro Domus 2 Módulos e 6 Prateleiras Organizadoras (Nature/Preto)",
    category: "Quarto",
    kind: "normal",
    description:
      "Estante Multiuso, igual da imagem para combinar com a mesa de escritório.",
    estimatedPrice: 250,
    imageName: "Estante.jpg",
    recommendationUrl: "https://a.co/d/06GcwMYW",
  },
  {
    name: "Conjunto Sala de Jantar 4 Cadeiras Charlotte Carraro (Preto)",
    category: null,
    kind: "crazy",
    description: "Conjunto de Sala de jantar Mesa e cadeiras.",
    estimatedPrice: 900,
    imageName: "Mesa de Jantar.jpg",
    recommendationUrl: "https://a.co/d/015U9l1s",
  },
  {
    name: "PlayStation®5 Slim Digital 825GB – Pacote ASTRO BOT e Gran Turismo 7",
    category: null,
    kind: "crazy",
    description:
      "PAPO DE MALUCO, tu me dá um PS5, tá bem querendo meu bumbum. E ói que eu dou viu :p Assinado Nikson.",
    estimatedPrice: 4200,
    imageName: "PS5.jpg",
    recommendationUrl: "https://a.co/d/0ag0UiEq",
  },
  {
    name: "Combo Volante, Pedais e Cambio Logitech G29 SE Driving Force para PS5, PS4, PS3 e PC",
    category: null,
    kind: "crazy",
    description:
      "Nem gosto tanto assim de jogo de carro, mas com um desse eu começaria a gostar kkkk.",
    estimatedPrice: 2400,
    imageName: "Volante.jpg",
    recommendationUrl: "https://a.co/d/0crMYpsH",
  },
  {
    name: "Geladeira Electrolux Frost Free 490L Efficient com AutoSense Inverse Inox Look (IB7S) 127V",
    category: null,
    kind: "crazy",
    description:
      '"Põe uma geladeira ai pra mim, vai me negar uma geladeira? Põe uma geladeira ai pra mim"',
    estimatedPrice: 4000,
    imageName: "Geladeira.jpg",
    recommendationUrl: "https://a.co/d/0f6WyfXl",
  },
  {
    name: "Fogão 4 Bocas Dako Supreme Black Glass com Timer Digital e Mesa de Vidro Preto Bivolt",
    category: null,
    kind: "crazy",
    description: "O fogão sendo preto e de 4 bocas, tá valendo kkk",
    estimatedPrice: 1400,
    imageName: "Fogao.jpg",
    recommendationUrl: "https://a.co/d/06FYiTi7",
  },
  {
    name: "Nintendo Switch ou Switch 2",
    category: null,
    kind: "crazy",
    description: "Um videogamezinho pra dona Letícia se viciar neste mundo.",
    estimatedPrice: 2000,
    imageName: "switch.jpg",
    recommendationUrl: "https://a.co/d/0a51Pq91",
  },
  {
    name: "Guarda-roupa Casal com Espelho 6 Portas 4 Gavetas Araplac Braga",
    category: null,
    kind: "crazy",
    description:
      "Guarda Roupa preto, com espelhos, que tenha no máximo a tamanho deste.",
    estimatedPrice: 1300,
    imageName: "guarda roupa.jpg",
    recommendationUrl: "https://a.co/d/0dfeh4Wt",
  },
  {
    name: 'Monitor LG UltraGear™ 27G411A-B 27",FHD, 144Hz, 1ms (MBR), NVIDIA G-SYNC, AMD FreeSync, HDR10',
    category: null,
    kind: "crazy",
    description: "Monitor pra o noivo, pois o dele quebrou :C",
    estimatedPrice: 800,
    imageName: "Monitor.jpg",
    recommendationUrl: "https://a.co/d/0b8BZobg",
  },
  {
    name: "Máquina de Lavar Panasonic 15kg Titânio 127v NA-F150B1T",
    category: null,
    kind: "crazy",
    description: "Maquina de lavar pra deixar as roupa xerozinha.",
    estimatedPrice: 2000,
    imageName: "Maquina de lavar.jpg",
    recommendationUrl: "https://a.co/d/03AvAhOQ",
  },
  {
    name: "Poltrona Do Papai Reclinável Suede Veludo Estoril Cinza | Suede, Veludo",
    category: null,
    kind: "crazy",
    description: "Poltrona só pra se amostrar.",
    estimatedPrice: 800,
    imageName: "Poltrona.jpg",
    recommendationUrl: "https://a.co/d/07EsL6Yj",
  },
]

function fail(message) {
  throw new Error(message)
}

function deterministicUuid(value) {
  const hash = createHash("sha256")
    .update(`CasaNova-Lista:${value}`)
    .digest("hex")
  const variant = ((Number.parseInt(hash[16], 16) & 0x3) | 0x8).toString(16)

  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-5${hash.slice(13, 16)}-${variant}${hash.slice(17, 20)}-${hash.slice(20, 32)}`
}

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex")
}

function assertUnique(values, label) {
  if (new Set(values).size !== values.length) {
    fail(`${label} contém valores duplicados.`)
  }
}

function assertJpeg(buffer, imageName) {
  const isJpeg =
    buffer.length >= 4 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer.at(-2) === 0xff &&
    buffer.at(-1) === 0xd9

  if (!isJpeg) {
    fail(`${imageName} não é um JPEG válido.`)
  }
}

async function getAllGifts(supabase) {
  const { data, error } = await supabase
    .from("gifts")
    .select(
      "id,name,description,category_id,estimated_price,image_path,recommendation_url,kind,display_order,status",
    )
    .order("display_order", { ascending: true })

  if (error) {
    fail(`Falha ao consultar gifts: ${error.message}`)
  }

  return data
}

function createRows(categoriesByName) {
  return gifts.map((gift, index) => ({
    id: deterministicUuid(`${gift.kind}:${gift.name}`),
    name: gift.name,
    description: gift.description,
    category_id: gift.category
      ? (categoriesByName.get(gift.category) ?? fail(`Categoria ausente: ${gift.category}`))
      : null,
    estimated_price: gift.estimatedPrice,
    image_path: `${STORAGE_PREFIX}/${gift.imageName}`,
    recommendation_url: gift.recommendationUrl,
    kind: gift.kind,
    display_order: index + 1,
    status: "available",
  }))
}

function validateExistingCatalog(existingGifts, expectedRows) {
  if (existingGifts.length !== expectedRows.length) {
    fail(
      `A tabela gifts contém ${existingGifts.length} registros inesperados; esperado 0 ou ${expectedRows.length}.`,
    )
  }

  const existingById = new Map(existingGifts.map((gift) => [gift.id, gift]))

  for (const expected of expectedRows) {
    const existing = existingById.get(expected.id)

    if (!existing) {
      fail(`Gift esperado não encontrado na reexecução: ${expected.name}`)
    }

    for (const field of [
      "name",
      "description",
      "category_id",
      "estimated_price",
      "image_path",
      "recommendation_url",
      "kind",
      "display_order",
    ]) {
      if (existing[field] !== expected[field]) {
        fail(`Gift divergente na reexecução: ${expected.name} (${field}).`)
      }
    }
  }
}

async function main() {
  const imagesDirectory = process.argv[2]
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY

  if (!imagesDirectory) {
    fail("Informe o diretório das imagens como primeiro argumento.")
  }

  if (!supabaseUrl || !supabaseSecretKey) {
    fail("NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SECRET_KEY são obrigatórias.")
  }

  if (gifts.length !== 37) {
    fail(`Definição inválida: ${gifts.length} gifts; esperado 37.`)
  }

  assertUnique(gifts.map((gift) => gift.name), "A lista de gifts")

  const normalCount = gifts.filter((gift) => gift.kind === "normal").length
  const crazyCount = gifts.filter((gift) => gift.kind === "crazy").length
  const imageNames = [...new Set(gifts.map((gift) => gift.imageName))]

  if (normalCount !== 27 || crazyCount !== 10 || imageNames.length !== 36) {
    fail(
      `Definição inválida: ${normalCount} normal, ${crazyCount} crazy e ${imageNames.length} imagens distintas.`,
    )
  }

  const directoryEntries = await readdir(imagesDirectory, { withFileTypes: true })
  const localJpegs = directoryEntries
    .filter((entry) => entry.isFile() && path.extname(entry.name).toLowerCase() === ".jpg")
    .map((entry) => entry.name)
    .sort()
  const missingImages = imageNames.filter((imageName) => !localJpegs.includes(imageName))
  const unexpectedImages = localJpegs.filter((imageName) => !imageNames.includes(imageName))

  if (missingImages.length || unexpectedImages.length || localJpegs.length !== 36) {
    fail(
      `Auditoria de imagens falhou. Ausentes: ${missingImages.join(", ") || "nenhuma"}. Inesperadas: ${unexpectedImages.join(", ") || "nenhuma"}.`,
    )
  }

  const imageBuffers = new Map()

  for (const imageName of imageNames) {
    const buffer = await readFile(path.join(imagesDirectory, imageName))
    assertJpeg(buffer, imageName)
    imageBuffers.set(imageName, buffer)
  }

  const supabase = createClient(supabaseUrl, supabaseSecretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const [categoriesResult, reservationsResult, bucketResult] = await Promise.all([
    supabase
      .from("categories")
      .select("id,name,display_order", { count: "exact" })
      .order("display_order", { ascending: true }),
    supabase.from("reservations").select("id", { count: "exact", head: true }),
    supabase.storage.listBuckets(),
  ])

  if (categoriesResult.error) {
    fail(`Falha ao consultar categorias: ${categoriesResult.error.message}`)
  }

  if (reservationsResult.error) {
    fail(`Falha ao consultar reservations: ${reservationsResult.error.message}`)
  }

  const categoryNames = categoriesResult.data.map((category) => category.name)

  if (
    categoriesResult.count !== 5 ||
    categoryNames.some((name, index) => name !== OFFICIAL_CATEGORIES[index])
  ) {
    fail(`Categorias divergentes: ${categoryNames.join(", ")}`)
  }

  const bucket = bucketResult.data?.find((item) => item.name === BUCKET)

  if (bucketResult.error || !bucket || !bucket.public) {
    fail("O bucket público gifts não está disponível.")
  }

  const categoriesByName = new Map(
    categoriesResult.data.map((category) => [category.name, category.id]),
  )
  const expectedRows = createRows(categoriesByName)
  const existingGifts = await getAllGifts(supabase)
  const isExistingCatalog = existingGifts.length > 0

  if (isExistingCatalog) {
    validateExistingCatalog(existingGifts, expectedRows)
  } else if (reservationsResult.count !== 0) {
    fail("Existem reservations sem catálogo; seed interrompido.")
  }

  const { data: storageObjects, error: storageListError } = await supabase.storage
    .from(BUCKET)
    .list(STORAGE_PREFIX, { limit: 1000, sortBy: { column: "name", order: "asc" } })

  if (storageListError) {
    fail(`Falha ao listar Storage: ${storageListError.message}`)
  }

  const existingObjectNames = new Set(storageObjects.map((object) => object.name))
  const uploaded = []
  const reused = []

  for (const imageName of imageNames) {
    const imagePath = `${STORAGE_PREFIX}/${imageName}`
    const localBuffer = imageBuffers.get(imageName)

    if (existingObjectNames.has(imageName)) {
      const { data, error } = await supabase.storage.from(BUCKET).download(imagePath)

      if (error) {
        fail(`Falha ao verificar ${imagePath}: ${error.message}`)
      }

      const remoteBuffer = Buffer.from(await data.arrayBuffer())

      if (sha256(remoteBuffer) !== sha256(localBuffer)) {
        fail(`O objeto existente ${imagePath} não corresponde ao arquivo local.`)
      }

      reused.push(imagePath)
      continue
    }

    const { error } = await supabase.storage.from(BUCKET).upload(imagePath, localBuffer, {
      cacheControl: "3600",
      contentType: "image/jpeg",
      upsert: false,
    })

    if (error) {
      fail(`Falha no upload de ${imagePath}: ${error.message}`)
    }

    uploaded.push(imagePath)
  }

  if (!isExistingCatalog) {
    const concurrentGifts = await getAllGifts(supabase)

    if (concurrentGifts.length !== 0) {
      fail("Gifts surgiram durante o upload; inserção interrompida.")
    }

    const { error } = await supabase.from("gifts").insert(expectedRows)

    if (error) {
      fail(`Falha ao inserir gifts: ${error.message}`)
    }
  }

  const [finalGifts, finalReservationsResult, finalObjectsResult] = await Promise.all([
    getAllGifts(supabase),
    supabase.from("reservations").select("id", { count: "exact", head: true }),
    supabase.storage
      .from(BUCKET)
      .list(STORAGE_PREFIX, { limit: 1000, sortBy: { column: "name", order: "asc" } }),
  ])

  validateExistingCatalog(finalGifts, expectedRows)

  if (finalReservationsResult.error || finalReservationsResult.count !== reservationsResult.count) {
    fail("A contagem de reservations mudou durante o seed.")
  }

  if (finalObjectsResult.error) {
    fail(`Falha na validação final do Storage: ${finalObjectsResult.error.message}`)
  }

  const finalObjectNames = new Set(finalObjectsResult.data.map((object) => object.name))
  const missingRemoteImages = imageNames.filter((imageName) => !finalObjectNames.has(imageName))

  if (missingRemoteImages.length) {
    fail(`Imagens ausentes no Storage: ${missingRemoteImages.join(", ")}`)
  }

  const pix = finalGifts.filter((gift) => gift.name === "Pix do Indeciso")
  const sharedDeskImageCount = finalGifts.filter(
    (gift) => gift.image_path === `${STORAGE_PREFIX}/Mesa escritorio.jpg`,
  ).length
  const categoryCounts = Object.fromEntries(
    OFFICIAL_CATEGORIES.map((categoryName) => {
      const categoryId = categoriesByName.get(categoryName)
      return [
        categoryName,
        finalGifts.filter((gift) => gift.category_id === categoryId).length,
      ]
    }),
  )

  if (
    finalGifts.length !== 37 ||
    finalGifts.filter((gift) => gift.kind === "normal").length !== 27 ||
    finalGifts.filter((gift) => gift.kind === "crazy").length !== 10 ||
    pix.length !== 1 ||
    pix[0].display_order !== 1 ||
    pix[0].kind !== "normal" ||
    pix[0].category_id !== null ||
    pix[0].estimated_price !== null ||
    pix[0].recommendation_url !== null ||
    sharedDeskImageCount !== 2 ||
    finalGifts.some((gift) => gift.kind === "crazy" && gift.category_id !== null) ||
    finalGifts.some(
      (gift) =>
        gift.kind === "normal" &&
        gift.name !== "Pix do Indeciso" &&
        gift.category_id === null,
    )
  ) {
    fail("A validação final do catálogo falhou.")
  }

  console.log(
    JSON.stringify(
      {
        insertedGifts: isExistingCatalog ? 0 : 37,
        totalGifts: finalGifts.length,
        normal: finalGifts.filter((gift) => gift.kind === "normal").length,
        crazy: finalGifts.filter((gift) => gift.kind === "crazy").length,
        categoryCounts,
        uncategorizedNormal: finalGifts.filter(
          (gift) => gift.kind === "normal" && gift.category_id === null,
        ).length,
        uncategorizedCrazy: finalGifts.filter(
          (gift) => gift.kind === "crazy" && gift.category_id === null,
        ).length,
        uploadedImages: uploaded,
        reusedCatalogImages: reused,
        storageObjectCount: finalObjectsResult.data.length,
        reservationsBefore: reservationsResult.count,
        reservationsAfter: finalReservationsResult.count,
        smartwatchRecommendationUrl:
          finalGifts.find((gift) => gift.name === "Smartwatch")
            ?.recommendation_url ?? null,
        pix: pix[0],
        sharedDeskImageCount,
      },
      null,
      2,
    ),
  )
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
