"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  MapPin,
  Star,
  Heart,
  Filter,
  Clock,
  Instagram,
  Facebook,
  Settings,
  Plus,
  Home,
  Bookmark,
  User,
  Phone,
  Mail,
} from "lucide-react"

export default function ConectaPlusApp() {
  const [currentView, setCurrentView] = useState<"welcome" | "home" | "search" | "favorites" | "profile" | "admin">(
    "welcome",
  )
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<string>("Palmas, TO")
  const [companies, setCompanies] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchCategories()
    fetchCompanies()
  }, [])

  useEffect(() => {
    if (currentView === "search") {
      fetchCompanies()
    }
  }, [selectedCategory, searchQuery, currentView])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    }
  }

  const fetchCompanies = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedCategory) params.append('category', selectedCategory)
      if (searchQuery) params.append('search', searchQuery)
      params.append('limit', '20')

      const response = await fetch(`/api/companies?${params}`)
      if (response.ok) {
        const data = await response.json()
        setCompanies(data.companies)
      }
    } catch (error) {
      console.error('Erro ao carregar empresas:', error)
    } finally {
      setLoading(false)
    }
  }

  const stories = [
    { id: 1, business: "Pizza Express", avatar: "/placeholder.svg?height=60&width=60", hasNew: true },
    { id: 2, business: "Salão Bella", avatar: "/placeholder.svg?height=60&width=60", hasNew: true },
    { id: 3, business: "Tech Repair", avatar: "/placeholder.svg?height=60&width=60", hasNew: false },
    { id: 4, business: "Café Central", avatar: "/placeholder.svg?height=60&width=60", hasNew: true },
    { id: 5, business: "Farmácia Vida", avatar: "/placeholder.svg?height=60&width=60", hasNew: false },
  ]

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      setCurrentView("search")
    }
  }

  const WelcomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <MapPin className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">ConectaPlus</h1>
          <p className="text-gray-600">Conectando você aos melhores negócios locais</p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => setCurrentView("home")}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-3 rounded-xl"
          >
            <Instagram className="w-5 h-5 mr-2" />
            Entrar com Instagram
          </Button>

          <Button onClick={() => setCurrentView("home")} variant="outline" className="w-full py-3 rounded-xl border-2">
            <Facebook className="w-5 h-5 mr-2 text-blue-600" />
            Entrar com Facebook
          </Button>

          <Button onClick={() => setCurrentView("home")} variant="ghost" className="w-full py-3 text-gray-600">
            Continuar sem login
          </Button>
        </div>

        <div className="mt-6 text-center">
          <Button onClick={() => setCurrentView("admin")} variant="link" className="text-sm text-purple-600">
            <Settings className="w-4 h-4 mr-1" />
            Área Administrativa
          </Button>
        </div>
      </div>
    </div>
  )

  const HomeScreen = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              ConectaPlus
            </h1>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{userLocation}</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Buscar empresas, produtos ou serviços..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-12 py-3 rounded-full border-gray-200 focus:border-purple-500"
            />
            <Button size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stories */}
      <div className="bg-white py-4 mb-2">
        <div className="px-4">
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
            {stories.map((story) => (
              <div key={story.id} className="flex-shrink-0 text-center">
                <div
                  className={`relative w-16 h-16 rounded-full p-1 ${story.hasNew ? "bg-gradient-to-tr from-purple-500 to-pink-500" : "bg-gray-200"}`}
                >
                  <Avatar className="w-full h-full border-2 border-white">
                    <AvatarImage src={story.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{story.business[0]}</AvatarFallback>
                  </Avatar>
                </div>
                <p className="text-xs mt-1 text-gray-600 max-w-[64px] truncate">{story.business}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white py-4 mb-2">
        <div className="px-4">
          <h2 className="text-lg font-semibold mb-3">Categorias</h2>
          <div className="grid grid-cols-3 gap-3">
            {categories.map((category) => (
              <Card
                key={category.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => {
                  setSelectedCategory(category.id)
                  setCurrentView("search")
                }}
              >
                <CardContent className="p-4 text-center">
                  <div
                    className={`w-12 h-12 rounded-full ${category.color} flex items-center justify-center mx-auto mb-2`}
                  >
                    <span className="text-2xl">{category.icon}</span>
                  </div>
                  <p className="text-sm font-medium">{category.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Businesses */}
      <div className="px-4">
        <h2 className="text-lg font-semibold mb-3">Destaques próximos a você</h2>
        <div className="space-y-4">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))
          ) : companies.slice(0, 3).map((company) => (
            <Card key={company.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src="/placeholder.svg?height=200&width=300"
                  alt={company.name}
                  className="w-full h-48 object-cover"
                />
                <Button size="sm" variant="ghost" className="absolute top-2 right-2 bg-white/80 hover:bg-white">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>

              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{company.name}</h3>
                    <p className="text-gray-600 text-sm">{company.category}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">4.5</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>1.2 km</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span className={company.isOpen ? "text-green-600" : "text-red-600"}>
                        {company.isOpen ? "Aberto" : "Fechado"}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mt-1">{company.address}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="h-20"></div>
    </div>
  )

  const SearchScreen = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm sticky top-0 z-10 p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Buscar empresas, produtos ou serviços..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-3 rounded-full"
            autoFocus
          />
        </div>

        <div className="flex space-x-2 overflow-x-auto">
          <Badge
            variant={selectedCategory === null ? "default" : "outline"}
            className="cursor-pointer whitespace-nowrap"
            onClick={() => setSelectedCategory(null)}
          >
            Todos
          </Badge>
          {categories.map((category) => (
            <Badge
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className="cursor-pointer whitespace-nowrap"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.icon} {category.name}
            </Badge>
          ))}
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            [...Array(5)].map((_, i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="flex">
                  <div className="w-24 h-24 bg-gray-200"></div>
                  <CardContent className="flex-1 p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </CardContent>
                </div>
              </Card>
            ))
          ) : companies.map((company) => (
            <Card key={company.id} className="overflow-hidden">
              <div className="flex">
                <img
                  src="/placeholder.svg?height=96&width=96"
                  alt={company.name}
                  className="w-24 h-24 object-cover"
                />
                <CardContent className="flex-1 p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold">{company.name}</h3>
                      <p className="text-gray-600 text-sm">{company.category}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">4.5</span>
                        </div>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-600">1.2 km</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className={`text-xs ${company.isOpen ? "text-green-600" : "text-red-600"}`}>
                          {company.isOpen ? "Aberto" : "Fechado"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 mt-2">
                        {company.phone && (
                          <div className="flex items-center space-x-1">
                            <Phone className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-600">{company.phone}</span>
                          </div>
                        )}
                        {company.email && (
                          <div className="flex items-center space-x-1">
                            <Mail className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-600">{company.email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
        
        {!loading && companies.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhuma empresa encontrada</p>
            <p className="text-sm text-gray-400 mt-1">
              Tente ajustar os filtros ou termo de busca
            </p>
          </div>
        )}
      </div>
    </div>
  )

  const AdminScreen = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm p-4">
        <Button variant="ghost" onClick={() => setCurrentView("home")} className="mb-4">← Voltar</Button>
        <h1 className="text-2xl font-bold text-gray-800">Área Administrativa</h1>
        <p className="text-gray-600">Gerencie empresas e conteúdo do ConectaPlus</p>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><Plus className="w-5 h-5" />Importar Empresas</h3>
            <p className="text-gray-600 text-sm mb-4">Importe dados de empresas em lote via Excel</p>
            <Button className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Importar Arquivo
            </Button>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><Settings className="w-5 h-5" />Gerenciar Empresas</h3>
            <p className="text-gray-600 text-sm mb-4">Visualize e edite informações das empresas</p>
            <Button variant="outline" className="w-full bg-transparent">
              <Settings className="w-4 h-4 mr-2" />
              Acessar Painel
            </Button>
          </Card>
        </div>

        <Card className="mt-6 p-6">
          <h3 className="text-lg font-semibold mb-4">Estatísticas Rápidas</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-purple-600">{companies.length}</p>
              <p className="text-sm text-gray-600">Empresas</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">0</p>
              <p className="text-sm text-gray-600">Usuários</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">89%</p>
              <p className="text-sm text-gray-600">Ativas</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )

  const BottomNavigation = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around">
        <Button
          variant={currentView === "home" ? "default" : "ghost"}
          size="sm"
          onClick={() => setCurrentView("home")}
          className="flex-col h-auto py-2"
        >
          <Home className="w-5 h-5 mb-1" />
          <span className="text-xs">Início</span>
        </Button>

        <Button
          variant={currentView === "search" ? "default" : "ghost"}
          size="sm"
          onClick={() => setCurrentView("search")}
          className="flex-col h-auto py-2"
        >
          <Search className="w-5 h-5 mb-1" />
          <span className="text-xs">Buscar</span>
        </Button>

        <Button
          variant={currentView === "favorites" ? "default" : "ghost"}
          size="sm"
          onClick={() => setCurrentView("favorites")}
          className="flex-col h-auto py-2"
        >
          <Bookmark className="w-5 h-5 mb-1" />
          <span className="text-xs">Favoritos</span>
        </Button>

        <Button
          variant={currentView === "profile" ? "default" : "ghost"}
          size="sm"
          onClick={() => setCurrentView("profile")}
          className="flex-col h-auto py-2"
        >
          <User className="w-5 h-5 mb-1" />
          <span className="text-xs">Perfil</span>
        </Button>
      </div>
    </div>
  )

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {currentView === "welcome" && <WelcomeScreen />}
      {currentView === "home" && <HomeScreen />}
      {currentView === "search" && <SearchScreen />}
      {currentView === "admin" && <AdminScreen />}

      {currentView !== "welcome" && currentView !== "admin" && <BottomNavigation />}
    </div>
  )
}
