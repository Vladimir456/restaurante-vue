<template>
  <div class="page">
    <NavBar />
    <div class="page-content">

      <!-- Header -->
      <div class="page-header">
        <div>
          <h1>🍜 Platos</h1>
          <p>Gestiona los platos del menú</p>
        </div>
        <button class="btn-primary" @click="abrirModal()">+ Nuevo Plato</button>
      </div>

      <!-- Filtros -->
      <div class="filtros">
        <input v-model="busqueda" type="text" placeholder="🔍 Buscar plato..." class="search-input" />
        <select v-model="categoriaFiltro" class="select-filtro">
          <option value="">Todas las categorías</option>
          <option v-for="cat in categorias" :key="cat.id" :value="cat.id">
            {{ cat.icono }} {{ cat.nombre }}
          </option>
        </select>
      </div>

      <!-- Cards de platos -->
      <div class="platos-grid">
        <div v-if="platosFiltrados.length === 0" class="empty-state">
          <span>🍽️</span>
          <p>No se encontraron platos</p>
        </div>

        <div v-for="plato in platosFiltrados" :key="plato.id" class="plato-card">
          <div class="plato-img-wrap">
            <img :src="plato.imagen" :alt="plato.nombre" @error="onImgError" />
            <span class="badge" :class="plato.disponible ? 'badge-ok' : 'badge-no'">
              {{ plato.disponible ? 'Disponible' : 'No disponible' }}
            </span>
          </div>
          <div class="plato-body">
            <div class="plato-cat">{{ getCatNombre(plato.categoriaId) }}</div>
            <h3>{{ plato.nombre }}</h3>
            <p>{{ plato.descripcion }}</p>
            <div class="plato-footer">
              <span class="precio">Bs. {{ plato.precio }}</span>
              <div class="plato-actions">
                <router-link :to="`/platos/${plato.id}`" class="btn-ver">👁️</router-link>
                <button class="btn-edit" @click="abrirModal(plato)">✏️</button>
                <button class="btn-delete" @click="eliminar(plato.id)">🗑️</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal -->
      <div v-if="modalAbierto" class="modal-overlay" @click.self="cerrarModal">
        <div class="modal">
          <h2>{{ editando ? 'Editar Plato' : 'Nuevo Plato' }}</h2>
          <form @submit.prevent="guardar">
            <div class="form-row">
              <div class="form-group">
                <label>Nombre</label>
                <input v-model="form.nombre" type="text" placeholder="Nombre del plato" required />
              </div>
              <div class="form-group">
                <label>Precio (Bs.)</label>
                <input v-model.number="form.precio" type="number" placeholder="0" required />
              </div>
            </div>
            <div class="form-group">
              <label>Descripción</label>
              <input v-model="form.descripcion" type="text" placeholder="Descripción del plato" required />
            </div>
            <div class="form-group">
              <label>URL de imagen</label>
              <input v-model="form.imagen" type="text" placeholder="https://..." />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Categoría</label>
                <select v-model.number="form.categoriaId" required>
                  <option value="">Seleccionar...</option>
                  <option v-for="cat in categorias" :key="cat.id" :value="cat.id">
                    {{ cat.icono }} {{ cat.nombre }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label>Disponibilidad</label>
                <select v-model="form.disponible">
                  <option :value="true">✅ Disponible</option>
                  <option :value="false">❌ No disponible</option>
                </select>
              </div>
            </div>
            <p v-if="error" class="error-msg">{{ error }}</p>
            <div class="modal-actions">
              <button type="button" class="btn-cancel" @click="cerrarModal">Cancelar</button>
              <button type="submit" class="btn-primary">{{ editando ? 'Actualizar' : 'Crear' }}</button>
            </div>
          </form>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import NavBar from '@/components/NavBar.vue'
import { getPlatos, createPlato, updatePlato, deletePlato } from '@/services/platos'
import { getCategorias } from '@/services/categorias'

const platos = ref([])
const categorias = ref([])
const busqueda = ref('')
const categoriaFiltro = ref('')
const modalAbierto = ref(false)
const editando = ref(null)
const error = ref('')

const form = ref({
  nombre: '', descripcion: '', precio: 0,
  imagen: '', categoriaId: '', disponible: true
})

const platosFiltrados = computed(() =>
  platos.value.filter(p => {
    const matchBusqueda = p.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      p.descripcion.toLowerCase().includes(busqueda.value.toLowerCase())
    const matchCategoria = categoriaFiltro.value === '' || p.categoriaId === Number(categoriaFiltro.value)
    return matchBusqueda && matchCategoria
  })
)

function getCatNombre(id) {
  const cat = categorias.value.find(c => c.id === id)
  return cat ? `${cat.icono} ${cat.nombre}` : ''
}

function onImgError(e) {
  e.target.src = 'https://via.placeholder.com/400x200?text=Sin+imagen'
}

async function cargar() {
  const [p, c] = await Promise.all([getPlatos(), getCategorias()])
  platos.value = p.data
  categorias.value = c.data
}

function abrirModal(plato = null) {
  editando.value = plato
  form.value = plato
    ? { ...plato }
    : { nombre: '', descripcion: '', precio: 0, imagen: '', categoriaId: '', disponible: true }
  error.value = ''
  modalAbierto.value = true
}

function cerrarModal() {
  modalAbierto.value = false
  editando.value = null
}

async function guardar() {
  try {
    if (editando.value) {
      await updatePlato(editando.value.id, form.value)
    } else {
      await createPlato(form.value)
    }
    await cargar()
    cerrarModal()
  } catch (e) {
    error.value = 'Error al guardar. Intenta de nuevo.'
  }
}

async function eliminar(id) {
  if (!confirm('¿Eliminar este plato?')) return
  await deletePlato(id)
  await cargar()
}

onMounted(cargar)
</script>

<style scoped>
.page { min-height: 100vh; background: #f5f6fa; }
.page-content { max-width: 1100px; margin: 0 auto; padding: 2rem 1rem; }
.page-header {
  display: flex; justify-content: space-between;
  align-items: center; margin-bottom: 1.5rem;
}
.page-header h1 { font-size: 1.8rem; color: #1a1a2e; margin: 0 0 0.25rem; }
.page-header p { color: #666; margin: 0; }
.btn-primary {
  background: linear-gradient(135deg, #e94560, #c73652);
  color: white; border: none; padding: 0.65rem 1.25rem;
  border-radius: 8px; font-weight: 600; cursor: pointer; transition: opacity 0.2s;
}
.btn-primary:hover { opacity: 0.9; }
.filtros { display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
.search-input {
  flex: 1; min-width: 200px; padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0; border-radius: 10px; font-size: 1rem;
}
.search-input:focus { outline: none; border-color: #e94560; }
.select-filtro {
  padding: 0.75rem 1rem; border: 2px solid #e0e0e0;
  border-radius: 10px; font-size: 1rem; background: white; cursor: pointer;
}
.select-filtro:focus { outline: none; border-color: #e94560; }
.platos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}
.empty-state {
  grid-column: 1/-1; text-align: center;
  padding: 3rem; color: #999;
}
.empty-state span { font-size: 3rem; }
.plato-card {
  background: white; border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
  overflow: hidden; transition: transform 0.2s, box-shadow 0.2s;
}
.plato-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
.plato-img-wrap { position: relative; height: 180px; }
.plato-img-wrap img { width: 100%; height: 100%; object-fit: cover; }
.badge {
  position: absolute; top: 0.75rem; right: 0.75rem;
  padding: 0.25rem 0.6rem; border-radius: 20px;
  font-size: 0.75rem; font-weight: 600;
}
.badge-ok { background: #d4edda; color: #155724; }
.badge-no { background: #f8d7da; color: #721c24; }
.plato-body { padding: 1rem; }
.plato-cat { font-size: 0.8rem; color: #e94560; font-weight: 600; margin-bottom: 0.25rem; }
.plato-body h3 { margin: 0 0 0.5rem; color: #1a1a2e; font-size: 1.1rem; }
.plato-body p { color: #666; font-size: 0.9rem; margin: 0 0 0.75rem; }
.plato-footer { display: flex; justify-content: space-between; align-items: center; }
.precio { font-size: 1.2rem; font-weight: 700; color: #e94560; }
.plato-actions { display: flex; gap: 0.4rem; }
.btn-ver {
  background: #f0f7ff; color: #3498db; border: none;
  padding: 0.4rem 0.6rem; border-radius: 6px; cursor: pointer;
  text-decoration: none; font-size: 0.9rem;
}
.btn-edit {
  background: #f0f7ff; color: #3498db; border: none;
  padding: 0.4rem 0.6rem; border-radius: 6px; cursor: pointer;
}
.btn-delete {
  background: #fff0f2; color: #e94560; border: none;
  padding: 0.4rem 0.6rem; border-radius: 6px; cursor: pointer;
}
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center; z-index: 200;
}
.modal {
  background: white; border-radius: 16px; padding: 2rem;
  width: 100%; max-width: 540px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  max-height: 90vh; overflow-y: auto;
}
.modal h2 { margin: 0 0 1.5rem; color: #1a1a2e; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.form-group { margin-bottom: 1.25rem; }
.form-group label { display: block; font-weight: 600; color: #333; margin-bottom: 0.4rem; font-size: 0.9rem; }
.form-group input,
.form-group select {
  width: 100%; padding: 0.75rem 1rem; border: 2px solid #e0e0e0;
  border-radius: 8px; font-size: 1rem; box-sizing: border-box;
  transition: border-color 0.3s;
}
.form-group input:focus,
.form-group select:focus { outline: none; border-color: #e94560; }
.modal-actions { display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: 1rem; }
.btn-cancel {
  background: #f0f0f0; color: #333; border: none;
  padding: 0.65rem 1.25rem; border-radius: 8px; cursor: pointer; font-weight: 600;
}
.error-msg { color: #e94560; font-size: 0.875rem; }

@media (max-width: 600px) {
  .page-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
  .form-row { grid-template-columns: 1fr; }
}
</style>