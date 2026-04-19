<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <span class="auth-icon">🍽️</span>
        <h1>Crear Cuenta</h1>
        <p>Únete a Restaurante Vue</p>
      </div>

      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label>Correo electrónico</label>
          <input v-model="email" type="email" placeholder="correo@ejemplo.com" required />
        </div>
        <div class="form-group">
          <label>Contraseña</label>
          <input v-model="password" type="password" placeholder="Mínimo 6 caracteres" required />
        </div>
        <div class="form-group">
          <label>Confirmar contraseña</label>
          <input v-model="confirm" type="password" placeholder="Repite tu contraseña" required />
        </div>

        <p v-if="error" class="error-msg">{{ error }}</p>

        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? 'Registrando...' : 'Crear Cuenta' }}
        </button>
      </form>

      <p class="auth-footer">
        ¿Ya tienes cuenta?
        <router-link to="/login">Inicia sesión</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const confirm = ref('')
const error = ref('')
const loading = ref(false)

async function handleRegister() {
  error.value = ''
  if (password.value !== confirm.value) {
    error.value = 'Las contraseñas no coinciden.'
    return
  }
  if (password.value.length < 6) {
    error.value = 'La contraseña debe tener al menos 6 caracteres.'
    return
  }
  loading.value = true
  try {
    await authStore.register(email.value, password.value)
    router.push('/dashboard')
  } catch (e) {
    error.value = 'Error al registrar. El correo ya existe.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}
.auth-card {
  background: white;
  border-radius: 16px;
  padding: 2.5rem;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}
.auth-header { text-align: center; margin-bottom: 2rem; }
.auth-icon { font-size: 3rem; }
.auth-header h1 { font-size: 1.8rem; color: #1a1a2e; margin: 0.5rem 0 0.25rem; }
.auth-header p { color: #666; font-size: 0.95rem; }
.form-group { margin-bottom: 1.25rem; }
.form-group label { display: block; font-weight: 600; color: #333; margin-bottom: 0.4rem; font-size: 0.9rem; }
.form-group input {
  width: 100%; padding: 0.75rem 1rem; border: 2px solid #e0e0e0;
  border-radius: 8px; font-size: 1rem; transition: border-color 0.3s; box-sizing: border-box;
}
.form-group input:focus { outline: none; border-color: #e94560; }
.btn-primary {
  width: 100%; padding: 0.85rem;
  background: linear-gradient(135deg, #e94560, #c73652);
  color: white; border: none; border-radius: 8px;
  font-size: 1rem; font-weight: 600; cursor: pointer; transition: opacity 0.3s; margin-top: 0.5rem;
}
.btn-primary:hover { opacity: 0.9; }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.error-msg { color: #e94560; font-size: 0.875rem; text-align: center; margin-bottom: 0.5rem; }
.auth-footer { text-align: center; margin-top: 1.5rem; color: #666; font-size: 0.9rem; }
.auth-footer a { color: #e94560; font-weight: 600; text-decoration: none; }
</style>