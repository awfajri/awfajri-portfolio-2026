import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { HonorItem, ProjectItem, SiteSettings } from '@/types/portfolio'

const fallbackProjects: ProjectItem[] = [
  {
    id: 'pijarmemori',
    title: 'PijarMemori',
    slug: 'pijarmemori',
    tagline: 'Gerontechnology dementia care and generative AI reminiscence therapy ecosystem.',
    summary:
      'Designed to help families and caregivers preserve cognitive engagement for elderly individuals with dementia through structured memory prompts, accessible audio-visual cues, and low-friction daily routines.',
    category: 'ux',
    isFeatured: true,
    displayOrder: 1,
    year: '2026',
    thumbnailDriveUrl: '',
    galleryDriveUrls: [],
    techStack: ['Figma', 'UX Research', 'Design System', 'Usability Testing'],
    pmRole: 'Product Designer & UX Researcher',
    uxMetrics: {
      susScore: '80.0 / 100',
      researchMethod: 'Mixed-method usability testing across 8 participants',
    },
    fieldNotes:
      '2nd Place at IT FEST 2026 (FILKOM Universitas Brawijaya) and 3rd Place at BEM FTI Competition 2026.',
    links: [],
  },
  {
    id: 'lentera',
    title: 'Lentera',
    slug: 'lentera',
    tagline: 'Civic-tech B2G public safety and street-lighting audit platform for Karawang.',
    summary:
      'Bridges citizen reports of unlit roads with municipal maintenance workflows, enabling faster verification, prioritization, and transparent status tracking for public infrastructure.',
    category: 'ux',
    isFeatured: true,
    displayOrder: 2,
    year: '2026',
    thumbnailDriveUrl: '',
    galleryDriveUrls: [],
    techStack: ['Figma', 'Civic Tech', 'B2G Flow', 'Prototyping'],
    pmRole: 'Lead UI/UX Designer',
    uxMetrics: {
      seqScore: '4.86 / 5.0',
      npsScore: '4.8 / 5.0',
      researchMethod: 'Task-based usability evaluation & Dinas PUPR consultation',
    },
    fieldNotes: '4th Place (Juara Harapan 1) at I/O Festival 2026, Universitas Tarumanagara.',
    links: [],
  },
  {
    id: 'pos-nasicafe',
    title: 'POS-nasiCafe',
    slug: 'pos-nasicafe',
    tagline: 'Collaborative Laravel point-of-sale and mobile-first customer self-order web app.',
    summary:
      'Streamlines dine-in ordering and cashier operations with real-time cart sync, table QR self-ordering, and structured order management built on Laravel.',
    category: 'dev',
    isFeatured: true,
    displayOrder: 3,
    year: '2026',
    thumbnailDriveUrl: '',
    galleryDriveUrls: [],
    techStack: ['Laravel', 'Blade', 'MySQL', 'Tailwind CSS'],
    pmRole: 'Front-End Lead & PR Reviewer',
    uxMetrics: {},
    fieldNotes:
      'Managed repository workflow, PR reviews, and mobile-first customer ordering module.',
    links: [{ label: 'GitHub Repo', url: 'https://github.com/awfajri/POS-nasiCafe' }],
  },
  {
    id: 'agrinova',
    title: 'AgriNova',
    slug: 'agrinova',
    tagline: 'E-commerce and harvest pre-order web application with Google OAuth.',
    summary:
      'Connects local agricultural producers with buyers through scheduled harvest pre-orders, admin order management, and streamlined authentication.',
    category: 'dev',
    isFeatured: true,
    displayOrder: 4,
    year: '2026',
    thumbnailDriveUrl: '',
    galleryDriveUrls: [],
    techStack: ['Laravel 13', 'MySQL', 'Google OAuth', 'Railway'],
    pmRole: 'Full-Stack & Deployment Lead',
    uxMetrics: {},
    fieldNotes:
      'Built admin order workflows, catalog features, and production deployment pipeline.',
    links: [],
  },
  {
    id: 'autolayoutos',
    title: 'AutoLayoutOS',
    slug: 'autolayoutos',
    tagline: 'Custom Fedora KDE 44 Linux distribution remastered with a self-compiled kernel.',
    summary:
      'An Operating Systems course project focused on kernel compilation, custom desktop ricing, and ISO remastering tailored for designers and developers.',
    category: 'dev',
    isFeatured: false,
    displayOrder: 5,
    year: '2026',
    thumbnailDriveUrl: '',
    galleryDriveUrls: [],
    techStack: ['Fedora KDE', 'Linux Kernel', 'Bash', 'VirtualBox'],
    pmRole: 'Systems Engineer',
    uxMetrics: {},
    fieldNotes: 'Packaged as AutoLayoutOS.iso with custom system configurations.',
    links: [],
  },
]

const fallbackHonors: HonorItem[] = [
  {
    id: 'honor-1',
    title: 'IT FEST 2026 · UI/UX Design',
    organizer: 'FILKOM Universitas Brawijaya',
    year: '2026',
    highlightBadge: '2nd Place',
  },
  {
    id: 'honor-2',
    title: 'BEM FTI Competition · UI/UX Design',
    organizer: 'UNISKA Muhammad Arsyad Al Banjari',
    year: '2026',
    highlightBadge: '3rd Place',
  },
  {
    id: 'honor-3',
    title: 'I/O Festival 2026 · UI/UX Design',
    organizer: 'Universitas Tarumanagara',
    year: '2026',
    highlightBadge: '4th Place',
  },
  {
    id: 'honor-4',
    title: 'The ACE 2025 · UI/UX Design',
    organizer: 'HIMASKOM Universitas Diponegoro',
    year: '2025',
    highlightBadge: '5th Finalist',
  },
]

const defaultSettings: SiteSettings = {
  contactEmail: 'auffajri@email.com',
  cvDriveUrl: '',
  figmaBannerDriveUrl: '',
  bannerCtaText: 'Copy Email',
  profilePhotoDriveUrl: '/images/auf-profile.jpg',
  aboutBioParagraph1:
    'I am Auf Fajri Ramadhani, an Informatics student focused on building digital products that feel intuitive on the surface and dependable underneath.',
  aboutBioParagraph2:
    'From conducting usability testing for dementia care and civic safety platforms to shipping Vue, TypeScript, and Laravel web applications, I care deeply about clarity, measurable impact, and clean execution.',
  categories: ['ux', 'dev', 'aiot', 'design'],
}

export const usePortfolioStore = defineStore('portfolio', () => {
  const projects = ref<ProjectItem[]>(fallbackProjects)
  const honors = ref<HonorItem[]>(fallbackHonors)
  const siteSettings = ref<SiteSettings>({ ...defaultSettings })
  const isLoading = ref(false)
  const isLoaded = ref(false)

  const featuredProjects = computed(() =>
    projects.value.filter((p) => p.isFeatured).sort((a, b) => a.displayOrder - b.displayOrder),
  )

  const archiveProjects = computed(() =>
    projects.value.filter((p) => !p.isFeatured).sort((a, b) => Number(b.year) - Number(a.year)),
  )

  async function fetchPortfolioData() {
    isLoading.value = true
    try {
      const [projectsSnap, honorsSnap, settingsSnap] = await Promise.all([
        getDocs(query(collection(db, 'projects'), orderBy('displayOrder', 'asc'))),
        getDocs(collection(db, 'honors')),
        getDoc(doc(db, 'site_settings', 'main')),
      ])

      if (!projectsSnap.empty) {
        projects.value = projectsSnap.docs.map((d) => {
          const data = d.data() as Partial<ProjectItem>
          return {
            id: d.id,
            title: data.title || 'Untitled Project',
            slug: data.slug || d.id,
            tagline: data.tagline || '',
            summary: data.summary || '',
            category: data.category || 'ux',
            isFeatured: Boolean(data.isFeatured),
            displayOrder: data.displayOrder ?? 99,
            year: data.year || '2026',
            thumbnailDriveUrl: data.thumbnailDriveUrl || '',
            galleryDriveUrls: data.galleryDriveUrls || [],
            techStack: data.techStack || [],
            pmRole: data.pmRole || '',
            uxMetrics: data.uxMetrics || {},
            fieldNotes: data.fieldNotes || '',
            links: Array.isArray(data.links) ? data.links : [],
          }
        })
      }

      if (!honorsSnap.empty) {
        honors.value = honorsSnap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<HonorItem, 'id'>),
        }))
      }

      if (settingsSnap.exists()) {
        siteSettings.value = {
          ...defaultSettings,
          ...(settingsSnap.data() as Partial<SiteSettings>),
        }
      }

      isLoaded.value = true
    } catch {
      // Tetap gunakan fallback lokal jika Firestore belum diisi / offline
    } finally {
      isLoading.value = false
    }
  }

  return {
    projects,
    honors,
    siteSettings,
    isLoading,
    isLoaded,
    featuredProjects,
    archiveProjects,
    fetchPortfolioData,
  }
})
