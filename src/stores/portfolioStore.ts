import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { CertificateItem, HonorItem, ProjectItem, SiteSettings } from '@/types/portfolio'

const emptySettings: SiteSettings = {
  contactEmail: '',
  cvDriveUrl: '',
  figmaBannerDriveUrl: '',
  bannerCtaText: '',
  profilePhotoDriveUrl: '',
  aboutBioParagraph1: '',
  aboutBioParagraph2: '',
  aboutHighlights: [],
  capabilities: [],
  categories: [],
}

export const usePortfolioStore = defineStore('portfolio', () => {
  const projects = ref<ProjectItem[]>([])
  const honors = ref<HonorItem[]>([])
  const certificates = ref<CertificateItem[]>([])
  const siteSettings = ref<SiteSettings>({ ...emptySettings })
  const isLoading = ref(false)
  const isLoaded = ref(false)

  const featuredProjects = computed(() =>
    projects.value
      .filter((p) => p.isFeatured && !p.isArchived)
      .sort((a, b) => a.displayOrder - b.displayOrder),
  )

  const archiveProjects = computed(() =>
    projects.value
      .filter((p) => !p.isFeatured && !p.isArchived)
      .sort((a, b) => a.displayOrder - b.displayOrder),
  )

  async function fetchPortfolioData() {
    isLoading.value = true
    try {
      const [projectsSnap, honorsSnap, certsSnap, settingsSnap] = await Promise.all([
        getDocs(query(collection(db, 'projects'), orderBy('displayOrder', 'asc'))),
        getDocs(collection(db, 'honors')),
        getDocs(collection(db, 'certificates')),
        getDoc(doc(db, 'site_settings', 'main')),
      ])

      projects.value = projectsSnap.docs.map((d) => {
        const data = d.data() as Partial<ProjectItem>
        return {
          id: d.id,
          title: data.title || 'Untitled Project',
          slug: data.slug || d.id,
          tagline: data.tagline || '',
          summary: data.summary || '',
          category: data.category || '',
          roleLens: data.roleLens || 'both',
          isFeatured: Boolean(data.isFeatured),
          isArchived: Boolean(data.isArchived),
          displayOrder: data.displayOrder ?? 99,
          year: data.year || '',
          thumbnailDriveUrl: data.thumbnailDriveUrl || '',
          galleryDriveUrls: data.galleryDriveUrls || [],
          techStack: data.techStack || [],
          pmRole: data.pmRole || '',
          uxMetrics: data.uxMetrics || {},
          fieldNotes: data.fieldNotes || '',
          links: Array.isArray(data.links) ? data.links : [],
        }
      })

      honors.value = honorsSnap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<HonorItem, 'id'>),
      }))

      certificates.value = certsSnap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<CertificateItem, 'id'>),
      }))

      if (settingsSnap.exists()) {
        const data = settingsSnap.data() as Partial<SiteSettings>
        siteSettings.value = {
          ...emptySettings,
          ...data,
          aboutHighlights: Array.isArray(data.aboutHighlights) ? data.aboutHighlights : [],
          capabilities: Array.isArray(data.capabilities) ? data.capabilities : [],
          categories: Array.isArray(data.categories) ? data.categories : [],
        }
      } else {
        siteSettings.value = { ...emptySettings }
      }

      isLoaded.value = true
    } catch (err) {
      console.error('Failed to fetch portfolio data:', err)
    } finally {
      isLoading.value = false
    }
  }

  return {
    projects,
    honors,
    certificates,
    siteSettings,
    isLoading,
    isLoaded,
    featuredProjects,
    archiveProjects,
    fetchPortfolioData,
  }
})
