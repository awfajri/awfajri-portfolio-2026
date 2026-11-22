<script setup lang="ts">
import { ref, watch } from 'vue'
import { collection, doc, setDoc, deleteDoc } from 'firebase/firestore'
import { HugeiconsIcon } from '@hugeicons/vue'
import { Delete02Icon } from '@hugeicons/core-free-icons'
import { db } from '@/lib/firebase'
import { usePortfolioStore } from '@/stores/portfolioStore'
import MotionButton from '@/components/ui/MotionButton.vue'
import type { SiteSettings, HonorItem, CertificateItem } from '@/types/portfolio'

const props = defineProps<{
  activeTab: 'profile' | 'honors' | 'settings'
}>()

const portfolioStore = usePortfolioStore()

const settingsForm = ref<SiteSettings>({ ...portfolioStore.siteSettings })
const isSaving = ref(false)
const statusMessage = ref('')

const medalOptions = [
  { label: 'No Medal', value: '' },
  { label: '1st Place (1st.svg)', value: '/images/1st.svg' },
  { label: '2nd Place (2nd.svg)', value: '/images/2nd.svg' },
  { label: '3rd Place (3rd.svg)', value: '/images/3rd.svg' },
  { label: 'Top 10 / Finalist (10th.svg)', value: '/images/10th.svg' },
]

const newHonor = ref<Omit<HonorItem, 'id'>>({
  title: '',
  organizer: '',
  year: new Date().getFullYear().toString(),
  highlightBadge: '',
  medalSvg: '',
})

const newCert = ref<Omit<CertificateItem, 'id'>>({
  title: '',
  issuer: '',
  year: new Date().getFullYear().toString(),
  credentialUrl: '',
})

watch(
  () => portfolioStore.siteSettings,
  (val) => {
    settingsForm.value = {
      ...val,
      categories: [...(val.categories || [])],
      aboutHighlights: (val.aboutHighlights || []).map((h) => ({ ...h })),
      capabilities: (val.capabilities || []).map((c) => ({
        title: c.title,
        items: [...c.items],
      })),
    }
  },
  { deep: true, immediate: true },
)

function addHighlight() {
  settingsForm.value.aboutHighlights.push({ label: '', value: '' })
}

function removeHighlight(idx: number) {
  settingsForm.value.aboutHighlights.splice(idx, 1)
}

function addCapabilityColumn() {
  settingsForm.value.capabilities.push({ title: '', items: [] })
}

function removeCapabilityColumn(idx: number) {
  settingsForm.value.capabilities.splice(idx, 1)
}

function updateCapabilityItems(idx: number, raw: string) {
  const cap = settingsForm.value.capabilities[idx]
  if (!cap) return
  cap.items = raw
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
}

async function saveSiteSettings() {
  isSaving.value = true
  statusMessage.value = ''
  try {
    await setDoc(doc(db, 'site_settings', 'main'), settingsForm.value, { merge: true })
    await portfolioStore.fetchPortfolioData()
    statusMessage.value = 'Perubahan berhasil disimpan.'
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    statusMessage.value = `Gagal menyimpan: ${message}`
  } finally {
    isSaving.value = false
  }
}

async function addHonor() {
  if (!newHonor.value.title.trim()) return
  isSaving.value = true
  statusMessage.value = ''
  try {
    const id = doc(collection(db, 'honors')).id
    await setDoc(doc(db, 'honors', id), { id, ...newHonor.value })
    await portfolioStore.fetchPortfolioData()
    newHonor.value = {
      title: '',
      organizer: '',
      year: new Date().getFullYear().toString(),
      highlightBadge: '',
      medalSvg: '',
    }
    statusMessage.value = 'Prestasi berhasil ditambahkan.'
  } catch {
    statusMessage.value = 'Gagal menambah prestasi.'
  } finally {
    isSaving.value = false
  }
}

async function deleteHonor(id: string) {
  if (!confirm('Hapus prestasi ini?')) return
  try {
    await deleteDoc(doc(db, 'honors', id))
    await portfolioStore.fetchPortfolioData()
  } catch {
    statusMessage.value = 'Gagal menghapus prestasi.'
  }
}

async function addCertificate() {
  if (!newCert.value.title.trim()) return
  isSaving.value = true
  statusMessage.value = ''
  try {
    const id = doc(collection(db, 'certificates')).id
    await setDoc(doc(db, 'certificates', id), { id, ...newCert.value })
    await portfolioStore.fetchPortfolioData()
    newCert.value = {
      title: '',
      issuer: '',
      year: new Date().getFullYear().toString(),
      credentialUrl: '',
    }
    statusMessage.value = 'Sertifikat berhasil ditambahkan.'
  } catch {
    statusMessage.value = 'Gagal menambah sertifikat.'
  } finally {
    isSaving.value = false
  }
}

async function deleteCertificate(id: string) {
  if (!confirm('Hapus sertifikat ini?')) return
  try {
    await deleteDoc(doc(db, 'certificates', id))
    await portfolioStore.fetchPortfolioData()
  } catch {
    statusMessage.value = 'Gagal menghapus sertifikat.'
  }
}
</script>

<template>
  <div class="rounded-[1.75rem] border border-slate-200/85 bg-white p-6 sm:p-8 max-w-4xl">
    <!-- TAB: ABOUT & HIGHLIGHTS -->
    <form v-if="props.activeTab === 'profile'" @submit.prevent="saveSiteSettings" class="space-y-6">
      <h2 class="text-lg font-medium text-[#090E1E] border-b border-slate-100 pb-4">
        About Section · Photo, Bio & Quick Facts
      </h2>

      <div>
        <label class="block text-xs font-medium text-slate-600 mb-1.5">
          Profile Photo URL (Google Drive / Local Path)
        </label>
        <input
          v-model="settingsForm.profilePhotoDriveUrl"
          type="text"
          placeholder="https://drive.google.com/file/d/... atau /images/auf-profile.jpg"
          class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-[#2454E8] focus:outline-none"
        />
      </div>

      <div>
        <label class="block text-xs font-medium text-slate-600 mb-1.5"
          >About Bio · Paragraph 1</label
        >
        <textarea
          v-model="settingsForm.aboutBioParagraph1"
          rows="3"
          class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-[#2454E8] focus:outline-none"
        />
      </div>

      <div>
        <label class="block text-xs font-medium text-slate-600 mb-1.5"
          >About Bio · Paragraph 2</label
        >
        <textarea
          v-model="settingsForm.aboutBioParagraph2"
          rows="3"
          class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-[#2454E8] focus:outline-none"
        />
      </div>

      <div class="pt-4 border-t border-slate-100 space-y-3">
        <div class="flex items-center justify-between">
          <label class="text-xs font-medium text-slate-600">Quick Facts Cards (About Bento)</label>
          <button
            type="button"
            @click="addHighlight"
            class="text-xs font-medium text-[#2454E8] hover:underline cursor-pointer"
          >
            + Add Card
          </button>
        </div>

        <div
          v-for="(item, idx) in settingsForm.aboutHighlights"
          :key="idx"
          class="grid grid-cols-12 gap-2 items-center"
        >
          <input
            v-model="item.label"
            type="text"
            placeholder="Label (e.g. Focus)"
            class="col-span-4 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#2454E8] focus:outline-none"
          />
          <input
            v-model="item.value"
            type="text"
            placeholder="Value (e.g. UI/UX, Front-End & PM)"
            class="col-span-7 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#2454E8] focus:outline-none"
          />
          <button
            type="button"
            @click="removeHighlight(idx)"
            aria-label="Remove highlight"
            class="col-span-1 inline-flex size-9 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:text-red-600 cursor-pointer"
          >
            <HugeiconsIcon :icon="Delete02Icon" class="size-4" />
          </button>
        </div>
      </div>

      <div class="flex items-center justify-between pt-4 border-t border-slate-100">
        <p class="text-xs font-medium text-[#2454E8]">{{ statusMessage }}</p>
        <MotionButton
          type="submit"
          :disabled="isSaving"
          :tap-scale="0.97"
          class="bg-[#090E1E] hover:bg-[#2454E8] text-white h-10 px-6 text-sm"
        >
          {{ isSaving ? 'Saving...' : 'Save About Section' }}
        </MotionButton>
      </div>
    </form>

    <!-- TAB: HONORS, CERTIFICATES & CAPABILITIES BENTO -->
    <div v-else-if="props.activeTab === 'honors'" class="space-y-8">
      <!-- Honors -->
      <div>
        <h2 class="text-lg font-medium text-[#090E1E] border-b border-slate-100 pb-3">
          National Honors & Awards
        </h2>

        <div class="mt-4 space-y-2 mb-5">
          <div
            v-for="honor in portfolioStore.honors"
            :key="honor.id"
            class="flex items-center justify-between rounded-xl border border-slate-200/80 px-4 py-3"
          >
            <div class="flex items-center gap-3">
              <img
                v-if="honor.medalSvg"
                :src="honor.medalSvg"
                :alt="honor.highlightBadge"
                class="size-7 object-contain shrink-0"
              />
              <div>
                <p class="text-sm font-medium text-[#090E1E]">
                  {{ honor.title }}
                  <span class="ml-2 text-xs text-[#2454E8]">({{ honor.highlightBadge }})</span>
                </p>
                <p class="text-xs text-slate-500">{{ honor.organizer }} · {{ honor.year }}</p>
              </div>
            </div>
            <button
              type="button"
              @click="deleteHonor(honor.id)"
              aria-label="Delete honor"
              class="text-slate-400 hover:text-red-600 cursor-pointer"
            >
              <HugeiconsIcon :icon="Delete02Icon" class="size-4" />
            </button>
          </div>
        </div>

        <form
          @submit.prevent="addHonor"
          class="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#FAFBFD] p-4 rounded-2xl border border-slate-200/75"
        >
          <input
            v-model="newHonor.title"
            type="text"
            required
            placeholder="Competition Name"
            class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#2454E8] focus:outline-none"
          />
          <input
            v-model="newHonor.organizer"
            type="text"
            required
            placeholder="Organizer (e.g. FILKOM UB)"
            class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#2454E8] focus:outline-none"
          />
          <input
            v-model="newHonor.highlightBadge"
            type="text"
            required
            placeholder="Badge (e.g. 2nd Place)"
            class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#2454E8] focus:outline-none"
          />
          <select
            v-model="newHonor.medalSvg"
            class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#2454E8] focus:outline-none"
          >
            <option v-for="m in medalOptions" :key="m.value" :value="m.value">
              {{ m.label }}
            </option>
          </select>
          <div class="sm:col-span-2 flex gap-2">
            <input
              v-model="newHonor.year"
              type="text"
              required
              placeholder="2026"
              class="w-28 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#2454E8] focus:outline-none"
            />
            <MotionButton
              type="submit"
              :disabled="isSaving"
              :tap-scale="0.97"
              class="flex-1 bg-[#090E1E] hover:bg-[#2454E8] text-white h-10 text-xs"
            >
              + Add Honor
            </MotionButton>
          </div>
        </form>
      </div>

      <!-- Certificates -->
      <div class="pt-6 border-t border-slate-100">
        <h2 class="text-lg font-medium text-[#090E1E] pb-3">Certificates & Credentials</h2>

        <div class="space-y-2 mb-5">
          <div
            v-for="cert in portfolioStore.certificates"
            :key="cert.id"
            class="flex items-center justify-between rounded-xl border border-slate-200/80 px-4 py-3"
          >
            <div>
              <p class="text-sm font-medium text-[#090E1E]">{{ cert.title }}</p>
              <p class="text-xs text-slate-500">{{ cert.issuer }} · {{ cert.year }}</p>
            </div>
            <button
              type="button"
              @click="deleteCertificate(cert.id)"
              aria-label="Delete certificate"
              class="text-slate-400 hover:text-red-600 cursor-pointer"
            >
              <HugeiconsIcon :icon="Delete02Icon" class="size-4" />
            </button>
          </div>
        </div>

        <form
          @submit.prevent="addCertificate"
          class="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#FAFBFD] p-4 rounded-2xl border border-slate-200/75"
        >
          <input
            v-model="newCert.title"
            type="text"
            required
            placeholder="Certificate Title"
            class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#2454E8] focus:outline-none"
          />
          <input
            v-model="newCert.issuer"
            type="text"
            required
            placeholder="Issuer (e.g. Google Cloud)"
            class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#2454E8] focus:outline-none"
          />
          <input
            v-model="newCert.credentialUrl"
            type="url"
            placeholder="Credential URL (optional)"
            class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#2454E8] focus:outline-none"
          />
          <div class="flex gap-2">
            <input
              v-model="newCert.year"
              type="text"
              required
              placeholder="2026"
              class="w-24 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#2454E8] focus:outline-none"
            />
            <MotionButton
              type="submit"
              :disabled="isSaving"
              :tap-scale="0.97"
              class="flex-1 bg-[#090E1E] hover:bg-[#2454E8] text-white h-10 text-xs"
            >
              + Add Certificate
            </MotionButton>
          </div>
        </form>
      </div>

      <!-- Core Capabilities (Bento Bottom) -->
      <form @submit.prevent="saveSiteSettings" class="pt-6 border-t border-slate-100 space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 class="text-lg font-medium text-[#090E1E]">Core Capabilities (Bento Bottom)</h2>
            <p class="text-xs text-slate-500">1 baris = 1 poin keahlian.</p>
          </div>
          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="addCapabilityColumn"
              class="rounded-full border border-slate-200 bg-white px-4 h-9 text-xs font-medium text-[#2454E8] hover:bg-slate-50 cursor-pointer"
            >
              + Add Column
            </button>
            <MotionButton
              type="submit"
              :disabled="isSaving"
              :tap-scale="0.97"
              class="bg-[#090E1E] hover:bg-[#2454E8] text-white h-9 px-5 text-xs"
            >
              Save Capabilities
            </MotionButton>
          </div>
        </div>

        <div
          v-if="settingsForm.capabilities.length > 0"
          class="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div
            v-for="(cap, idx) in settingsForm.capabilities"
            :key="idx"
            class="rounded-2xl border border-slate-200/80 bg-[#FAFBFD] p-4 space-y-2.5"
          >
            <div class="flex items-center gap-2">
              <input
                v-model="cap.title"
                type="text"
                placeholder="Column Title"
                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium focus:border-[#2454E8] focus:outline-none"
              />
              <button
                type="button"
                @click="removeCapabilityColumn(idx)"
                aria-label="Remove capability column"
                class="text-slate-400 hover:text-red-600 cursor-pointer shrink-0"
              >
                <HugeiconsIcon :icon="Delete02Icon" class="size-4" />
              </button>
            </div>
            <textarea
              :value="cap.items.join('\n')"
              @input="updateCapabilityItems(idx, ($event.target as HTMLTextAreaElement).value)"
              rows="4"
              placeholder="One item per line..."
              class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-[#2454E8] focus:outline-none"
            />
          </div>
        </div>

        <p v-else class="text-xs text-slate-400">
          Belum ada kolom Core Capabilities. Klik <strong>+ Add Column</strong> untuk menambah.
        </p>

        <p v-if="statusMessage" class="text-xs font-medium text-[#2454E8]">{{ statusMessage }}</p>
      </form>
    </div>

    <!-- TAB: FOOTER & SETTINGS -->
    <form v-else @submit.prevent="saveSiteSettings" class="space-y-5">
      <h2 class="text-lg font-medium text-[#090E1E] border-b border-slate-100 pb-4">
        Footer Banner & Global Links
      </h2>

      <div>
        <label class="block text-xs font-medium text-slate-600 mb-1.5"
          >Footer Banner Image URL (Google Drive)</label
        >
        <input
          v-model="settingsForm.figmaBannerDriveUrl"
          type="url"
          placeholder="https://drive.google.com/file/d/..."
          class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-[#2454E8] focus:outline-none"
        />
      </div>

      <div>
        <label class="block text-xs font-medium text-slate-600 mb-1.5"
          >Banner CTA Button Text</label
        >
        <input
          v-model="settingsForm.bannerCtaText"
          type="text"
          placeholder="Copy Email"
          class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-[#2454E8] focus:outline-none"
        />
      </div>

      <div>
        <label class="block text-xs font-medium text-slate-600 mb-1.5">Contact Email</label>
        <input
          v-model="settingsForm.contactEmail"
          type="email"
          required
          class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-[#2454E8] focus:outline-none"
        />
      </div>

      <div>
        <label class="block text-xs font-medium text-slate-600 mb-1.5"
          >CV PDF URL (Google Drive)</label
        >
        <input
          v-model="settingsForm.cvDriveUrl"
          type="url"
          placeholder="https://drive.google.com/file/d/..."
          class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-[#2454E8] focus:outline-none"
        />
      </div>

      <div class="flex items-center justify-between pt-4 border-t border-slate-100">
        <p class="text-xs font-medium text-[#2454E8]">{{ statusMessage }}</p>
        <MotionButton
          type="submit"
          :disabled="isSaving"
          :tap-scale="0.97"
          class="bg-[#090E1E] hover:bg-[#2454E8] text-white h-10 px-6 text-sm"
        >
          {{ isSaving ? 'Saving...' : 'Save Settings' }}
        </MotionButton>
      </div>
    </form>
  </div>
</template>
