import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/database'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const company = database.getCompany(params.id)

    if (!company) {
      return NextResponse.json(
        { error: 'Empresa não encontrada' },
        { status: 404 }
      )
    }

    // Transformar dados para o frontend
    const transformedCompany = {
      id: company.id,
      name: company.nomeFantasia || company.razaoSocial,
      legalName: company.razaoSocial,
      cnpj: company.cnpj,
      category: company.descricaoCnae,
      categoryId: company.categoria,
      description: `${company.descricaoCnae} - ${company.naturezaJuridica}`,
      address: {
        full: `${company.endereco.tipoLogradouro || ''} ${company.endereco.logradouro}, ${company.endereco.numero}${company.endereco.complemento ? ` - ${company.endereco.complemento}` : ''} - ${company.endereco.bairro}, Palmas - TO`,
        street: company.endereco.logradouro,
        number: company.endereco.numero,
        complement: company.endereco.complemento,
        neighborhood: company.endereco.bairro,
        zipCode: company.endereco.cep,
        city: 'Palmas',
        state: 'TO'
      },
      contact: {
        phone1: company.contato.telefone1,
        phone2: company.contato.telefone2,
        email: company.contato.email
      },
      businessInfo: {
        cnae: company.cnae,
        legalNature: company.naturezaJuridica,
        size: company.porte,
        foundedAt: company.dataInicio,
        status: company.situacao
      },
      isActive: company.isActive,
      createdAt: company.createdAt
    }

    return NextResponse.json(transformedCompany)

  } catch (error) {
    console.error('Erro ao buscar empresa:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}