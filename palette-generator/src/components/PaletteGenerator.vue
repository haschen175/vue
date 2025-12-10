<template>
  <div class="generator">
    <!-- Выбор базового цвета -->
    <div class="base-color-section">
      <h3>Выбор базового цвета</h3>
      <ColorWheel :initial-color="baseColor" @color-selected="setBaseColor" />
    </div>
    
    <!-- Тип генерации -->
    <div class="generation-controls">
      <div class="control-group">
        <label>Тип генерации:</label>
        <select v-model="generationType" class="control-select">
          <option value="random">Случайная</option>
          <option value="harmonic">Гармоничная</option>
          <option value="mood">По настроению</option>
        </select>
      </div>
      
      <!-- Опции для гармоничной генерации -->
      <div v-if="generationType === 'harmonic'" class="control-group">
        <label>Тип палитры:</label>
        <select v-model="paletteType" class="control-select">
          <option value="complementary">Комплементарная</option>
          <option value="analogous">Аналогичная</option>
          <option value="triadic">Триада</option>
          <option value="monochromatic">Монохромная</option>
        </select>
      </div>
      
      <!-- Опции для генерации по настроению -->
      <div v-if="generationType === 'mood'" class="control-group">
        <label>Настроение:</label>
        <select v-model="moodType" class="control-select">
          <option value="calm">Спокойные</option>
          <option value="energetic">Энергичные</option>
          <option value="professional">Профессиональные</option>
        </select>
      </div>
      
      <!-- Общие настройки -->
      <div class="control-group">
        <label>Количество цветов:</label>
        <select v-model.number="colorCount" class="control-select">
          <option :value="3">3 цвета</option>
          <option :value="5">5 цветов</option>
          <option :value="7">7 цветов</option>
        </select>
      </div>
      
      <div class="control-group">
        <label>Формат отображения:</label>
        <select v-model="displayFormat" class="control-select">
          <option value="hex">HEX</option>
          <option value="rgb">RGB</option>
        </select>
      </div>
      
      <div class="button-group">
        <button @click="generatePalette" class="btn btn-primary generate-btn">Сгенерировать</button>
        <button @click="toggleTheme" class="btn btn-secondary theme-btn">
          {{ isDark ? 'Светлая тема' : 'Тёмная тема' }}
        </button>
        <button @click="saveToLibrary" class="btn btn-success save-btn" :disabled="!paletteName">
          Сохранить в библиотеку
        </button>
      </div>
      
      <div class="palette-name-container">
        <input 
          v-model="paletteName" 
          placeholder="Название палитры" 
          class="palette-name-input"
        />
      </div>
    </div>
    
    <!-- Палитра -->
    <div class="palette" :class="{ 'dark-theme': isDark }">
      <div
        v-for="(color, index) in displayedPalette"
        :key="index"
        class="color-item"
        :style="{ backgroundColor: color.hex }"
        @click="copyColor(color)"
      >
        <span class="color-value">{{ color.display }}</span>
        <button
          @click.stop="toggleLock(index)"
          class="lock-btn"
          :class="{ locked: color.locked }"
          title="Закрепить/открепить цвет"
        >
          {{ color.locked ? '🔒' : '🔓' }}
        </button>
        <div v-if="index === 0" class="contrast-info">
          <span>Контраст с фоном:</span>
          <span :class="`wcag-level-${getWCAGLevel(getContrastRatio(color.hex, isDark ? '#121212' : '#ffffff'))}`">
            {{ getWCAGLevel(getContrastRatio(color.hex, isDark ? '#121212' : '#ffffff')) }}
          </span>
        </div>
      </div>
    </div>
    
    <!-- Превью -->
    <PalettePreview :colors="currentPalette.map(c => c.hex)" :is-dark="isDark" />
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import ColorWheel from './ColorWheel.vue'
import PalettePreview from './PalettePreview.vue'
import { 
  randomHex, 
  generateHarmonicColors,
  generateMoodPalette,
  getContrastRatio,
  getWCAGLevel
} from '../composables/useColorGenerator.js'

export default {
  components: { ColorWheel, PalettePreview },
  setup() {
    // Реактивные переменные
    const baseColor = ref('#3498db')
    const generationType = ref('harmonic')
    const paletteType = ref('complementary')
    const moodType = ref('calm')
    const colorCount = ref(5)
    const displayFormat = ref('hex')
    const isDark = ref(false)
    const currentPalette = ref([])
    const paletteName = ref('')
    
    // Шоу нотификаций
    const notification = ref({
      show: false,
      message: '',
      type: 'success'
    })
    
    // Установка базового цвета
    const setBaseColor = (color) => {
      baseColor.value = color
    }
    
    // Генерация палитры
    const generatePalette = () => {
      let newPalette = []
      
      if (generationType.value === 'random') {
        // Случайная генерация
        for (let i = 0; i < colorCount.value; i++) {
          if (i < currentPalette.value.length && currentPalette.value[i]?.locked) {
            newPalette.push(currentPalette.value[i])
          } else {
            newPalette.push({ hex: randomHex(), locked: false })
          }
        }
      } else if (generationType.value === 'harmonic') {
        // Гармоничная генерация на основе базового цвета
        let baseHex = baseColor.value
        
        // Проверяем, есть ли закрепленный первый цвет
        if (currentPalette.value.length > 0 && currentPalette.value[0]?.locked) {
          baseHex = currentPalette.value[0].hex
        }
        
        const harmonicColors = generateHarmonicColors(baseHex, paletteType.value, colorCount.value)
        
        for (let i = 0; i < colorCount.value; i++) {
          // Если цвет закреплен и существует в текущей палитре, используем его
          if (i < currentPalette.value.length && currentPalette.value[i]?.locked) {
            newPalette.push(currentPalette.value[i])
          } else {
            // Используем сгенерированный цвет
            const hex = harmonicColors[i % harmonicColors.length]
            newPalette.push({ hex, locked: false })
          }
        }
      } else if (generationType.value === 'mood') {
        // Генерация по настроению
        const moodColors = generateMoodPalette(moodType.value, colorCount.value)
        
        for (let i = 0; i < colorCount.value; i++) {
          if (i < currentPalette.value.length && currentPalette.value[i]?.locked) {
            newPalette.push(currentPalette.value[i])
          } else {
            newPalette.push({ hex: moodColors[i], locked: false })
          }
        }
      }
      
      currentPalette.value = newPalette
      showNotification('Палитра успешно сгенерирована!')
    }
    
    // Отображение палитры
    const displayedPalette = computed(() => {
      return currentPalette.value.map(color => ({
        ...color,
        display: displayFormat.value === 'rgb' 
          ? hexToRgbString(color.hex) 
          : color.hex
      }))
    })
    
    // Конвертация HEX в RGB строку
    const hexToRgbString = (hex) => {
      const { r, g, b } = hexToRgb(hex)
      return `rgb(${r}, ${g}, ${b})`
    }
    
    // Копирование цвета
    const copyColor = async (color) => {
      try {
        await navigator.clipboard.writeText(color.display)
        showNotification(`Цвет ${color.display} скопирован!`)
      } catch (err) {
        showNotification('Ошибка при копировании цвета', true)
      }
    }
    
    // Переключение закрепления цвета
    const toggleLock = (index) => {
      currentPalette.value[index].locked = !currentPalette.value[index].locked
      showNotification(`Цвет ${currentPalette.value[index].locked ? 'закреплен' : 'откреплен'}`)
    }
    
    // Переключение темы
    const toggleTheme = () => {
      isDark.value = !isDark.value
      localStorage.setItem('isDarkTheme', JSON.stringify(isDark.value))
      showNotification(isDark.value ? 'Тёмная тема включена' : 'Светлая тема включена')
    }
    
    // Сохранение в библиотеку
    const saveToLibrary = () => {
      if (!paletteName.value.trim()) {
        showNotification('Введите название палитры', true)
        return
      }
      
      const paletteToSave = {
        id: Date.now(),
        name: paletteName.value.trim(),
        colors: currentPalette.value.map(c => c.hex),
        type: generationType.value,
        paletteType: generationType.value === 'harmonic' ? paletteType.value : null,
        moodType: generationType.value === 'mood' ? moodType.value : null,
        createdAt: new Date().toISOString()
      }
      
      // Получаем текущую библиотеку из localStorage
      const library = JSON.parse(localStorage.getItem('colorPalettes') || '[]')
      library.push(paletteToSave)
      localStorage.setItem('colorPalettes', JSON.stringify(library))
      
      showNotification('Палитра сохранена в библиотеку!')
      paletteName.value = ''
    }
    
    // Показать уведомление
    const showNotification = (message, isError = false) => {
      notification.value = {
        show: true,
        message: message,
        type: isError ? 'error' : 'success'
      }
      
      setTimeout(() => {
        notification.value.show = false
      }, 3000)
    }
    
    // Загрузка темы из localStorage
    onMounted(() => {
      const savedTheme = localStorage.getItem('isDarkTheme')
      if (savedTheme !== null) {
        isDark.value = JSON.parse(savedTheme)
      }
      
      // Генерация начальной палитры
      generatePalette()
    })
    
    // Сохранение текущей палитры в localStorage
    watch(currentPalette, (newVal) => {
      localStorage.setItem('currentPalette', JSON.stringify(newVal))
    }, { deep: true })
    
    // Загрузка палитры из localStorage
    onMounted(() => {
      const savedPalette = localStorage.getItem('currentPalette')
      if (savedPalette) {
        try {
          currentPalette.value = JSON.parse(savedPalette)
        } catch (e) {
          console.error('Ошибка при загрузке палитры:', e)
          generatePalette()
        }
      }
    })
    
    // Вспомогательные функции для работы с цветами
    const hexToRgb = (hex) => {
      hex = hex.replace('#', '')
      
      if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('')
      }
      
      const r = parseInt(hex.substring(0, 2), 16)
      const g = parseInt(hex.substring(2, 4), 16)
      const b = parseInt(hex.substring(4, 6), 16)
      
      return { r, g, b }
    }
    
    return {
      baseColor,
      generationType,
      paletteType,
      moodType,
      colorCount,
      displayFormat,
      isDark,
      currentPalette,
      paletteName,
      displayedPalette,
      notification,
      setBaseColor,
      generatePalette,
      copyColor,
      toggleLock,
      toggleTheme,
      saveToLibrary,
      getContrastRatio,
      getWCAGLevel,
      hexToRgbString
    }
  }
}
</script>

<style scoped>
.generator {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.base-color-section {
  text-align: center;
  margin-bottom: 30px;
}

.base-color-section h3 {
  margin-bottom: 15px;
  color: var(--text-primary);
}

.generation-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 30px;
  align-items: center;
  background-color: var(--card-bg);
  padding: 20px;
  border-radius: 10px;
  border: 1px solid var(--border-color);
}

.control-group {
  display: flex;
  flex-direction: column;
  min-width: 180px;
}

.control-group label {
  margin-bottom: 5px;
  font-weight: 500;
  color: var(--text-primary);
}

.control-select {
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-size: 1rem;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.palette-name-container {
  margin-top: 10px;
  flex: 1;
  min-width: 200px;
}

.palette-name-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-size: 1rem;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.btn:active {
  transform: translateY(0);
}

.btn-primary {
  background-color: var(--button-primary);
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-success {
  background-color: var(--button-success);
  color: white;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.palette {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 30px;
  padding: 15px;
  border-radius: 10px;
  background-color: var(--bg-secondary);
}

.color-item {
  position: relative;
  flex: 1;
  min-width: 120px;
  height: 140px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  overflow: hidden;
  color: white;
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.7);
  transition: transform 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.color-item:hover {
  transform: translateY(-2px);
  z-index: 10;
}

.color-value {
  padding: 6px 12px;
  background-color: rgba(0, 0, 0, 0.6);
  width: 100%;
  text-align: center;
  font-family: monospace;
  font-weight: 500;
  font-size: 0.95rem;
}

.lock-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.85);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
}

.lock-btn:hover {
  transform: scale(1.1);
}

.lock-btn.locked {
  background-color: #ffc107;
  color: #333;
}

.contrast-info {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.7);
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 100px;
}

.wcag-level-AA { color: #ffc107; }
.wcag-level-AAA { color: #28a745; }
.wcag-level-FAIL { color: #dc3545; }
</style>