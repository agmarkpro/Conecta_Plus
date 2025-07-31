import { NextResponse } from 'next/server'
import { ExcelProcessor } from '@/lib/excel-processor'
import { database } from '@/lib/database'

export async function GET() {
  try {
    const stats = ExcelProcessor.getProcessingStats()
    const companies = database.getAllCompanies()
    
    // Estatísticas adicionais
    const additionalStats = {
      companiesWithPhone: companies.filter(c => c.contato.telefone1).length,
      companiesWithEmail: companies.filter(c => c.contato.email).length,
      companiesWithFantasyName: companies.filter(c => c.nomeFantasia && c.nomeFantasia !== c.razaoSocial).length,
      topNeighborhoods: getTopNeighborhoods(companies),
      recentlyAdded: companies.filter(c => {
        const daysDiff = (new Date().getTime() - c.createdAt.getTime()) / (1000 * 3600 * 24)
        return daysDiff <= 7
      }).length
    }

    return NextResponse.json({
      ...stats,
      ...additionalStats
    })

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

function getTopNeighborhoods(companies: any[]) {
  const neighborhoods = companies.reduce((acc, company) => {
    const neighborhood = company.endereco.bairro
    acc[neighborhood] = (acc[neighborhood] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return Object.entries(neighborhoods)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }))
}