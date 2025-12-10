<template>
  <div class="color-wheel-container">
    <canvas 
      ref="colorWheelCanvas"
      width="300"
      height="300"
      :style="{ cursor: isDragging ? 'grabbing' : 'crosshair' }"
    ></canvas>
    <div 
      class="selected-color" 
      :style="{ backgroundColor: selectedColor }"
    ></div>
    <span class="color-code">{{ selectedColor }}</span>
    <p class="instruction">Нажмите или перетащите в пределах круга для выбора цвета</p>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  props: {
    initialColor: {
      type: String,
      default: '#3498db'
    }
  },
  emits: ['color-selected'],
  setup(props, { emit }) {
    const colorWheelCanvas = ref(null)
    const isDragging = ref(false)
    const selectedColor = ref(props.initialColor)
    const canvasContext = ref(null)
    
    // Инициализация canvas
    const initCanvas = () => {
      const canvas = colorWheelCanvas.value
      if (!canvas) return
      
      canvasContext.value = canvas.getContext('2d')
      drawColorWheel()
      
      // Добавляем обработчики событий через addEventListener
      canvas.addEventListener('mousedown', handleMouseDown)
      canvas.addEventListener('mousemove', handleMouseMove)
      canvas.addEventListener('mouseup', handleMouseUp)
      canvas.addEventListener('mouseleave', handleMouseUp)
    }
    
    // Рисуем цветовой круг
    const drawColorWheel = () => {
      const canvas = colorWheelCanvas.value
      if (!canvas || !canvasContext.value) return
      
      const ctx = canvasContext.value
      const radius = canvas.width / 2
      
      // Очищаем канвас
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Рисуем пиксели по кругу (более надежный метод)
      for (let x = 0; x < canvas.width; x++) {
        for (let y = 0; y < canvas.height; y++) {
          const dx = x - radius
          const dy = y - radius
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance <= radius) {
            // Угол в радианах
            const angle = Math.atan2(dy, dx)
            // Преобразуем в градусы (0-360)
            const hue = ((angle * 180 / Math.PI) + 360) % 360
            // Насыщенность (0-1)
            const saturation = distance / radius
            // Яркость фиксированная 0.5 для лучшей читаемости
            const lightness = 0.5
            
            ctx.fillStyle = `hsl(${hue}, ${saturation * 100}%, ${lightness * 100}%)`
            ctx.fillRect(x, y, 1, 1)
          }
        }
      }
      
      // Рисуем градиенты насыщенности и яркости
      drawOverlays()
      
      // Рисуем маркер
      drawMarker()
    }
    
    // Градиенты поверх основного круга
    const drawOverlays = () => {
      const canvas = colorWheelCanvas.value
      if (!canvas || !canvasContext.value) return
      
      const ctx = canvasContext.value
      const radius = canvas.width / 2
      const centerX = radius
      const centerY = radius
      
      // Белый градиент (насыщенность)
      const whiteGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
      whiteGradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
      whiteGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
      ctx.fillStyle = whiteGradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.fill()
      
      // Черный градиент (яркость)
      const blackGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
      blackGradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
      blackGradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)')
      ctx.fillStyle = blackGradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.fill()
    }
    
    // Рисуем маркер выбранного цвета
    const drawMarker = () => {
      const canvas = colorWheelCanvas.value
      if (!canvas || !canvasContext.value) return
      
      const ctx = canvasContext.value
      const radius = canvas.width / 2
      const centerX = radius
      const centerY = radius
      
      // Конвертируем HEX в HSL
      const hsl = hexToHsl(selectedColor.value)
      
      // Вычисляем координаты маркера
      const angle = hsl.h * Math.PI / 180
      const x = centerX + Math.cos(angle) * radius * hsl.s
      const y = centerY + Math.sin(angle) * radius * hsl.s
      
      // Рисуем внешний круг маркера
      ctx.beginPath()
      ctx.arc(x, y, 12, 0, Math.PI * 2)
      ctx.strokeStyle = 'white'
      ctx.lineWidth = 2
      ctx.stroke()
      
      // Рисуем внутренний круг маркера
      ctx.beginPath()
      ctx.arc(x, y, 10, 0, Math.PI * 2)
      ctx.strokeStyle = 'black'
      ctx.lineWidth = 1.5
      ctx.stroke()
    }
    
    // Обработчики событий
    const handleMouseDown = (e) => {
      isDragging.value = true
      updateSelectedColor(e)
    }
    
    const handleMouseMove = (e) => {
      if (isDragging.value) {
        updateSelectedColor(e)
      }
    }
    
    const handleMouseUp = () => {
      isDragging.value = false
    }
    
    const updateSelectedColor = (e) => {
      const canvas = colorWheelCanvas.value
      if (!canvas) return
      
      // Получаем положение курсора относительно canvas
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      // Проверяем, находится ли точка внутри круга
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const dx = x - centerX
      const dy = y - centerY
      const distance = Math.sqrt(dx * dx + dy * dy)
      const radius = canvas.width / 2
      
      if (distance <= radius) {
        // Вычисляем цвет на основе позиции
        const angle = Math.atan2(dy, dx)
        const hue = ((angle * 180 / Math.PI) + 360) % 360
        const saturation = distance / radius
        const lightness = 0.5
        
        selectedColor.value = hslToHex(hue, saturation, lightness)
        emit('color-selected', selectedColor.value)
        drawColorWheel()
      }
    }
    
    // Вспомогательные функции конвертации цветов
    const hexToHsl = (hex) => {
      hex = hex.replace('#', '')
      
      const r = parseInt(hex.substring(0, 2), 16) / 255
      const g = parseInt(hex.substring(2, 4), 16) / 255
      const b = parseInt(hex.substring(4, 6), 16) / 255
      
      const max = Math.max(r, g, b)
      const min = Math.min(r, g, b)
      const delta = max - min
      
      let h = 0
      if (delta !== 0) {
        if (max === r) {
          h = ((g - b) / delta) % 6
        } else if (max === g) {
          h = (b - r) / delta + 2
        } else if (max === b) {
          h = (r - g) / delta + 4
        }
        h *= 60
        if (h < 0) h += 360
      }
      
      const l = (max + min) / 2
      let s = 0
      if (delta !== 0) {
        s = delta / (1 - Math.abs(2 * l - 1))
      }
      
      return { h, s, l }
    }
    
    const hslToHex = (h, s, l) => {
      const c = (1 - Math.abs(2 * l - 1)) * s
      const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
      const m = l - c / 2
      
      let r, g, b
      
      if (h >= 0 && h < 60) {
        r = c; g = x; b = 0
      } else if (h >= 60 && h < 120) {
        r = x; g = c; b = 0
      } else if (h >= 120 && h < 180) {
        r = 0; g = c; b = x
      } else if (h >= 180 && h < 240) {
        r = 0; g = x; b = c
      } else if (h >= 240 && h < 300) {
        r = x; g = 0; b = c
      } else {
        r = c; g = 0; b = x
      }
      
      const hexR = Math.round((r + m) * 255).toString(16).padStart(2, '0')
      const hexG = Math.round((g + m) * 255).toString(16).padStart(2, '0')
      const hexB = Math.round((b + m) * 255).toString(16).padStart(2, '0')
      
      return `#${hexR}${hexG}${hexB}`.toUpperCase()
    }
    
    // Жизненные циклы
    onMounted(() => {
      initCanvas()
      selectedColor.value = props.initialColor
    })
    
    onUnmounted(() => {
      // Удаляем обработчики событий
      if (colorWheelCanvas.value) {
        colorWheelCanvas.value.removeEventListener('mousedown', handleMouseDown)
        colorWheelCanvas.value.removeEventListener('mousemove', handleMouseMove)
        colorWheelCanvas.value.removeEventListener('mouseup', handleMouseUp)
        colorWheelCanvas.value.removeEventListener('mouseleave', handleMouseUp)
      }
    })

    return {
      colorWheelCanvas,
      selectedColor,
      isDragging
    }
  }
}
</script>

<style scoped>
.color-wheel-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.selected-color {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid #333;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.color-code {
  font-family: monospace;
  font-weight: bold;
  font-size: 1.1rem;
  color: var(--text-primary);
}

.instruction {
  color: var(--text-secondary);
  font-size: 0.9rem;
  text-align: center;
  max-width: 80%;
}

canvas {
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>