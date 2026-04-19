<template>
  <nav class="navbar">
    <div class="navbar-content">
      <router-link to="/dashboard" class="navbar-brand">
        🍽️ <span>Restaurante Vue</span>
      </router-link>

      <div class="navbar-links" :class="{ open: menuOpen }">
        <router-link to="/dashboard" @click="menuOpen = false">🏠 Dashboard</router-link>
        <router-link to="/categorias" @click="menuOpen = false">📂 Categorías</router-link>
        <router-link to="/platos" @click="menuOpen = false">🍜 Platos</router-link>
      </div>

      <div class="navbar-right">
        <span class="user-email">{{ authStore.user?.email }}</span>
        <button class="btn-logout" @click="handleLogout">Salir 🚪</button>
      </div>

      <button class="hamburger" @click="menuOpen = !menuOpen">☰</button>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const menuOpen = ref(false)

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.navbar {
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  padding: 0 1.5rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.3);
  position: sticky; top: 0; z-index: 100;
}
.navbar-content {
  max-width: 1100px; margin: 0 auto;
  display: flex; align-items: center;
  height: 64px; gap: 1rem;
}
.navbar-brand {
  font-size: 1.2rem; font-weight: 700; color: white;
  text-decoration: none; display: flex; align-items: center; gap: 0.5rem;
}
.navbar-brand span { color: #e94560; }
.navbar-links { display: flex; gap: 0.5rem; flex: 1; }
.navbar-links a {
  color: rgba(255,255,255,0.8); text-decoration: none;
  padding: 0.5rem 0.85rem; border-radius: 8px;
  font-size: 0.9rem; transition: all 0.2s;
}
.navbar-links a:hover,
.navbar-links a.router-link-active {
  background: rgba(233,69,96,0.2); color: #e94560;
}
.navbar-right { display: flex; align-items: center; gap: 0.75rem; margin-left: auto; }
.user-email { color: rgba(255,255,255,0.6); font-size: 0.85rem; }
.btn-logout {
  background: #e94560; color: white; border: none;
  padding: 0.45rem 1rem; border-radius: 8px;
  cursor: pointer; font-size: 0.85rem; transition: opacity 0.2s;
}
.btn-logout:hover { opacity: 0.85; }
.hamburger { display: none; background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer; }

@media (max-width: 768px) {
  .hamburger { display: block; }
  .navbar-links {
    display: none; position: absolute; top: 64px; left: 0; right: 0;
    background: #16213e; flex-direction: column; padding: 1rem;
  }
  .navbar-links.open { display: flex; }
  .user-email { display: none; }
}
</style>