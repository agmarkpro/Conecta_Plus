import { NextResponse } from 'next/server'
import { database } from '@/lib/database'

export async function POST() {
  try {
    database.clearCompanies()
    
    return NextResponse.json({
      message: 'Banco de dados limpo com sucesso',
      stats: {
        totalCompanies: 0,
        activeCompanies: 0
      }
    })

  } catch (error) {
    console.error('Erro ao limpar banco:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}