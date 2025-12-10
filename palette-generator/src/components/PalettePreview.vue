<template>
  <div class="preview-container" :class="{ 'dark-theme': isDark }">
    <h3>Превью интерфейса</h3>
    <div class="preview-content">
      <div class="preview-header">
        Заголовок страницы
      </div>
      <div class="preview-card">
        <p>Текст карточки контента. Используется основной цвет фона и контрастный текст.</p>
        <button class="preview-button">Кнопка</button>
      </div>
      <div class="preview-nav">
        <div class="nav-item active">Главная</div>
        <div class="nav-item">О нас</div>
        <div class="nav-item">Контакты</div>
      </div>
      <div class="preview-footer">
        <p>Футер сайта с информацией</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    colors: {
      type: Array,
      required: true,
      default: () => ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6']
    },
    isDark: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.preview-container {
  margin-top: 30px;
  padding: 20px;
  border-radius: 12px;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.preview-container h3 {
  margin-bottom: 15px;
  color: var(--text-primary);
}

.preview-content {
  background-color: #f8f9fa;
  padding: 25px;
  border-radius: 10px;
}

.dark-theme .preview-content {
  background-color: #2d2d2d;
}

.preview-header {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
  padding-bottom: 10px;
  border-bottom: 2px solid #e9ecef;
}

.dark-theme .preview-header {
  color: #f0f0f0;
  border-bottom-color: #444;
}

.preview-card {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  color: #333;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.dark-theme .preview-card {
  background-color: #333;
  color: #e0e0e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.preview-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  margin-top: 10px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.preview-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.preview-button:active {
  transform: translateY(0);
}

.preview-nav {
  display: flex;
  gap: 10px;
  margin: 20px 0;
  padding-top: 15px;
  border-top: 1px solid #e9ecef;
}

.dark-theme .preview-nav {
  border-top-color: #444;
}

.nav-item {
  padding: 10px 15px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  background-color: #e9ecef;
  color: #333;
}

.dark-theme .nav-item {
  background-color: #444;
  color: #e0e0e0;
}

.nav-item:hover {
  background-color: #ddd;
}

.dark-theme .nav-item:hover {
  background-color: #555;
}

.nav-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.preview-footer {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #e9ecef;
  color: #666;
  font-size: 0.9rem;
}

.dark-theme .preview-footer {
  border-top-color: #444;
  color: #aaa;
}
</style>