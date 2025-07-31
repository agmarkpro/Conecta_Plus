// Sistema de banco de dados em memória para o ConectaPlus
export interface Company {
  id: string
  cnpj: string
  razaoSocial: string
  nomeFantasia?: string
  naturezaJuridica: string
  porte: string
  cnae: string
  descricaoCnae: string
  categoria: string
  endereco: {
    tipoLogradouro?: string
    logradouro: string
    numero: string
    complemento?: string
    bairro: string
    cep: string
  }
  contato: {
    telefone1?: string
    telefone2?: string
    email?: string
  }
  dataInicio: string
  situacao: string
  isActive: boolean
  createdAt: Date
}

export interface Category {
  id: string
  name: string
  icon: string
  color: string
  cnaes: string[]
}

// Categorias baseadas nos CNAEs mais comuns
export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'alimentacao',
    name: 'Alimentação',
    icon: '🍕',
    color: 'bg-red-100 text-red-600',
    cnaes: ['5611201', '5611203', '5620101', '5620102', '4721102', '4722901']
  },
  {
    id: 'servicos',
    name: 'Serviços',
    icon: '🔧',
    color: 'bg-blue-100 text-blue-600',
    cnaes: ['9602501', '9602502', '7420001', '8230001', '7732201', '4313400']
  },
  {
    id: 'comercio',
    name: 'Comércio',
    icon: '🛍️',
    color: 'bg-green-100 text-green-600',
    cnaes: ['4753900', '4541206', '4789099', '4711301', '4712100', '4713002']
  },
  {
    id: 'saude',
    name: 'Saúde',
    icon: '🏥',
    color: 'bg-purple-100 text-purple-600',
    cnaes: ['8630501', '8630502', '8640201', '8650001', '4771701', '4773300']
  },
  {
    id: 'educacao',
    name: 'Educação',
    icon: '📚',
    color: 'bg-yellow-100 text-yellow-600',
    cnaes: ['8513900', '8520001', '8531700', '8532500', '8541400', '8542200']
  },
  {
    id: 'construcao',
    name: 'Construção',
    icon: '🏗️',
    color: 'bg-orange-100 text-orange-600',
    cnaes: ['4120400', '4212000', '4213800', '4222701', '4299501', '4311802']
  },
  {
    id: 'transporte',
    name: 'Transporte',
    icon: '🚗',
    color: 'bg-indigo-100 text-indigo-600',
    cnaes: ['4930201', '4930202', '4950700', '5030101', '5091201', '5099801']
  },
  {
    id: 'beleza',
    name: 'Beleza',
    icon: '💄',
    color: 'bg-pink-100 text-pink-600',
    cnaes: ['9602501', '9602502', '4772500', '4789004']
  }
]

// Banco de dados em memória
class InMemoryDatabase {
  private companies: Map<string, Company> = new Map()
  private categories: Map<string, Category> = new Map()

  constructor() {
    // Inicializar categorias padrão
    DEFAULT_CATEGORIES.forEach(category => {
      this.categories.set(category.id, category)
    })
  }

  // Empresas
  addCompany(company: Company): void {
    this.companies.set(company.id, company)
  }

  getCompany(id: string): Company | undefined {
    return this.companies.get(id)
  }

  getAllCompanies(): Company[] {
    return Array.from(this.companies.values())
  }

  getCompaniesByCategory(categoryId: string): Company[] {
    return Array.from(this.companies.values()).filter(
      company => company.categoria === categoryId
    )
  }

  searchCompanies(query: string): Company[] {
    const searchTerm = query.toLowerCase()
    return Array.from(this.companies.values()).filter(company => 
      company.nomeFantasia?.toLowerCase().includes(searchTerm) ||
      company.razaoSocial.toLowerCase().includes(searchTerm) ||
      company.descricaoCnae.toLowerCase().includes(searchTerm) ||
      company.endereco.bairro.toLowerCase().includes(searchTerm)
    )
  }

  clearCompanies(): void {
    this.companies.clear()
  }

  getCompaniesCount(): number {
    return this.companies.size
  }

  // Categorias
  getCategory(id: string): Category | undefined {
    return this.categories.get(id)
  }

  getAllCategories(): Category[] {
    return Array.from(this.categories.values())
  }

  addCategory(category: Category): void {
    this.categories.set(category.id, category)
  }

  // Utilitários
  getCategoryByCnae(cnae: string): string {
    for (const category of this.categories.values()) {
      if (category.cnaes.includes(cnae)) {
        return category.id
      }
    }
    return 'outros' // categoria padrão para CNAEs não mapeados
  }
}

export const database = new InMemoryDatabase()