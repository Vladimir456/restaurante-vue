<template>
  <div class="dashboard">
    <NavBar />
    <div class="dashboard-content">
      <div class="welcome-banner">
        <div class="welcome-text">
          <h1>¡Bienvenido! 👋</h1>
          <p>{{ authStore.user?.email }}</p>
        </div>
        <span class="banner-icon">🍽️</span>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-icon">📂</span>
          <div>
            <h3>{{ totalCategorias }}</h3>
            <p>Categorías</p>
          </div>
        </div>
        <div class="stat-card">
          <span class="stat-icon">🍜</span>
          <div>
            <h3>{{ totalPlatos }}</h3>
            <p>Platos</p>
          </div>
        </div>
        <div class="stat-card">
          <span class="stat-icon">✅</span>
          <div>
            <h3>{{ platosDisponibles }}</h3>
            <p>Disponibles</p>
          </div>
        </div>
      </div>

      <div class="quick-actions">
        <h2>Acciones rápidas</h2>
        <div class="actions-grid">
          <router-link to="/categorias" class="action-card">
            <span>📂</span>
            <p>Gestionar Categorías</p>
          </router-link>
          <router-link to="/platos" class="action-card">
            <span>🍜</span>
            <p>Gestionar Platos</p>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import NavBar from '@/components/NavBar.vue'
import { useAuthStore } from '@/stores/auth'
import { getCategorias } from '@/services/categorias'
import { getPlatos } from '@/services/platos'

const authStore = useAuthStore()
const totalCategorias = ref(0)
const totalPlatos = ref(0)
const platosDisponibles = ref(0)

onMounted(async () => {
  const [cats, plats] = await Promise.all([getCategorias(), getPlatos()])
  totalCategorias.value = cats.data.length
  totalPlatos.value = plats.data.length
  platosDisponibles.value = plats.data.filter(p => p.disponible).length
})
</script>

<style scoped>
.dashboard { min-height: 100vh; background: #f5f6fa; }
.dashboard-content { max-width: 1100px; margin: 0 auto; padding: 2rem 1rem; }
.welcome-banner {
  background: linear-gradient(135deg, #1a1a2e, #e94560);
  border-radius: 16px; padding: 2rem;
  display: flex; justify-content: space-between; align-items: center;
  color: white; margin-bottom: 2rem;
}
.welcome-text h1 { font-size: 1.8rem; margin: 0 0 0.25rem; }
.welcome-text p { opacity: 0.85; margin: 0; }
.banner-icon { font-size: 4rem; }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
.stat-card {
  background: white; border-radius: 12px; padding: 1.5rem;
  display: flex; align-items: center; gap: 1rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
}
.stat-icon { font-size: 2.5rem; }
.stat-card h3 { font-size: 2rem; margin: 0; color: #1a1a2e; }
.stat-card p { margin: 0; color: #666; font-size: 0.9rem; }
.quick-actions h2 { color: #1a1a2e; margin-bottom: 1rem; }
.actions-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }
.action-card {
  background: white; border-radius: 12px; padding: 2rem;
  text-align: center; text-decoration: none; color: #1a1a2e;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
  transition: transform 0.2s, box-shadow 0.2s;
}
.action-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
.action-card span { font-size: 3rem; }
.action-card p { margin: 0.75rem 0 0; font-weight: 600; }
</style>