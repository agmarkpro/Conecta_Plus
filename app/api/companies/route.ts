import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    let companies = database.getAllCompanies()

    // Filtrar por categoria
    if (category && category !== 'all') {
      companies = database.getCompaniesByCategory(category)
    }

    // Filtrar por busca
    if (search) {
      companies = database.searchCompanies(search)
    }

    // Paginação
    const total = companies.length
    const paginatedCompanies = companies.slice(offset, offset + limit)

    // Transformar dados para o frontend
    const transformedCompanies = paginatedCompanies.map(company => ({
      id: company.id,
      name: company.nomeFantasia || company.razaoSocial,
      category: company.descricaoCnae,
      address: `${company.endereco.logradouro}, ${company.endereco.numero} - ${company.endereco.bairro}`,
      phone: company.contato.telefone1,
      email: company.contato.email,
      isOpen: company.isActive,
      categoryId: company.categoria
    }))

    return NextResponse.json({
      companies: transformedCompanies,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })

  } catch (error) {
    console.error('Erro ao buscar empresas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}