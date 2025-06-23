"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Heart,
  Search,
  Calendar,
  Clock,
  MapPin,
  Star,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  Menu,
  X,
  Baby,
  Bone,
  Brain,
  HandHeart,
  Users,
  CheckCircle,
  Navigation,
  Building2,
} from "lucide-react"

const specialties = [
  { id: "cardiologia", name: "Cardiologia", icon: Heart, color: "bg-red-100 text-red-600" },
  { id: "dermatologia", name: "Dermatologia", icon: HandHeart, color: "bg-pink-100 text-pink-600" },
  { id: "pediatria", name: "Pediatria", icon: Baby, color: "bg-blue-100 text-blue-600" },
  { id: "ortopedia", name: "Ortopedia", icon: Bone, color: "bg-orange-100 text-orange-600" },
  { id: "ginecologia", name: "Ginecologia", icon: Users, color: "bg-purple-100 text-purple-600" },
  { id: "neurologia", name: "Neurologia", icon: Brain, color: "bg-green-100 text-green-600" },
]

const timeSlots = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"]

const clinics = [
  {
    id: 1,
    name: "Hospital São Lucas",
    address: "Rua das Flores, 123 - Centro",
    rating: 4.8,
    reviews: 234,
    hours: "22:00",
    distance: "1.2 km",
    specialties: ["cardiologia", "neurologia", "ortopedia"],
  },
  {
    id: 2,
    name: "Clínica MedCenter",
    address: "Av. Paulista, 456 - Bela Vista",
    rating: 4.6,
    reviews: 189,
    hours: "20:00",
    distance: "2.1 km",
    specialties: ["dermatologia", "pediatria", "ginecologia"],
  },
  {
    id: 3,
    name: "Centro Médico Vida",
    address: "Rua Augusta, 789 - Consolação",
    rating: 4.7,
    reviews: 156,
    hours: "18:00",
    distance: "0.8 km",
    specialties: ["cardiologia", "dermatologia", "neurologia"],
  },
]

export default function MedicalBooking() {
  const [selectedSpecialty, setSelectedSpecialty] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [selectedClinic, setSelectedClinic] = useState<number | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [userLocation, setUserLocation] = useState<string>("")

  const generateCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay()
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const days = []

    // Empty cells for days before first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day)
      date.setHours(0, 0, 0, 0)
      days.push({
        day,
        date,
        isToday: date.getTime() === today.getTime(),
        isPast: date < today,
        isSelected: selectedDate === date.toLocaleDateString("pt-BR"),
      })
    }

    return days
  }

  const getMonthName = (month: number) => {
    const months = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ]
    return months[month]
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date.toLocaleDateString("pt-BR"))
  }

  const handleConfirmBooking = () => {
    if (!selectedSpecialty || !selectedDate || !selectedTime) {
      alert("Por favor, selecione todos os campos obrigatórios.")
      return
    }

    const specialty = specialties.find((s) => s.id === selectedSpecialty)
    const clinic = selectedClinic ? clinics.find((c) => c.id === selectedClinic) : null

    alert(
      `Consulta agendada com sucesso!\n\nEspecialidade: ${specialty?.name}\nData: ${selectedDate}\nHorário: ${selectedTime}${clinic ? `\nClínica: ${clinic.name}` : ""}\nValor: R$ 150,00\n\nVocê receberá uma confirmação por email.`,
    )

    // Reset form
    setSelectedSpecialty("")
    setSelectedDate("")
    setSelectedTime("")
    setSelectedClinic(null)
  }

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation(
            `Localização obtida: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`,
          )
        },
        (error) => {
          alert("Não foi possível obter sua localização. Verifique as permissões do navegador.")
        },
      )
    } else {
      alert("Geolocalização não é suportada pelo seu navegador.")
    }
  }

  const canConfirm = selectedSpecialty && selectedDate && selectedTime

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-green-600" />
              <span className="text-xl lg:text-2xl font-bold text-gray-900">Thalita</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-8">
              <a href="#inicio" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
                Início
              </a>
              <a href="#agendamento" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
                Agendar
              </a>
              <a href="#localizacao" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
                Localização
              </a>
              <a href="#contato" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
                Contato
              </a>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex space-x-4">
              <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                Entrar
              </Button>
              <Button className="bg-green-600 hover:bg-green-700">Cadastrar</Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t">
              <nav className="flex flex-col space-y-4">
                <a href="#inicio" className="text-gray-700 hover:text-green-600 font-medium">
                  Início
                </a>
                <a href="#agendamento" className="text-gray-700 hover:text-green-600 font-medium">
                  Agendar
                </a>
                <a href="#localizacao" className="text-gray-700 hover:text-green-600 font-medium">
                  Localização
                </a>
                <a href="#contato" className="text-gray-700 hover:text-green-600 font-medium">
                  Contato
                </a>
                <div className="flex space-x-4 pt-4">
                  <Button variant="outline" size="sm" className="border-green-600 text-green-600">
                    Entrar
                  </Button>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    Cadastrar
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="py-12 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6">
                Cuidado de saúde ao seu alcance
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 mb-8">
                Encontre e agende consultas com os melhores profissionais de saúde próximos a você. Rápido, fácil e
                seguro.
              </p>

              {/* Search Box */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Buscar especialidade ou médico..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 text-base"
                  />
                </div>
                <Button
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 h-12 px-8"
                  onClick={() => document.getElementById("agendamento")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Buscar
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 sm:gap-8">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600">500+</div>
                  <div className="text-sm sm:text-base text-gray-600">Médicos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600">50+</div>
                  <div className="text-sm sm:text-base text-gray-600">Especialidades</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600">10k+</div>
                  <div className="text-sm sm:text-base text-gray-600">Consultas</div>
                </div>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <img
                src="/placeholder.svg?height=500&width=600"
                alt="Profissionais de saúde"
                className="rounded-2xl shadow-2xl max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Scheduling Section */}
      <section id="agendamento" className="py-12 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Agende sua consulta</h2>
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              Escolha a especialidade, data e horário que melhor se adequa à sua agenda
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Specialty Selection */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-green-600" />
                    Escolha a especialidade
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {specialties.map((specialty) => {
                      const Icon = specialty.icon
                      return (
                        <Card
                          key={specialty.id}
                          className={`cursor-pointer transition-all hover:shadow-lg ${
                            selectedSpecialty === specialty.id ? "ring-2 ring-green-500 bg-green-50" : "hover:shadow-md"
                          }`}
                          onClick={() => setSelectedSpecialty(specialty.id)}
                        >
                          <CardContent className="p-6 text-center">
                            <div
                              className={`w-12 h-12 rounded-full ${specialty.color} flex items-center justify-center mx-auto mb-3`}
                            >
                              <Icon className="h-6 w-6" />
                            </div>
                            <h3 className="font-semibold text-gray-900">{specialty.name}</h3>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Calendar and Time Selection */}
              <div className="grid sm:grid-cols-2 gap-6 mt-8">
                {/* Calendar */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-green-600" />
                      Selecione a data
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (currentMonth === 0) {
                              setCurrentMonth(11)
                              setCurrentYear(currentYear - 1)
                            } else {
                              setCurrentMonth(currentMonth - 1)
                            }
                          }}
                        >
                          ←
                        </Button>
                        <h4 className="font-semibold">
                          {getMonthName(currentMonth)} {currentYear}
                        </h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (currentMonth === 11) {
                              setCurrentMonth(0)
                              setCurrentYear(currentYear + 1)
                            } else {
                              setCurrentMonth(currentMonth + 1)
                            }
                          }}
                        >
                          →
                        </Button>
                      </div>

                      <div className="grid grid-cols-7 gap-1 text-center text-sm">
                        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
                          <div key={day} className="p-2 font-medium text-gray-500">
                            {day}
                          </div>
                        ))}

                        {generateCalendarDays().map((day, index) => (
                          <div key={index} className="aspect-square">
                            {day && (
                              <Button
                                variant={day.isSelected ? "default" : "ghost"}
                                size="sm"
                                className={`w-full h-full p-0 ${
                                  day.isPast
                                    ? "opacity-50 cursor-not-allowed"
                                    : day.isToday
                                      ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                                      : day.isSelected
                                        ? "bg-green-600 text-white hover:bg-green-700"
                                        : "hover:bg-gray-100"
                                }`}
                                disabled={day.isPast}
                                onClick={() => !day.isPast && handleDateSelect(day.date)}
                              >
                                {day.day}
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Time Slots */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-green-600" />
                      Horários disponíveis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {timeSlots.map((time) => (
                        <Button
                          key={time}
                          variant={selectedTime === time ? "default" : "outline"}
                          className={
                            selectedTime === time
                              ? "bg-green-600 hover:bg-green-700"
                              : "hover:bg-green-50 hover:border-green-300"
                          }
                          onClick={() => setSelectedTime(time)}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Booking Summary */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Resumo do agendamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Especialidade:</span>
                    <span className="font-medium">
                      {selectedSpecialty
                        ? specialties.find((s) => s.id === selectedSpecialty)?.name
                        : "Selecione uma especialidade"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Data:</span>
                    <span className="font-medium">{selectedDate || "Selecione uma data"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Horário:</span>
                    <span className="font-medium">{selectedTime || "Selecione um horário"}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Valor:</span>
                    <span className="text-green-600">R$ 150,00</span>
                  </div>
                </div>

                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                  disabled={!canConfirm}
                  onClick={handleConfirmBooking}
                >
                  Confirmar agendamento
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section id="localizacao" className="py-12 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Encontre clínicas próximas
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              Use sua localização para encontrar os melhores profissionais perto de você
            </p>
          </div>

          {/* Location Controls */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button onClick={getUserLocation} className="bg-green-600 hover:bg-green-700" size="lg">
              <Navigation className="h-5 w-5 mr-2" />
              Usar minha localização
            </Button>
            <div className="flex gap-2 w-full sm:w-auto">
              <Input
                placeholder="Digite seu endereço..."
                value={userLocation}
                onChange={(e) => setUserLocation(e.target.value)}
                className="flex-1 sm:w-80"
              />
              <Button variant="outline">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Clinics List */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Clínicas próximas</h3>
              <div className="space-y-4">
                {clinics.map((clinic) => (
                  <Card
                    key={clinic.id}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedClinic === clinic.id ? "ring-2 ring-green-500 bg-green-50" : ""
                    }`}
                    onClick={() => setSelectedClinic(clinic.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">{clinic.name}</h4>
                          <p className="text-gray-600 mb-2 flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {clinic.address}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              {clinic.rating} ({clinic.reviews} avaliações)
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              Aberto até {clinic.hours}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary" className="mb-2">
                            {clinic.distance}
                          </Badge>
                          <Button
                            size="sm"
                            variant={selectedClinic === clinic.id ? "default" : "outline"}
                            className={selectedClinic === clinic.id ? "bg-green-600 hover:bg-green-700" : ""}
                          >
                            {selectedClinic === clinic.id ? "Selecionado" : "Selecionar"}
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {clinic.specialties.map((specialtyId) => {
                          const specialty = specialties.find((s) => s.id === specialtyId)
                          return specialty ? (
                            <Badge key={specialtyId} variant="outline" className="text-xs">
                              {specialty.name}
                            </Badge>
                          ) : null
                        })}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Map Placeholder */}
            <Card>
              <CardContent className="p-0">
                <div className="h-96 lg:h-full min-h-96 bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-500">
                  <Building2 className="h-16 w-16 mb-4 text-green-600" />
                  <p className="text-lg font-medium mb-2">Mapa interativo</p>
                  <p className="text-sm text-center px-4">Visualize as clínicas próximas em um mapa interativo</p>
                  {userLocation && <Badge className="mt-4 bg-green-100 text-green-800">Localização ativa</Badge>}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contato" className="bg-gray-900 text-white py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-8 w-8 text-green-400" />
                <span className="text-xl font-bold">Thalita</span>
              </div>
              <p className="text-gray-400 mb-4">
                Conectando você aos melhores profissionais de saúde com tecnologia e cuidado.
              </p>
              <div className="flex space-x-4">
                <Facebook className="h-5 w-5 text-gray-400 hover:text-green-400 cursor-pointer transition-colors" />
                <Instagram className="h-5 w-5 text-gray-400 hover:text-green-400 cursor-pointer transition-colors" />
                <Twitter className="h-5 w-5 text-gray-400 hover:text-green-400 cursor-pointer transition-colors" />
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 text-green-400">Serviços</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Agendamento
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Telemedicina
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Exames
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Emergência
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 text-green-400">Suporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Central de Ajuda
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contato
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Política de Privacidade
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 text-green-400">Contato</h4>
              <div className="space-y-2 text-gray-400">
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  (11) 3000-0000
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  contato@thalita.com
                </p>
              </div>
            </div>
          </div>

          <Separator className="my-8 bg-gray-700" />

          <div className="text-center text-gray-400">
            <p>&copy; 2025 Thalita. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
