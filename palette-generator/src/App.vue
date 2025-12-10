<template>
  <div id="app" :class="{ 'dark': isDarkTheme }">
    <header class="app-header">
      <div class="container">
        <h1>🎨 Генератор цветовых палитр</h1>
        <nav class="main-nav">
          <router-link to="/" class="nav-link" active-class="active">Генератор</router-link>
          <router-link to="/library" class="nav-link" active-class="active">Библиотека</router-link>
        </nav>
      </div>
    </header>

    <main class="main-content">
      <router-view />
    </main>

    <footer class="app-footer">
      <div class="container">
        <p>2025</p>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  setup() {
    const isDarkTheme = ref(false)

    onMounted(() => {
      const savedTheme = localStorage.getItem('isDarkTheme')
      if (savedTheme !== null) {
        isDarkTheme.value = JSON.parse(savedTheme)
      } else {
        isDarkTheme.value = window.matchMedia('(prefers-color-scheme: dark)').matches
      }
    })

    return {
      isDarkTheme
    }
  }
}
</script>

<style>
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --text-primary: #212529;
  --text-secondary: #6c757d;
  --border-color: #dee2e6;
  --card-bg: #ffffff;
  --button-primary: #007bff;
  --button-success: #28a745;
  --button-warning: #ffc107;
  --button-danger: #dc3545;
}

:root.dark {
  --bg-primary: #121212;
  --bg-secondary: #1e1e1e;
  --text-primary: #e0e0e0;
  --text-secondary: #a0a0a0;
  --border-color: #333333;
  --card-bg: #252525;
  --button-primary: #0d6efd;
  --button-success: #218838;
  --button-warning: #d39e00;
  --button-danger: #c82333;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: background-color 0.3s, color 0.3s;
  line-height: 1.6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.app-header h1 {
  text-align: center;
  margin-bottom: 1rem;
  font-size: 2rem;
}

.main-nav {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.nav-link:hover, .nav-link.active {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.main-content {
  min-height: calc(100vh - 180px);
  padding: 2rem 0;
}

.app-footer {
  background-color: var(--bg-secondary);
  color: var(--text-secondary);
  text-align: center;
  padding: 1rem 0;
  border-top: 1px solid var(--border-color);
  margin-top: auto;
}

.notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 12px 20px;
  border-radius: 6px;
  color: white;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  transform: translateX(120%);
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.notification.show {
  transform: translateX(0);
}

.notification.success {
  background-color: var(--button-success);
}

.notification.error {
  background-color: var(--button-danger);
}

@keyframes slideIn {
  from {
    transform: translateX(120%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>