"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUpload } from "@/components/admin/file-upload"
import { AdminStats } from "@/components/admin/admin-stats"
import { ArrowLeft, BarChart3, Upload, Settings } from "lucide-react"
import Link from "next/link"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar ao App
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ConectaPlus Admin</h1>
                <p className="text-gray-600">Painel administrativo do sistema</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="stats" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Estatísticas
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Importar Dados
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Visão Geral do Sistema</h2>
              <AdminStats />
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Gerenciamento de Dados</h2>
              <FileUpload />
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Sistema</CardTitle>
                <CardDescription>
                  Configurações gerais do ConectaPlus
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Localização</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      O sistema está configurado para Palmas, Tocantins
                    </p>
                    <Button variant="outline" size="sm" disabled>
                      Alterar Localização
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Categorias</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Gerenciar categorias de empresas do sistema
                    </p>
                    <Button variant="outline" size="sm" disabled>
                      Gerenciar Categorias
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Backup</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Fazer backup dos dados do sistema
                    </p>
                    <Button variant="outline" size="sm" disabled>
                      Criar Backup
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}