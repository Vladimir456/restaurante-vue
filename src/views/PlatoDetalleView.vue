<template>
  <div class="page">
    <NavBar />
    <div class="page-content">

      <button class="btn-back" @click="router.back()">← Volver</button>

      <div v-if="loading" class="loading">
        <span>⏳ Cargando plato...</span>
      </div>

      <div v-else-if="plato" class="detalle-card">
        <div class="detalle-img">
          <img :src="plato.imagen" :alt="plato.nombre" @error="onImgError" />
          <span class="badge" :class="plato.disponible ? 'badge-ok' : 'badge-no'">
            {{ plato.disponible ? '✅ Disponible' : '❌ No disponible' }}
          </span>
        </div>

        <div class="detalle-info">
          <div class="detalle-cat">{{ catNombre }}</div>
          <h1>{{ plato.nombre }}</h1>
          <p class="detalle-desc">{{ plato.descripcion }}</p>

          <div class="detalle-precio">
            <span class="precio-label">Precio</span>
            <span class="precio-valor">Bs. {{ plato.precio }}</span>
          </div>

          <div class="detalle-meta">
            <div class="meta-item">
              <span class="meta-icon">📂</span>
              <div>
                <span class="meta-label">Categoría</span>
                <span class="meta-valor">{{ catNombre }}</span>
              </div>
            </div>
            <div class="meta-item">
              <span class="meta-icon">🔖</span>
              <div>
                <span class="meta-label">ID del plato</span>
                <span class="meta-valor">#{{ plato.id }}</span>
              </div>
            </div>
          </div>

          <div class="detalle-btns">
            <button class="btn-primary" @click="router.push('/platos')">
              🍜 Ver todos los platos
            </button>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <span>😕</span>
        <p>Plato no encontrado</p>
        <button class="btn-primary" @click="router.push('/platos')">Volver a Platos</button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import { getPlato } from '@/services/platos'
import { getCategorias } from '@/services/categorias'

const route = useRoute()
const router = useRouter()
const plato = ref(null)
const categorias = ref([])
const loading = ref(true)

const catNombre = computed(() => {
  const cat = categorias.value.find(c => c.id === plato.value?.categoriaId)
  return cat ? `${cat.icono} ${cat.nombre}` : ''
})

function onImgError(e) {
  e.target.src = 'https://via.placeholder.com/600x400?text=Sin+imagen'
}

onMounted(async () => {
  try {
    const [p, c] = await Promise.all([
      getPlato(route.params.id),
      getCategorias()
    ])
    plato.value = p.data
    categorias.value = c.data
  } catch {
    plato.value = null
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.page { min-height: 100vh; background: #f5f6fa; }
.page-content { max-width: 900px; margin: 0 auto; padding: 2rem 1rem; }
.btn-back {
  background: none; border: none; color: #e94560;
  font-size: 1rem; font-weight: 600; cursor: pointer;
  margin-bottom: 1.5rem; padding: 0;
}
.btn-back:hover { text-decoration: underline; }
.loading, .empty-state {
  text-align: center; padding: 4rem; color: #999;
}
.empty-state span { font-size: 3rem; }
.detalle-card {
  background: white; border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.1);
  overflow: hidden;
  display: grid; grid-template-columns: 1fr 1fr;
}
.detalle-img { position: relative; }
.detalle-img img { width: 100%; height: 100%; object-fit: cover; min-height: 400px; }
.badge {
  position: absolute; top: 1rem; left: 1rem;
  padding: 0.35rem 0.85rem; border-radius: 20px;
  font-size: 0.85rem; font-weight: 600;
}
.badge-ok { background: #d4edda; color: #155724; }
.badge-no { background: #f8d7da; color: #721c24; }
.detalle-info { padding: 2.5rem; }
.detalle-cat { color: #e94560; font-weight: 600; font-size: 0.9rem; margin-bottom: 0.5rem; }
.detalle-info h1 { font-size: 2rem; color: #1a1a2e; margin: 0 0 1rem; }
.detalle-desc { color: #555; line-height: 1.7; margin-bottom: 1.5rem; }
.detalle-precio {
  background: #fff5f7; border-radius: 12px; padding: 1rem 1.5rem;
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 1.5rem;
}
.precio-label { color: #666; font-size: 0.9rem; }
.precio-valor { font-size: 2rem; font-weight: 700; color: #e94560; }
.detalle-meta { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 2rem; }
.meta-item { display: flex; align-items: center; gap: 0.75rem; }
.meta-icon { font-size: 1.5rem; }
.meta-label { display: block; font-size: 0.75rem; color: #999; }
.meta-valor { font-weight: 600; color: #1a1a2e; }
.btn-primary {
  background: linear-gradient(135deg, #e94560, #c73652);
  color: white; border: none; padding: 0.85rem 1.5rem;
  border-radius: 8px; font-weight: 600; cursor: pointer;
  font-size: 1rem; transition: opacity 0.2s;
}
.btn-primary:hover { opacity: 0.9; }

@media (max-width: 700px) {
  .detalle-card { grid-template-columns: 1fr; }
  .detalle-img img { min-height: 250px; }
}
</style>