<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import MotionButton from '@/components/ui/MotionButton.vue'

const router = useRouter()
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

async function handleLogin() {
  errorMessage.value = ''
  isLoading.value = true
  try {
    await signInWithEmailAndPassword(auth, email.value.trim(), password.value)
    router.push('/admin')
  } catch {
    errorMessage.value = 'Email atau password tidak valid.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#FAFBFD] flex items-center justify-center px-6">
    <div class="w-full max-w-sm rounded-[2rem] border border-slate-200/85 bg-white p-8 shadow-sm">
      <p class="text-xs font-medium tracking-wide text-[#2454E8]">Portfolio CMS</p>
      <h1 class="mt-1 text-2xl font-medium tracking-tight text-[#090E1E]">
        Admin <span class="font-serif italic font-normal text-[#2454E8]">Access.</span>
      </h1>

      <form @submit.prevent="handleLogin" class="mt-6 space-y-4">
        <div>
          <label class="block text-xs font-medium text-slate-600 mb-1.5">Email</label>
          <input
            v-model="email"
            type="email"
            required
            placeholder="admin@domain.com"
            class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-[#090E1E] focus:border-[#2454E8] focus:outline-none"
          />
        </div>

        <div>
          <label class="block text-xs font-medium text-slate-600 mb-1.5">Password</label>
          <input
            v-model="password"
            type="password"
            required
            placeholder="••••••••"
            class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-[#090E1E] focus:border-[#2454E8] focus:outline-none"
          />
        </div>

        <p v-if="errorMessage" class="text-xs text-red-600">
          {{ errorMessage }}
        </p>

        <MotionButton
          type="submit"
          :disabled="isLoading"
          :tap-scale="0.97"
          class="w-full bg-[#090E1E] hover:bg-[#2454E8] text-white h-11 text-sm"
        >
          {{ isLoading ? 'Signing in...' : 'Sign In' }}
        </MotionButton>
      </form>
    </div>
  </div>
</template>
