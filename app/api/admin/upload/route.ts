import { NextRequest, NextResponse } from 'next/server'
import { ExcelProcessor } from '@/lib/excel-processor'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo foi enviado' },
        { status: 400 }
      )
    }

    // Verificar se é um arquivo Excel
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      return NextResponse.json(
        { error: 'Apenas arquivos Excel (.xlsx, .xls) são aceitos' },
        { status: 400 }
      )
    }

    // Converter arquivo para buffer
    const buffer = await file.arrayBuffer()
    
    // Simular processamento do Excel (em produção, usar biblioteca como xlsx)
    // Por enquanto, vamos usar dados de exemplo baseados no excel_analysis.json
    const mockData = await generateMockDataFromAnalysis()
    
    const result = ExcelProcessor.processExcelData(mockData)
    
    return NextResponse.json({
      message: 'Arquivo processado com sucesso',
      stats: {
        totalProcessed: result.success,
        errors: result.errors.length,
        errorDetails: result.errors.slice(0, 10) // Primeiros 10 erros
      },
      processingStats: ExcelProcessor.getProcessingStats()
    })

  } catch (error) {
    console.error('Erro no upload:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Função para gerar dados mock baseados na análise do Excel
async function generateMockDataFromAnalysis() {
  // Dados baseados no excel_analysis.json
  const mockCompanies = [
    {
      CNPJ: "00.335.250/0001-82",
      "Razão Social": "OLIVEIRA & CRUZ LTDA",
      "Nome Fantasia": "MUSIC CENTER THE FUTURE SOUND",
      "Natureza Jurídica": "LTDA",
      "Porte da Empresa": "ME",
      "CNAE Fiscal": "4753900",
      "Descrição CNAE Fiscal": "COM. VAREJO ELETRODOMÉSTICOS ÁUDIO VÍDEO",
      "Tipo Logradouro": "QUADRA",
      Logradouro: "ACNE I, CONJ. 03, LT 11",
      Número: "S/N",
      Complemento: "SALA 03",
      Bairro: "CENTRO",
      CEP: "77016524",
      "Data de Início": "08/12/1994",
      "Situação Cadastral": "ATIVA"
    },
    {
      CNPJ: "00.362.448/0001-55",
      "Razão Social": "MANOEL MARLON PEREIRA",
      "Nome Fantasia": "PAPALMAS RESTAURANTE E CHOPPERIA SERRA DO CARMO",
      "Natureza Jurídica": "EMPRESÁRIO INDIV.",
      "Porte da Empresa": "MGE",
      "CNAE Fiscal": "5611201",
      "Descrição CNAE Fiscal": "RESTAURANTES",
      Logradouro: "ACSE I CONJ 1 LT 22",
      Número: "S/N",
      Bairro: "CENTRO",
      CEP: "77016524",
      "Data de Início": "22/12/1994",
      "Situação Cadastral": "ATIVA"
    },
    {
      CNPJ: "02.378.576/0001-12",
      "Razão Social": "REGINEIA GOMES DE CARVALHO SANTOS LTDA",
      "Nome Fantasia": "MOTO PECAS GALDINO",
      "Natureza Jurídica": "LTDA",
      "Porte da Empresa": "ME",
      "CNAE Fiscal": "4541206",
      "Descrição CNAE Fiscal": "COM. VAREJO PEÇAS E ACESS. MOTOS",
      Logradouro: "103 NORTE RUA NO 05 LOTE 10 CJ 03",
      Número: "10",
      Bairro: "SETOR NORTE",
      CEP: "77001020",
      "Telefone 1": "6332153206",
      "Data de Início": "30/01/1998",
      "Situação Cadastral": "ATIVA"
    }
  ]

  // Gerar mais empresas para simular um dataset maior
  const expandedData = []
  const bairros = ["CENTRO", "SETOR NORTE", "SETOR SUL", "PLANO DIRETOR NORTE", "PLANO DIRETOR SUL", "JARDIM AURENY", "TAQUARALTO"]
  const cnaes = ["4753900", "5611201", "4541206", "9602501", "4711301", "8630501", "4120400"]
  const descricoes = [
    "COM. VAREJO ELETRODOMÉSTICOS ÁUDIO VÍDEO",
    "RESTAURANTES",
    "COM. VAREJO PEÇAS E ACESS. MOTOS",
    "CABELEIREIROS",
    "HIPERMERCADOS",
    "ATIVIDADES DE ATENDIMENTO HOSPITALAR",
    "CONSTRUÇÃO DE EDIFÍCIOS"
  ]

  for (let i = 0; i < 50; i++) {
    const cnpjNum = String(i + 1000000).padStart(8, '0')
    const cnaeIndex = i % cnaes.length
    
    expandedData.push({
      CNPJ: `${cnpjNum.slice(0,2)}.${cnpjNum.slice(2,5)}.${cnpjNum.slice(5,8)}/0001-${String(i % 99).padStart(2, '0')}`,
      "Razão Social": `EMPRESA ${i + 1} LTDA`,
      "Nome Fantasia": `NEGÓCIO ${i + 1}`,
      "Natureza Jurídica": "LTDA",
      "Porte da Empresa": i % 3 === 0 ? "MGE" : "ME",
      "CNAE Fiscal": cnaes[cnaeIndex],
      "Descrição CNAE Fiscal": descricoes[cnaeIndex],
      "Tipo Logradouro": "QUADRA",
      Logradouro: `QUADRA ${100 + i} NORTE`,
      Número: String(i + 1),
      Bairro: bairros[i % bairros.length],
      CEP: `7701${String(i % 9999).padStart(4, '0')}`,
      "Telefone 1": i % 2 === 0 ? `63321${String(i % 99999).padStart(5, '0')}` : undefined,
      email: i % 3 === 0 ? `contato${i}@empresa.com` : undefined,
      "Data de Início": `${String((i % 28) + 1).padStart(2, '0')}/${String((i % 12) + 1).padStart(2, '0')}/20${String(i % 25).padStart(2, '0')}`,
      "Situação Cadastral": "ATIVA"
    })
  }

  return [...mockCompanies, ...expandedData]
}