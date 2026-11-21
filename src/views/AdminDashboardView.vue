<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { signOut } from 'firebase/auth'
import { collection, doc, setDoc, deleteDoc } from 'firebase/firestore'
import {
  PinnedList,
  PinnedListItems,
  PinnedListLabel,
  PinnedListPinned,
  PinnedListUnpinned,
} from '@animate-ui/vue/primitives/pinned-list'
import { HugeiconsIcon } from '@hugeicons/vue'
import { Add01Icon, Delete02Icon, Logout01Icon } from '@hugeicons/core-free-icons'
import { auth, db } from '@/lib/firebase'
import { usePortfolioStore } from '@/stores/portfolioStore'
import PinnedProjectRow from '@/components/admin/PinnedProjectRow.vue'
import SiteSettingsManager from '@/components/admin/SiteSettingsManager.vue'
import MotionButton from '@/components/ui/MotionButton.vue'
import type { ProjectItem } from '@/types/portfolio'

type AdminTab = 'projects' | 'profile' | 'honors' | 'settings'

const router = useRouter()
const portfolioStore = usePortfolioStore()

const activeTab = ref<AdminTab>('projects')
const isSaving = ref(false)
const statusMessage = ref('')
const selectedId = ref<string | null>(null)
const newCategory = ref('')

const tabs: { id: AdminTab; label: string }[] = [
  { id: 'projects', label: 'Works & Archive' },
  { id: 'profile', label: 'About & Highlights' },
  { id: 'honors', label: 'Honors, Certs & Bento' },
  { id: 'settings', label: 'Footer & Settings' },
]

const categories = computed(
  () => portfolioStore.siteSettings.categories || ['ux', 'dev', 'aiot', 'design'],
)

function createEmptyForm(): Omit<ProjectItem, 'id'> {
  return {
    title: '',
    slug: '',
    tagline: '',
    summary: '',
    category: categories.value[0] || 'ux',
    isFeatured: false,
    isArchived: false,
    displayOrder: portfolioStore.projects.length + 1,
    year: new Date().getFullYear().toString(),
    thumbnailDriveUrl: '',
    galleryDriveUrls: [],
    techStack: [],
    pmRole: '',
    uxMetrics: { susScore: '', seqScore: '', npsScore: '', researchMethod: '' },
    fieldNotes: '',
    links: [{ label: 'Live Product', url: '' }],
  }
}

const form = ref<Omit<ProjectItem, 'id'>>(createEmptyForm())
const techStackInput = ref('')

const pinnedProjects = computed(() =>
  portfolioStore.projects.filter((p) => p.isFeatured && !p.isArchived),
)
const unpinnedProjects = computed(() =>
  portfolioStore.projects.filter((p) => !p.isFeatured || p.isArchived),
)

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function startNewProject() {
  activeTab.value = 'projects'
  selectedId.value = null
  form.value = createEmptyForm()
  techStackInput.value = ''
  statusMessage.value = ''
}

function selectProject(project: ProjectItem) {
  selectedId.value = project.id
  form.value = {
    title: project.title,
    slug: project.slug,
    tagline: project.tagline,
    summary: project.summary || '',
    category: project.category,
    isFeatured: project.isFeatured,
    isArchived: Boolean(project.isArchived),
    displayOrder: project.displayOrder,
    year: project.year,
    thumbnailDriveUrl: project.thumbnailDriveUrl,
    galleryDriveUrls: [...(project.galleryDriveUrls || [])],
    techStack: [...(project.techStack || [])],
    pmRole: project.pmRole || '',
    uxMetrics: { ...(project.uxMetrics || {}) },
    fieldNotes: project.fieldNotes || '',
    links: project.links?.length ? project.links.map((l) => ({ ...l })) : [],
  }
  techStackInput.value = (project.techStack || []).join(', ')
  statusMessage.value = ''
}

async function handlePinnedChange(id: string) {
  const target = portfolioStore.projects.find((p) => p.id === id)
  if (!target) return

  const nextFeatured = !target.isFeatured
  target.isFeatured = nextFeatured
  if (nextFeatured) target.isArchived = false

  if (selectedId.value === id) {
    form.value.isFeatured = nextFeatured
    if (nextFeatured) form.value.isArchived = false
  }

  try {
    await setDoc(
      doc(db, 'projects', id),
      { ...target, isFeatured: nextFeatured, isArchived: target.isArchived },
      { merge: true },
    )
    statusMessage.value = nextFeatured
      ? 'Project di-pin ke Selected Works.'
      : 'Project dilepas dari Pin.'
  } catch {
    statusMessage.value = 'Gagal memperbarui status pin ke Firestore.'
  }
}

async function handleArchiveToggle(project: ProjectItem) {
  const nextArchived = !project.isArchived
  project.isArchived = nextArchived
  if (nextArchived) project.isFeatured = false

  if (selectedId.value === project.id) {
    form.value.isArchived = nextArchived
    if (nextArchived) form.value.isFeatured = false
  }

  try {
    await setDoc(
      doc(db, 'projects', project.id),
      { ...project, isArchived: nextArchived, isFeatured: project.isFeatured },
      { merge: true },
    )
    statusMessage.value = nextArchived
      ? 'Project diarsipkan (disembunyikan).'
      : 'Project dipulihkan dari arsip.'
  } catch {
    statusMessage.value = 'Gagal mengubah status arsip.'
  }
}

async function addCategory() {
  const clean = newCategory.value.trim().toLowerCase()
  if (!clean || categories.value.includes(clean)) return
  const updated = [...categories.value, clean]
  try {
    await setDoc(doc(db, 'site_settings', 'main'), { categories: updated }, { merge: true })
    portfolioStore.siteSettings.categories = updated
    newCategory.value = ''
  } catch {
    statusMessage.value = 'Gagal menyimpan kategori.'
  }
}

async function removeCategory(cat: string) {
  const updated = categories.value.filter((c) => c !== cat)
  try {
    await setDoc(doc(db, 'site_settings', 'main'), { categories: updated }, { merge: true })
    portfolioStore.siteSettings.categories = updated
  } catch {
    statusMessage.value = 'Gagal menghapus kategori.'
  }
}

function addLinkRow() {
  form.value.links.push({ label: '', url: '' })
}

function removeLinkRow(index: number) {
  form.value.links.splice(index, 1)
}

function addGalleryRow() {
  form.value.galleryDriveUrls.push('')
}

function removeGalleryRow(index: number) {
  form.value.galleryDriveUrls.splice(index, 1)
}

async function saveProject() {
  isSaving.value = true
  statusMessage.value = ''
  try {
    const id = selectedId.value || doc(collection(db, 'projects')).id
    const payload: ProjectItem = {
      id,
      ...form.value,
      slug: form.value.slug.trim() || generateSlug(form.value.title),
      techStack: techStackInput.value
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      galleryDriveUrls: form.value.galleryDriveUrls.map((u) => u.trim()).filter(Boolean),
      links: form.value.links.filter((l) => l.label.trim() && l.url.trim()),
    }

    await setDoc(doc(db, 'projects', id), payload, { merge: true })
    await portfolioStore.fetchPortfolioData()
    selectedId.value = id
    statusMessage.value = 'Project berhasil disimpan.'
  } catch {
    statusMessage.value = 'Gagal menyimpan project. Cek koneksi & Firestore Rules.'
  } finally {
    isSaving.value = false
  }
}

async function removeProject(id: string) {
  if (!confirm('Hapus project ini secara permanen?')) return
  statusMessage.value = ''
  try {
    await deleteDoc(doc(db, 'projects', id))
    portfolioStore.projects = portfolioStore.projects.filter((p) => p.id !== id)
    if (selectedId.value === id) startNewProject()
    statusMessage.value = 'Project berhasil dihapus.'
  } catch (err: unknown) {
    console.error('Delete project error:', err)
    const msg = err instanceof Error ? err.message : 'Unknown error'
    statusMessage.value = `Gagal menghapus: ${msg}`
  }
}

async function handleLogout() {
  await signOut(auth)
  router.push('/admin/login')
}

onMounted(() => {
  if (!portfolioStore.isLoaded) {
    portfolioStore.fetchPortfolioData()
  }
})
</script>

<template>
  <div class="min-h-screen bg-[#FAFBFD] px-6 py-10 sm:px-8">
    <div class="mx-auto max-w-6xl">
      <header
        class="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-slate-200/80"
      >
        <div>
          <p class="text-xs font-medium tracking-wide text-[#2454E8]">Portfolio CMS</p>
          <h1 class="mt-1 text-2xl sm:text-3xl font-medium tracking-tight text-[#090E1E]">
            Manage <span class="font-serif italic font-normal text-[#2454E8]">Every Section.</span>
          </h1>
        </div>

        <div class="flex items-center gap-3">
          <MotionButton
            @click="startNewProject"
            :tap-scale="0.97"
            class="bg-[#090E1E] hover:bg-[#2454E8] text-white h-10 px-4 text-xs sm:text-sm"
          >
            <HugeiconsIcon :icon="Add01Icon" class="size-4" />
            <span>New Project</span>
          </MotionButton>

          <button
            type="button"
            @click="handleLogout"
            class="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 h-10 text-xs sm:text-sm font-medium text-slate-600 hover:text-red-600 cursor-pointer"
          >
            <HugeiconsIcon :icon="Logout01Icon" class="size-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <div class="mt-6 flex flex-wrap items-center gap-2">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          @click="activeTab = tab.id"
          :class="[
            'rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer',
            activeTab === tab.id
              ? 'bg-[#090E1E] text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:text-[#2454E8]',
          ]"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- TAB 1: WORKS & ARCHIVE -->
      <div v-if="activeTab === 'projects'" class="mt-8 space-y-6">
        <div
          class="rounded-2xl border border-slate-200/85 bg-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-xs font-medium text-slate-500 mr-1">Categories:</span>
            <span
              v-for="cat in categories"
              :key="cat"
              class="inline-flex items-center gap-1.5 rounded-full bg-[#F4F6FA] border border-slate-200 px-3 py-1 text-xs font-medium text-[#090E1E]"
            >
              <span>{{ cat.toUpperCase() }}</span>
              <button
                type="button"
                @click="removeCategory(cat)"
                class="text-slate-400 hover:text-red-600 cursor-pointer"
              >
                ×
              </button>
            </span>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <input
              v-model="newCategory"
              type="text"
              placeholder="New category..."
              @keydown.enter.prevent="addCategory"
              class="w-40 rounded-xl border border-slate-200 px-3 py-1.5 text-xs focus:border-[#2454E8] focus:outline-none"
            />
            <button
              type="button"
              @click="addCategory"
              class="inline-flex items-center gap-1 rounded-xl bg-[#090E1E] hover:bg-[#2454E8] text-white px-3 py-1.5 text-xs font-medium cursor-pointer"
            >
              <HugeiconsIcon :icon="Add01Icon" class="size-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <aside class="lg:col-span-4 rounded-[1.75rem] border border-slate-200/85 bg-white p-5">
            <PinnedList class="flex flex-col gap-6" @pinned-change="handlePinnedChange">
              <PinnedListPinned>
                <PinnedListLabel
                  :hide="pinnedProjects.length === 0"
                  class="mb-2.5 block text-xs font-medium uppercase tracking-wider text-[#2454E8]"
                >
                  Pinned · Selected Works ({{ pinnedProjects.length }})
                </PinnedListLabel>
                <PinnedListItems class="flex flex-col gap-2">
                  <PinnedProjectRow
                    v-for="item in pinnedProjects"
                    :key="item.id"
                    :item="item"
                    :is-selected="selectedId === item.id"
                    @select="selectProject"
                    @archive="handleArchiveToggle"
                    @delete="removeProject"
                  />
                </PinnedListItems>
              </PinnedListPinned>

              <PinnedListUnpinned>
                <PinnedListLabel
                  :hide="unpinnedProjects.length === 0"
                  class="mb-2.5 block text-xs font-medium uppercase tracking-wider text-slate-400"
                >
                  All · Archive ({{ unpinnedProjects.length }})
                </PinnedListLabel>
                <PinnedListItems class="flex flex-col gap-2">
                  <PinnedProjectRow
                    v-for="item in unpinnedProjects"
                    :key="item.id"
                    :item="item"
                    :is-selected="selectedId === item.id"
                    @select="selectProject"
                    @archive="handleArchiveToggle"
                    @delete="removeProject"
                  />
                </PinnedListItems>
              </PinnedListUnpinned>
            </PinnedList>
          </aside>

          <section
            class="lg:col-span-8 rounded-[1.75rem] border border-slate-200/85 bg-white p-6 sm:p-8"
          >
            <form @submit.prevent="saveProject" class="space-y-6">
              <div class="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 class="text-lg font-medium text-[#090E1E]">
                  {{ selectedId ? 'Edit Project' : 'Create New Project' }}
                </h2>
                <label
                  class="inline-flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer"
                >
                  <input
                    v-model="form.isFeatured"
                    type="checkbox"
                    class="rounded accent-[#2454E8]"
                  />
                  <span>Pin to Selected Works</span>
                </label>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-medium text-slate-600 mb-1.5"
                    >Project Name *</label
                  >
                  <input
                    v-model="form.title"
                    type="text"
                    required
                    placeholder="e.g. PijarMemori"
                    class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-[#2454E8] focus:outline-none"
                  />
                </div>

                <div>
                  <label class="block text-xs font-medium text-slate-600 mb-1.5"
                    >Slug (auto if empty)</label
                  >
                  <input
                    v-model="form.slug"
                    type="text"
                    placeholder="pijarmemori"
                    class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-[#2454E8] focus:outline-none"
                  />
                </div>

                <div>
                  <label class="block text-xs font-medium text-slate-600 mb-1.5">Category</label>
                  <select
                    v-model="form.category"
                    class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm bg-white focus:border-[#2454E8] focus:outline-none"
                  >
                    <option v-for="cat in categories" :key="cat" :value="cat">
                      {{ cat.toUpperCase() }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-medium text-slate-600 mb-1.5">Year</label>
                  <input
                    v-model="form.year"
                    type="text"
                    placeholder="2026"
                    class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-[#2454E8] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label class="block text-xs font-medium text-slate-600 mb-1.5">Tagline *</label>
                <input
                  v-model="form.tagline"
                  type="text"
                  required
                  placeholder="Short impact-focused summary..."
                  class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-[#2454E8] focus:outline-none"
                />
              </div>

              <div>
                <label class="block text-xs font-medium text-slate-600 mb-1.5"
                  >Overview / Summary</label
                >
                <textarea
                  v-model="form.summary"
                  rows="3"
                  placeholder="Problem context & solution..."
                  class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-[#2454E8] focus:outline-none"
                />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-medium text-slate-600 mb-1.5"
                    >Role & Ownership</label
                  >
                  <input
                    v-model="form.pmRole"
                    type="text"
                    placeholder="e.g. Product Designer & Front-End Lead"
                    class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-[#2454E8] focus:outline-none"
                  />
                </div>

                <div>
                  <label class="block text-xs font-medium text-slate-600 mb-1.5"
                    >Tech Stack (comma separated)</label
                  >
                  <input
                    v-model="techStackInput"
                    type="text"
                    placeholder="Vue 3, TypeScript, Tailwind CSS, Figma"
                    class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-[#2454E8] focus:outline-none"
                  />
                </div>
              </div>

              <div class="space-y-3 pt-2 border-t border-slate-100">
                <div>
                  <label class="block text-xs font-medium text-slate-600 mb-1.5"
                    >Thumbnail Image URL (Google Drive / Direct)</label
                  >
                  <input
                    v-model="form.thumbnailDriveUrl"
                    type="url"
                    placeholder="https://drive.google.com/file/d/..."
                    class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-[#2454E8] focus:outline-none"
                  />
                </div>

                <div>
                  <div class="flex items-center justify-between mb-1.5">
                    <label class="text-xs font-medium text-slate-600">Gallery Images</label>
                    <button
                      type="button"
                      @click="addGalleryRow"
                      class="text-xs font-medium text-[#2454E8] hover:underline cursor-pointer"
                    >
                      + Add Image
                    </button>
                  </div>
                  <div class="space-y-2">
                    <div
                      v-for="(_, idx) in form.galleryDriveUrls"
                      :key="idx"
                      class="flex items-center gap-2"
                    >
                      <input
                        v-model="form.galleryDriveUrls[idx]"
                        type="url"
                        placeholder="https://drive.google.com/file/d/..."
                        class="flex-1 rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-[#2454E8] focus:outline-none"
                      />
                      <button
                        type="button"
                        @click="removeGalleryRow(idx)"
                        aria-label="Remove gallery image"
                        class="inline-flex size-9 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:text-red-600 cursor-pointer"
                      >
                        <HugeiconsIcon :icon="Delete02Icon" class="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="space-y-2 pt-2 border-t border-slate-100">
                <div class="flex items-center justify-between">
                  <label class="text-xs font-medium text-slate-600">Project Links (Flexible)</label>
                  <button
                    type="button"
                    @click="addLinkRow"
                    class="text-xs font-medium text-[#2454E8] hover:underline cursor-pointer"
                  >
                    + Add Link
                  </button>
                </div>

                <div
                  v-for="(link, idx) in form.links"
                  :key="idx"
                  class="grid grid-cols-12 gap-2 items-center"
                >
                  <input
                    v-model="link.label"
                    type="text"
                    placeholder="Label (e.g. Figma)"
                    class="col-span-4 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#2454E8] focus:outline-none"
                  />
                  <input
                    v-model="link.url"
                    type="url"
                    placeholder="https://..."
                    class="col-span-7 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#2454E8] focus:outline-none"
                  />
                  <button
                    type="button"
                    @click="removeLinkRow(idx)"
                    aria-label="Remove link"
                    class="col-span-1 inline-flex size-9 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:text-red-600 cursor-pointer"
                  >
                    <HugeiconsIcon :icon="Delete02Icon" class="size-4" />
                  </button>
                </div>
              </div>

              <div class="pt-2 border-t border-slate-100">
                <label class="block text-xs font-medium text-slate-600 mb-1.5"
                  >Behind the Build · Field Notes</label
                >
                <textarea
                  v-model="form.fieldNotes"
                  rows="3"
                  placeholder="Key lessons, awards, or engineering notes..."
                  class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-[#2454E8] focus:outline-none"
                />
              </div>

              <div class="flex items-center justify-between pt-4 border-t border-slate-100">
                <p class="text-xs font-medium text-[#2454E8]">{{ statusMessage }}</p>
                <MotionButton
                  type="submit"
                  :disabled="isSaving"
                  :tap-scale="0.97"
                  class="bg-[#090E1E] hover:bg-[#2454E8] text-white h-11 px-6 text-sm"
                >
                  {{ isSaving ? 'Saving...' : 'Save Project' }}
                </MotionButton>
              </div>
            </form>
          </section>
        </div>
      </div>

      <!-- TAB 2, 3, 4: SITE SETTINGS MANAGER -->
      <div v-else class="mt-8">
        <SiteSettingsManager :active-tab="activeTab" />
      </div>
    </div>
  </div>
</template>
