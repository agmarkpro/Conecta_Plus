"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileSpreadsheet, Trash2, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface UploadStats {
  totalProcessed: number
  errors: number
  errorDetails: string[]
  processingStats: {
    totalCompanies: number
    activeCompanies: number
    categoriesUsed: number
    companiesByCategory: Record<string, number>
  }
}

export function FileUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStats, setUploadStats] = useState<UploadStats | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const { toast } = useToast()

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setUploadStats(null)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "Erro",
        description: "Selecione um arquivo primeiro",
        variant: "destructive"
      })
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      // Simular progresso
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erro no upload')
      }

      const result = await response.json()
      setUploadStats(result.stats)

      toast({
        title: "Upload concluído!",
        description: `${result.stats.totalProcessed} empresas processadas com sucesso`,
      })

    } catch (error) {
      console.error('Erro no upload:', error)
      toast({
        title: "Erro no upload",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive"
      })
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleClearDatabase = async () => {
    if (!confirm('Tem certeza que deseja limpar todo o banco de dados? Esta ação não pode ser desfeita.')) {
      return
    }

    try {
      const response = await fetch('/api/admin/clear', {
        method: 'POST'
      })

      if (!response.ok) {
        throw new Error('Erro ao limpar banco')
      }

      setUploadStats(null)
      setSelectedFile(null)
      
      toast({
        title: "Banco limpo",
        description: "Todas as empresas foram removidas do sistema",
      })

    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível limpar o banco de dados",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" />
            Importar Empresas
          </CardTitle>
          <CardDescription>
            Faça upload de um arquivo Excel (.xlsx) com os dados das empresas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                disabled={isUploading}
              />
            </div>
            <Button 
              onClick={handleUpload} 
              disabled={!selectedFile || isUploading}
              className="min-w-[120px]"
            >
              {isUploading ? (
                <>
                  <Upload className="w-4 h-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Importar
                </>
              )}
            </Button>
          </div>

          {isUploading && (
            <div className="space-y-2">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-gray-600">
                Processando arquivo... {uploadProgress}%
              </p>
            </div>
          )}

          {selectedFile && (
            <Alert>
              <FileSpreadsheet className="h-4 w-4" />
              <AlertDescription>
                Arquivo selecionado: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {uploadStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Resultado da Importação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {uploadStats.totalProcessed}
                </div>
                <div className="text-sm text-green-700">Processadas</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {uploadStats.processingStats.activeCompanies}
                </div>
                <div className="text-sm text-blue-700">Ativas</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {uploadStats.processingStats.categoriesUsed}
                </div>
                <div className="text-sm text-purple-700">Categorias</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {uploadStats.errors}
                </div>
                <div className="text-sm text-red-700">Erros</div>
              </div>
            </div>

            {uploadStats.errors > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-semibold mb-2">Erros encontrados:</div>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {uploadStats.errorDetails.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <h4 className="font-semibold">Empresas por Categoria:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(uploadStats.processingStats.companiesByCategory).map(([category, count]) => (
                  <div key={category} className="flex justify-between p-2 bg-gray-50 rounded">
                    <span>{category}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="w-5 h-5" />
            Limpar Banco de Dados
          </CardTitle>
          <CardDescription>
            Remove todas as empresas do sistema. Use com cuidado!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="destructive" 
            onClick={handleClearDatabase}
            className="w-full"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Limpar Todas as Empresas
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}