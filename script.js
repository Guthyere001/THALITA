// Global variables
let selectedSpecialty = ""
let selectedDate = ""
let selectedTime = ""
let selectedClinic = null
let currentMonth = new Date().getMonth()
let currentYear = new Date().getFullYear()
let userLocation = null

// Specialty data
const specialties = {
  cardiologia: "Cardiologia",
  dermatologia: "Dermatologia",
  pediatria: "Pediatria",
  ortopedia: "Ortopedia",
  ginecologia: "Ginecologia",
  neurologia: "Neurologia",
}

// Month names
const monthNames = [
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

// Day names
const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

// DOM Elements
const mobileMenuToggle = document.getElementById("mobileMenuToggle")
const mobileMenu = document.getElementById("mobileMenu")
const heroSearchBtn = document.getElementById("heroSearchBtn")
const heroSearch = document.getElementById("heroSearch")
const specialtyGrid = document.getElementById("specialtyGrid")
const calendarGrid = document.getElementById("calendarGrid")
const currentMonthElement = document.getElementById("currentMonth")
const prevMonthBtn = document.getElementById("prevMonth")
const nextMonthBtn = document.getElementById("nextMonth")
const timeSlots = document.getElementById("timeSlots")
const confirmBookingBtn = document.getElementById("confirmBooking")
const getLocationBtn = document.getElementById("getLocationBtn")
const addressInput = document.getElementById("addressInput")
const searchAddressBtn = document.getElementById("searchAddressBtn")
const clinicsList = document.getElementById("clinicsList")
const locationStatus = document.getElementById("locationStatus")

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  initializeEventListeners()
  generateCalendar()
  updateBookingSummary()
})

// Event Listeners
function initializeEventListeners() {
  // Mobile menu toggle
  mobileMenuToggle.addEventListener("click", toggleMobileMenu)

  // Hero search
  heroSearchBtn.addEventListener("click", handleHeroSearch)
  heroSearch.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      handleHeroSearch()
    }
  })

  // Specialty selection
  specialtyGrid.addEventListener("click", handleSpecialtySelection)

  // Calendar navigation
  prevMonthBtn.addEventListener("click", () => navigateMonth(-1))
  nextMonthBtn.addEventListener("click", () => navigateMonth(1))

  // Time slot selection
  timeSlots.addEventListener("click", handleTimeSlotSelection)

  // Booking confirmation
  confirmBookingBtn.addEventListener("click", confirmBooking)

  // Location features
  getLocationBtn.addEventListener("click", getUserLocation)
  searchAddressBtn.addEventListener("click", searchAddress)
  addressInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchAddress()
    }
  })

  // Clinic selection
  clinicsList.addEventListener("click", handleClinicSelection)

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const targetId = this.getAttribute("href")
      const targetSection = document.querySelector(targetId)
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" })
        // Close mobile menu if open
        mobileMenu.classList.remove("active")
      }
    })
  })
}

// Mobile menu functionality
function toggleMobileMenu() {
  mobileMenu.classList.toggle("active")
  const icon = mobileMenuToggle.querySelector("i")
  if (mobileMenu.classList.contains("active")) {
    icon.className = "fas fa-times"
  } else {
    icon.className = "fas fa-bars"
  }
}

// Hero search functionality
function handleHeroSearch() {
  const searchTerm = heroSearch.value.trim()
  if (searchTerm) {
    document.getElementById("agendamento").scrollIntoView({ behavior: "smooth" })
    // You could implement search filtering here
    showNotification(`Buscando por: "${searchTerm}"`)
  }
}

// Specialty selection
function handleSpecialtySelection(e) {
  const specialtyCard = e.target.closest(".specialty-card")
  if (!specialtyCard) return

  // Remove previous selection
  document.querySelectorAll(".specialty-card").forEach((card) => {
    card.classList.remove("selected")
  })

  // Add selection to clicked card
  specialtyCard.classList.add("selected")
  selectedSpecialty = specialtyCard.dataset.specialty

  updateBookingSummary()
}

// Calendar functionality
function generateCalendar() {
  const firstDay = new Date(currentYear, currentMonth, 1).getDay()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Update month display
  currentMonthElement.textContent = `${monthNames[currentMonth]} ${currentYear}`

  // Clear calendar
  calendarGrid.innerHTML = ""

  // Add day headers
  dayNames.forEach((day) => {
    const dayHeader = document.createElement("div")
    dayHeader.className = "calendar-header-day"
    dayHeader.textContent = day
    calendarGrid.appendChild(dayHeader)
  })

  // Add empty cells for days before first day of month
  for (let i = 0; i < firstDay; i++) {
    const emptyDay = document.createElement("div")
    emptyDay.className = "calendar-day disabled"
    calendarGrid.appendChild(emptyDay)
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayElement = document.createElement("div")
    dayElement.className = "calendar-day"
    dayElement.textContent = day

    const dayDate = new Date(currentYear, currentMonth, day)
    dayDate.setHours(0, 0, 0, 0)

    // Check if it's today
    if (dayDate.getTime() === today.getTime()) {
      dayElement.classList.add("today")
    }

    // Disable past dates
    if (dayDate < today) {
      dayElement.classList.add("disabled")
    } else {
      dayElement.addEventListener("click", () => selectDate(dayElement, dayDate))
    }

    calendarGrid.appendChild(dayElement)
  }
}

function navigateMonth(direction) {
  currentMonth += direction
  if (currentMonth < 0) {
    currentMonth = 11
    currentYear--
  } else if (currentMonth > 11) {
    currentMonth = 0
    currentYear++
  }
  generateCalendar()
}

function selectDate(element, date) {
  // Remove previous selection
  document.querySelectorAll(".calendar-day").forEach((day) => {
    day.classList.remove("selected")
  })

  // Add selection to clicked day
  element.classList.add("selected")
  selectedDate = date.toLocaleDateString("pt-BR")

  updateBookingSummary()
}

// Time slot selection
function handleTimeSlotSelection(e) {
  const timeSlot = e.target.closest(".time-slot")
  if (!timeSlot) return

  // Remove previous selection
  document.querySelectorAll(".time-slot").forEach((slot) => {
    slot.classList.remove("selected")
  })

  // Add selection to clicked slot
  timeSlot.classList.add("selected")
  selectedTime = timeSlot.dataset.time

  updateBookingSummary()
}

// Update booking summary
function updateBookingSummary() {
  document.getElementById("selectedSpecialty").textContent = selectedSpecialty
    ? specialties[selectedSpecialty]
    : "Selecione uma especialidade"

  document.getElementById("selectedDate").textContent = selectedDate || "Selecione uma data"

  document.getElementById("selectedTime").textContent = selectedTime || "Selecione um horário"

  // Enable/disable confirm button
  const canConfirm = selectedSpecialty && selectedDate && selectedTime
  confirmBookingBtn.disabled = !canConfirm
}

// Confirm booking
function confirmBooking() {
  if (!selectedSpecialty || !selectedDate || !selectedTime) {
    showNotification("Por favor, selecione todos os campos obrigatórios.", "error")
    return
  }

  const specialty = specialties[selectedSpecialty]
  const clinic = selectedClinic ? getClinicById(selectedClinic) : null

  let message = `Consulta agendada com sucesso!\n\n`
  message += `Especialidade: ${specialty}\n`
  message += `Data: ${selectedDate}\n`
  message += `Horário: ${selectedTime}\n`
  if (clinic) {
    message += `Clínica: ${clinic.name}\n`
  }
  message += `Valor: R$ 150,00\n\n`
  message += `Você receberá uma confirmação por email.`

  showNotification(message, "success")

  // Reset form
  resetBookingForm()
}

function resetBookingForm() {
  selectedSpecialty = ""
  selectedDate = ""
  selectedTime = ""
  selectedClinic = null

  document.querySelectorAll(".specialty-card").forEach((card) => {
    card.classList.remove("selected")
  })
  document.querySelectorAll(".calendar-day").forEach((day) => {
    day.classList.remove("selected")
  })
  document.querySelectorAll(".time-slot").forEach((slot) => {
    slot.classList.remove("selected")
  })
  document.querySelectorAll(".clinic-card").forEach((card) => {
    card.classList.remove("selected")
  })
  document.querySelectorAll(".clinic-select").forEach((btn) => {
    btn.textContent = "Selecionar"
    btn.classList.remove("selected")
  })

  updateBookingSummary()
}

// Location functionality
function getUserLocation() {
  if (!navigator.geolocation) {
    showNotification("Geolocalização não é suportada pelo seu navegador.", "error")
    return
  }

  // Show loading state
  const originalText = getLocationBtn.innerHTML
  getLocationBtn.innerHTML = '<div class="spinner"></div> Obtendo localização...'
  getLocationBtn.disabled = true

  navigator.geolocation.getCurrentPosition(
    (position) => {
      userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }

      // Show success state
      getLocationBtn.innerHTML = '<i class="fas fa-check"></i> Localização obtida'
      locationStatus.textContent = `Localização ativa: ${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`
      locationStatus.classList.add("active")

      // Calculate distances (simulated)
      calculateDistances()

      // Reset button after 2 seconds
      setTimeout(() => {
        getLocationBtn.innerHTML = originalText
        getLocationBtn.disabled = false
      }, 2000)
    },
    (error) => {
      console.error("Erro ao obter localização:", error)
      showNotification("Não foi possível obter sua localização. Verifique as permissões do navegador.", "error")

      getLocationBtn.innerHTML = originalText
      getLocationBtn.disabled = false
    },
  )
}

function searchAddress() {
  const address = addressInput.value.trim()
  if (!address) return

  // Simulate address search
  showNotification(`Buscando endereço: "${address}"`)

  // In a real application, you would use a geocoding service here
  setTimeout(() => {
    userLocation = {
      lat: -23.5505 + (Math.random() - 0.5) * 0.01,
      lng: -46.6333 + (Math.random() - 0.5) * 0.01,
    }

    locationStatus.textContent = `Endereço encontrado: ${address}`
    locationStatus.classList.add("active")

    calculateDistances()
  }, 1000)
}

function calculateDistances() {
  // Simulate distance calculation
  const clinicCards = document.querySelectorAll(".clinic-card")
  clinicCards.forEach((card, index) => {
    const distanceBadge = card.querySelector(".badge-secondary")
    const distances = ["0.8 km", "1.2 km", "2.1 km"]
    distanceBadge.textContent = distances[index] || `${(Math.random() * 3 + 0.5).toFixed(1)} km`
  })
}

// Clinic selection
function handleClinicSelection(e) {
  const selectBtn = e.target.closest(".clinic-select")
  if (!selectBtn) return

  const clinicCard = selectBtn.closest(".clinic-card")
  const clinicId = Number.parseInt(clinicCard.dataset.clinic)

  // Remove previous selections
  document.querySelectorAll(".clinic-card").forEach((card) => {
    card.classList.remove("selected")
  })
  document.querySelectorAll(".clinic-select").forEach((btn) => {
    btn.textContent = "Selecionar"
    btn.classList.remove("selected")
  })

  // Add selection to current clinic
  clinicCard.classList.add("selected")
  selectBtn.textContent = "Selecionado"
  selectBtn.classList.add("selected")
  selectedClinic = clinicId

  const clinic = getClinicById(clinicId)
  showNotification(`Clínica selecionada: ${clinic.name}`)
}

function getClinicById(id) {
  const clinics = {
    1: { name: "Hospital São Lucas" },
    2: { name: "Clínica MedCenter" },
    3: { name: "Centro Médico Vida" },
  }
  return clinics[id]
}

// Notification system
function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === "error" ? "#ef4444" : type === "success" ? "#16a34a" : "#3b82f6"};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        max-width: 400px;
        word-wrap: break-word;
        white-space: pre-line;
        animation: slideIn 0.3s ease-out;
    `

  notification.textContent = message

  // Add close button
  const closeBtn = document.createElement("button")
  closeBtn.innerHTML = "&times;"
  closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        float: right;
        margin-left: 1rem;
        margin-top: -0.25rem;
    `
  closeBtn.onclick = () => notification.remove()
  notification.appendChild(closeBtn)

  // Add to page
  document.body.appendChild(notification)

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = "slideOut 0.3s ease-out"
      setTimeout(() => notification.remove(), 300)
    }
  }, 5000)
}

// Add CSS animations for notifications
const style = document.createElement("style")
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`
document.head.appendChild(style)

// Smooth scrolling polyfill for older browsers
if (!("scrollBehavior" in document.documentElement.style)) {
  const smoothScrollPolyfill = document.createElement("script")
  smoothScrollPolyfill.src = "https://cdn.jsdelivr.net/gh/iamdustan/smoothscroll@master/src/smoothscroll.js"
  document.head.appendChild(smoothScrollPolyfill)
}

// Handle window resize for responsive behavior
window.addEventListener("resize", () => {
  // Close mobile menu on resize to desktop
  if (window.innerWidth > 768) {
    mobileMenu.classList.remove("active")
    mobileMenuToggle.querySelector("i").className = "fas fa-bars"
  }
})

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1"
      entry.target.style.transform = "translateY(0)"
    }
  })
}, observerOptions)

// Observe elements for animation
document.addEventListener("DOMContentLoaded", () => {
  const animatedElements = document.querySelectorAll(".card, .specialty-card, .clinic-card")
  animatedElements.forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(20px)"
    el.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out"
    observer.observe(el)
  })
})
