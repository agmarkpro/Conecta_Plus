import { NextResponse } from 'next/server'
import { database } from '@/lib/database'

export async function GET() {
  try {
    const categories = database.getAllCategories()
    const companies = database.getAllCompanies()

    // Adicionar contagem de empresas por categoria
    const categoriesWithCount = categories.map(category => ({
      ...category,
      count: companies.filter(company => company.categoria === category.id).length
    }))

    return NextResponse.json(categoriesWithCount)

  } catch (error) {
    console.error('Erro ao buscar categorias:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}