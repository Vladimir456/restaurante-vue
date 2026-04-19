<template>
  <div class="page">
    <NavBar />
    <div class="page-content">

      <!-- Header -->
      <div class="page-header">
        <div>
          <h1>📂 Categorías</h1>
          <p>Gestiona las categorías del menú</p>
        </div>
        <button class="btn-primary" @click="abrirModal()">+ Nueva Categoría</button>
      </div>

      <!-- Buscador -->
      <div class="search-bar">
        <input v-model="busqueda" type="text" placeholder="🔍 Buscar categoría..." />
      </div>

      <!-- Tabla -->
      <div class="table-card">
        <table>
          <thead>
            <tr>
              <th>Icono</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="categoriasFiltradas.length === 0">
              <td colspan="4" class="empty">No hay categorías</td>
            </tr>
            <tr v-for="cat in categoriasFiltradas" :key="cat.id">
              <td class="icono-cell">{{ cat.icono }}</td>
              <td><strong>{{ cat.nombre }}</strong></td>
              <td>{{ cat.descripcion }}</td>
              <td class="actions-cell">
                <button class="btn-edit" @click="abrirModal(cat)">✏️ Editar</button>
                <button class="btn-delete" @click="eliminar(cat.id)">🗑️ Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal -->
      <div v-if="modalAbierto" class="modal-overlay" @click.self="cerrarModal">
        <div class="modal">
          <h2>{{ editando ? 'Editar Categoría' : 'Nueva Categoría' }}</h2>
          <form @submit.prevent="guardar">
            <div class="form-group">
              <label>Nombre</label>
              <input v-model="form.nombre" type="text" placeholder="Ej: Entradas" required />
            </div>
            <div class="form-group">
              <label>Descripción</label>
              <input v-model="form.descripcion" type="text" placeholder="Descripción breve" required />
            </div>
            <div class="form-group">
              <label>Icono (emoji)</label>
              <input v-model="form.icono" type="text" placeholder="Ej: 🥗" required />
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
import { getCategorias, createCategoria, updateCategoria, deleteCategoria } from '@/services/categorias'

const categorias = ref([])
const busqueda = ref('')
const modalAbierto = ref(false)
const editando = ref(null)
const error = ref('')
const form = ref({ nombre: '', descripcion: '', icono: '' })

const categoriasFiltradas = computed(() =>
  categorias.value.filter(c =>
    c.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
    c.descripcion.toLowerCase().includes(busqueda.value.toLowerCase())
  )
)

async function cargar() {
  const res = await getCategorias()
  categorias.value = res.data
}

function abrirModal(cat = null) {
  editando.value = cat
  form.value = cat
    ? { nombre: cat.nombre, descripcion: cat.descripcion, icono: cat.icono }
    : { nombre: '', descripcion: '', icono: '' }
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
      await updateCategoria(editando.value.id, form.value)
    } else {
      await createCategoria(form.value)
    }
    await cargar()
    cerrarModal()
  } catch (e) {
    error.value = 'Error al guardar. Intenta de nuevo.'
  }
}

async function eliminar(id) {
  if (!confirm('¿Eliminar esta categoría?')) return
  await deleteCategoria(id)
  await cargar()
}

onMounted(cargar)
</script>

<style scoped>
.page { min-height: 100vh; background: #f5f6fa; }
.page-content { max-width: 1100px; margin: 0 auto; padding: 2rem 1rem; }
.page-header {
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;
}
.page-header h1 { font-size: 1.8rem; color: #1a1a2e; margin: 0 0 0.25rem; }
.page-header p { color: #666; margin: 0; }
.btn-primary {
  background: linear-gradient(135deg, #e94560, #c73652);
  color: white; border: none; padding: 0.65rem 1.25rem;
  border-radius: 8px; font-weight: 600; cursor: pointer; transition: opacity 0.2s;
}
.btn-primary:hover { opacity: 0.9; }
.search-bar { margin-bottom: 1.5rem; }
.search-bar input {
  width: 100%; max-width: 400px; padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0; border-radius: 10px; font-size: 1rem;
  box-sizing: border-box;
}
.search-bar input:focus { outline: none; border-color: #e94560; }
.table-card {
  background: white; border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07); overflow: hidden;
}
table { width: 100%; border-collapse: collapse; }
thead { background: #1a1a2e; color: white; }
th { padding: 1rem; text-align: left; font-size: 0.9rem; }
td { padding: 0.9rem 1rem; border-bottom: 1px solid #f0f0f0; }
tr:last-child td { border-bottom: none; }
tr:hover td { background: #fafafa; }
.icono-cell { font-size: 1.5rem; }
.empty { text-align: center; color: #999; padding: 2rem; }
.actions-cell { display: flex; gap: 0.5rem; }
.btn-edit {
  background: #f0f7ff; color: #3498db; border: none;
  padding: 0.4rem 0.75rem; border-radius: 6px; cursor: pointer; font-size: 0.85rem;
}
.btn-delete {
  background: #fff0f2; color: #e94560; border: none;
  padding: 0.4rem 0.75rem; border-radius: 6px; cursor: pointer; font-size: 0.85rem;
}
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center; z-index: 200;
}
.modal {
  background: white; border-radius: 16px; padding: 2rem;
  width: 100%; max-width: 460px; box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}
.modal h2 { margin: 0 0 1.5rem; color: #1a1a2e; }
.form-group { margin-bottom: 1.25rem; }
.form-group label { display: block; font-weight: 600; color: #333; margin-bottom: 0.4rem; font-size: 0.9rem; }
.form-group input {
  width: 100%; padding: 0.75rem 1rem; border: 2px solid #e0e0e0;
  border-radius: 8px; font-size: 1rem; box-sizing: border-box; transition: border-color 0.3s;
}
.form-group input:focus { outline: none; border-color: #e94560; }
.modal-actions { display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: 1rem; }
.btn-cancel {
  background: #f0f0f0; color: #333; border: none;
  padding: 0.65rem 1.25rem; border-radius: 8px; cursor: pointer; font-weight: 600;
}
.error-msg { color: #e94560; font-size: 0.875rem; margin-bottom: 0.5rem; }

@media (max-width: 600px) {
  .page-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
  .actions-cell { flex-direction: column; }
}
</style>