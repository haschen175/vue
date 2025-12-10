<template>
  <div class="library-container">
    <h2 class="page-title">Библиотека палитр</h2>
    
    <div class="library-controls">
      <div class="search-container">
        <div class="search-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
          </svg>
        </div>
        <input 
          v-model="searchQuery" 
          placeholder="Поиск по названию..." 
          class="search-input"
        />
      </div>
      
      <div class="filters">
        <select v-model="filterType" class="filter-select">
          <option value="all">Все типы</option>
          <option value="random">Случайные</option>
          <option value="harmonic">Гармоничные</option>
          <option value="mood">По настроению</option>
        </select>
        
        <select v-model="sortBy" class="filter-select">
          <option value="date">Сортировать по дате</option>
          <option value="name">Сортировать по названию</option>
        </select>
      </div>
    </div>
    
    <div v-if="filteredPalettes.length === 0" class="empty-state">
      <div class="empty-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
          <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
          <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
        </svg>
      </div>
      <p class="empty-text">Нет сохраненных палитр. Перейдите на страницу генератора, чтобы создать палитру.</p>
      <router-link to="/" class="btn btn-primary go-to-generator">Создать палитру</router-link>
    </div>
    
    <div v-else class="palettes-grid">
      <div 
        v-for="palette in filteredPalettes" 
        :key="palette.id" 
        class="palette-card"
      >
        <div class="palette-header">
          <h3 class="palette-name">{{ palette.name }}</h3>
          <div class="palette-actions">
            <button @click.stop="toggleFavorite(palette)" class="action-btn favorite-btn" :class="{ active: isFavorite(palette.id) }" title="Добавить в избранное">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
              </svg>
            </button>
            <button @click.stop="exportPalette(palette)" class="action-btn export-btn" title="Экспортировать">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
              </svg>
            </button>
            <button @click.stop="deletePalette(palette.id)" class="action-btn delete-btn" title="Удалить">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M6.854 7.146a.5.5 0 1 0-.708.708L7.293 9l-1.147 1.146a.5.5 0 0 0 .708.708L8 9.707l1.146 1.147a.5.5 0 0 0 .708-.708L8.707 9l1.147-1.146a.5.5 0 0 0-.708-.708L8 8.293 6.854 7.146z"/>
                <path d="M14 14V4.5L9.5 0H6.5L2 4.5V14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 1.5a1.5 1.5 0 0 1 1.5 1.5v1.621l-3.621.532a.5.5 0 0 1-.562-.562L7.314 1.5H9.5zm-7 0A1.5 1.5 0 0 1 4 3v1.621l-3.621.532a.5.5 0 0 0-.562.562L0 7.857V14a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7.857l-.419-2.143a.5.5 0 0 0-.562-.562L12 4.621V3a1.5 1.5 0 0 1 1.5-1.5h-9z"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="palette-colors">
          <div 
            v-for="(color, index) in palette.colors" 
            :key="index" 
            class="palette-color"
            :style="{ backgroundColor: color }"
            @click.stop="copyColorFromLibrary(color)"
          ></div>
        </div>
        <div class="palette-meta">
          <span class="palette-type">{{ getPaletteTypeText(palette) }}</span>
          <span class="palette-date">{{ formatDate(palette.createdAt) }}</span>
        </div>
      </div>
    </div>
    
    <!-- Избранные палитры -->
    <div v-if="favoritePalettes.length > 0" class="favorites-section">
      <h3 class="section-title">Избранные палитры</h3>
      <div class="favorites-grid">
        <div 
          v-for="palette in favoritePalettes" 
          :key="'fav-' + palette.id" 
          class="palette-card favorite-card"
        >
          <div class="palette-header">
            <h3 class="palette-name">{{ palette.name }}</h3>
            <div class="palette-actions">
              <button @click.stop="toggleFavorite(palette)" class="action-btn favorite-btn active" title="Удалить из избранного">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="palette-colors">
            <div 
              v-for="(color, index) in palette.colors" 
              :key="index" 
              class="palette-color"
              :style="{ backgroundColor: color }"
              @click.stop="copyColorFromLibrary(color)"
            ></div>
          </div>
          <div class="palette-meta">
            <span class="palette-type">{{ getPaletteTypeText(palette) }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Уведомление -->
    <div 
      v-if="notification.show" 
      :class="`notification ${notification.type}`"
    >
      {{ notification.message }}
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const router = useRouter()
    const palettes = ref([])
    const searchQuery = ref('')
    const filterType = ref('all')
    const sortBy = ref('date')
    const favorites = ref([])
    const notification = ref({
      show: false,
      message: '',
      type: 'success'
    })
    
    // Загрузка палитр из localStorage
    onMounted(() => {
      loadPalettes()
      loadFavorites()
    })
    
    const loadPalettes = () => {
      try {
        const savedPalettes = localStorage.getItem('colorPalettes')
        if (savedPalettes) {
          palettes.value = JSON.parse(savedPalettes)
        }
      } catch (error) {
        console.error('Ошибка при загрузке палитр:', error)
        palettes.value = []
      }
    }
    
    const loadFavorites = () => {
      try {
        const savedFavorites = localStorage.getItem('favoritePalettes')
        if (savedFavorites) {
          favorites.value = JSON.parse(savedFavorites)
        }
      } catch (error) {
        console.error('Ошибка при загрузке избранных палитр:', error)
        favorites.value = []
      }
    }
    
    const saveFavorites = () => {
      localStorage.setItem('favoritePalettes', JSON.stringify(favorites.value))
    }
    
    // Фильтрация и сортировка палитр
    const filteredPalettes = computed(() => {
      let result = [...palettes.value]
      
      // Фильтрация по поиску
      if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(palette => 
          palette.name.toLowerCase().includes(query)
        )
      }
      
      // Фильтрация по типу
      if (filterType.value !== 'all') {
        result = result.filter(palette => 
          palette.type === filterType.value
        )
      }
      
      // Сортировка
      result.sort((a, b) => {
        if (sortBy.value === 'name') {
          return a.name.localeCompare(b.name)
        } else {
          // Сортировка по дате (новые в начале)
          return new Date(b.createdAt) - new Date(a.createdAt)
        }
      })
      
      return result
    })
    
    // Избранные палитры
    const favoritePalettes = computed(() => {
      return palettes.value.filter(palette => 
        favorites.value.includes(palette.id)
      ).sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      )
    })
    
    // Проверка, является ли палитра избранной
    const isFavorite = (paletteId) => {
      return favorites.value.includes(paletteId)
    }
    
    // Переключение избранного статуса
    const toggleFavorite = (palette) => {
      const index = favorites.value.indexOf(palette.id)
      if (index === -1) {
        favorites.value.push(palette.id)
        showNotification('Палитра добавлена в избранное')
      } else {
        favorites.value.splice(index, 1)
        showNotification('Палитра удалена из избранного')
      }
      saveFavorites()
    }
    
    // Экспорт палитры
    const exportPalette = (palette) => {
      const exportOptions = [
        'CSS Variables',
        'SCSS Variables',
        'Tailwind Config'
      ]
      
      const formatIndex = prompt(
        'Выберите формат экспорта:\n' + 
        exportOptions.map((opt, i) => `${i + 1}. ${opt}`).join('\n'),
        '1'
      )
      
      const format = exportOptions[parseInt(formatIndex) - 1]
      
      if (format) {
        let code = ''
        switch (format) {
          case 'CSS Variables':
            code = `:root {\n${palette.colors.map((color, index) => 
              `  --color-${index + 1}: ${color};`).join('\n')}\n}`
            break
          case 'SCSS Variables':
            code = palette.colors.map((color, index) => 
              `$color-${index + 1}: ${color};`).join('\n')
            break
          case 'Tailwind Config':
            code = `module.exports = {\n  theme: {\n    extend: {\n      colors: {\n${palette.colors.map((color, index) => 
              `        'palette-${index + 1}': '${color}'`).join(',\n')}\n      }\n    }\n  }\n}`
            break
        }
        
        navigator.clipboard.writeText(code)
        showNotification(`Код для ${format} скопирован в буфер обмена!`)
      } else if (formatIndex !== null) {
        showNotification('Неверный формат экспорта', true)
      }
    }
    
    // Копирование цвета из библиотеки
    const copyColorFromLibrary = async (color) => {
      try {
        await navigator.clipboard.writeText(color)
        showNotification(`Цвет ${color} скопирован!`)
      } catch (err) {
        showNotification('Ошибка при копировании цвета', true)
      }
    }
    
    // Удаление палитры
    const deletePalette = (paletteId) => {
      if (confirm('Вы уверены, что хотите удалить эту палитру?')) {
        palettes.value = palettes.value.filter(p => p.id !== paletteId)
        // Удаляем из избранных, если есть
        if (favorites.value.includes(paletteId)) {
          favorites.value = favorites.value.filter(id => id !== paletteId)
          saveFavorites()
        }
        
        // Сохраняем изменения
        localStorage.setItem('colorPalettes', JSON.stringify(palettes.value))
        showNotification('Палитра удалена')
      }
    }
    
    // Форматирование даты
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    }
    
    // Получение текстового представления типа палитры
    const getPaletteTypeText = (palette) => {
      switch (palette.type) {
        case 'random': return 'Случайная'
        case 'harmonic': 
          return palette.paletteType === 'complementary' ? 'Комплементарная' :
                 palette.paletteType === 'analogous' ? 'Аналогичная' :
                 palette.paletteType === 'triadic' ? 'Триада' :
                 palette.paletteType === 'monochromatic' ? 'Монохромная' : 'Гармоничная'
        case 'mood':
          return palette.moodType === 'calm' ? 'Спокойная' :
                 palette.moodType === 'energetic' ? 'Энергичная' :
                 palette.moodType === 'professional' ? 'Профессиональная' : 'По настроению'
        default: return 'Неизвестная'
      }
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
    
    return {
      palettes,
      searchQuery,
      filterType,
      sortBy,
      favorites,
      notification,
      filteredPalettes,
      favoritePalettes,
      isFavorite,
      toggleFavorite,
      exportPalette,
      deletePalette,
      copyColorFromLibrary,
      formatDate,
      getPaletteTypeText
    }
  }
}
</script>

<style scoped>
.library-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-title {
  text-align: center;
  margin-bottom: 30px;
  color: var(--text-primary);
  font-size: 2.2rem;
}

.library-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 25px;
  align-items: center;
}

.search-container {
  position: relative;
  flex-grow: 1;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
}

.search-input {
  width: 100%;
  padding: 10px 12px 10px 36px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--button-primary);
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
}

.filters {
  display: flex;
  gap: 15px;
}

.filter-select {
  padding: 10px 15px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-size: 1rem;
  min-width: 180px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background-color: var(--card-bg);
  border-radius: 12px;
  border: 1px dashed var(--border-color);
}

.empty-icon {
  color: var(--text-secondary);
  margin-bottom: 15px;
}

.empty-text {
  color: var(--text-secondary);
  margin-bottom: 20px;
  font-size: 1.1rem;
}

.go-to-generator {
  display: inline-block;
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.palettes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
}

.palette-card {
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
}

.palette-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.12);
}

.palette-header {
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
}

.palette-name {
  margin: 0;
  font-size: 1.15rem;
  color: var(--text-primary);
  font-weight: 600;
}

.palette-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  background-color: var(--bg-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
  transition: all 0.2s ease;
}

.action-btn:hover {
  transform: scale(1.1);
}

.favorite-btn.active {
  color: #ffc107;
}

.export-btn {
  color: var(--button-success);
}

.delete-btn {
  color: var(--button-danger);
}

.palette-colors {
  display: flex;
  height: 80px;
}

.palette-color {
  flex: 1;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.palette-color:hover {
  transform: scale(1.05);
  z-index: 10;
  position: relative;
}

.palette-meta {
  padding: 12px 15px;
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: var(--text-secondary);
  border-top: 1px solid var(--border-color);
  background-color: var(--bg-secondary);
}

.palette-type {
  font-weight: 500;
  color: var(--button-primary);
}

.favorites-section {
  margin-top: 50px;
  padding-top: 30px;
  border-top: 1px solid var(--border-color);
}

.section-title {
  margin-bottom: 20px;
  color: var(--text-primary);
  font-size: 1.8rem;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.favorite-card {
  border: 2px solid #ffc107;
  position: relative;
}

.favorite-card::before {
  content: '⭐';
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: var(--bg-primary);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 10;
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
</style>