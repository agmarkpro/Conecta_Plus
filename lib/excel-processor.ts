import { Company, database } from './database'

export interface ExcelRow {
  CNPJ: string
  'Razão Social': string
  'Nome Fantasia'?: string
  'Natureza Jurídica': string
  'Porte da Empresa': string
  'CNAE Fiscal': string
  'Descrição CNAE Fiscal': string
  'Tipo Logradouro'?: string
  Logradouro: string
  Número: string
  Complemento?: string
  Bairro: string
  CEP: string
  'Telefone 1'?: string
  'Telefone 2'?: string
  email?: string
  'Data de Início': string
  'Situação Cadastral': string
}

export class ExcelProcessor {
  static processExcelData(data: ExcelRow[]): { success: number; errors: string[] } {
    const errors: string[] = []
    let success = 0

    // Limpar dados existentes
    database.clearCompanies()

    data.forEach((row, index) => {
      try {
        const company = this.convertRowToCompany(row)
        database.addCompany(company)
        success++
      } catch (error) {
        errors.push(`Linha ${index + 1}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
      }
    })

    return { success, errors }
  }

  private static convertRowToCompany(row: ExcelRow): Company {
    // Validações básicas
    if (!row.CNPJ || !row['Razão Social']) {
      throw new Error('CNPJ e Razão Social são obrigatórios')
    }

    const cnae = String(row['CNAE Fiscal']).padStart(7, '0')
    const categoria = database.getCategoryByCnae(cnae)

    // Gerar ID único baseado no CNPJ
    const id = row.CNPJ.replace(/[^\d]/g, '')

    const company: Company = {
      id,
      cnpj: row.CNPJ,
      razaoSocial: row['Razão Social'],
      nomeFantasia: row['Nome Fantasia'] || row['Razão Social'],
      naturezaJuridica: row['Natureza Jurídica'],
      porte: row['Porte da Empresa'],
      cnae,
      descricaoCnae: row['Descrição CNAE Fiscal'],
      categoria,
      endereco: {
        tipoLogradouro: row['Tipo Logradouro'],
        logradouro: row.Logradouro,
        numero: row.Número || 'S/N',
        complemento: row.Complemento,
        bairro: row.Bairro,
        cep: String(row.CEP).padStart(8, '0')
      },
      contato: {
        telefone1: row['Telefone 1'],
        telefone2: row['Telefone 2'],
        email: row.email
      },
      dataInicio: row['Data de Início'],
      situacao: row['Situação Cadastral'],
      isActive: row['Situação Cadastral'] === 'ATIVA',
      createdAt: new Date()
    }

    return company
  }

  static validateExcelStructure(headers: string[]): boolean {
    const requiredHeaders = [
      'CNPJ',
      'Razão Social',
      'Natureza Jurídica',
      'Porte da Empresa',
      'CNAE Fiscal',
      'Descrição CNAE Fiscal',
      'Logradouro',
      'Bairro',
      'CEP',
      'Data de Início',
      'Situação Cadastral'
    ]

    return requiredHeaders.every(header => headers.includes(header))
  }

  static getProcessingStats() {
    const companies = database.getAllCompanies()
    const categories = database.getAllCategories()
    
    const stats = {
      totalCompanies: companies.length,
      activeCompanies: companies.filter(c => c.isActive).length,
      categoriesUsed: new Set(companies.map(c => c.categoria)).size,
      totalCategories: categories.length,
      companiesByCategory: {} as Record<string, number>
    }

    // Contar empresas por categoria
    categories.forEach(category => {
      stats.companiesByCategory[category.name] = companies.filter(
        c => c.categoria === category.id
      ).length
    })

    return stats
  }
}