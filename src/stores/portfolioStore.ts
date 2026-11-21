import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { HonorItem, ProjectItem, SiteSettings } from '@/types/portfolio'

const DEFAULT_SETTINGS: SiteSettings = {
  cvDriveUrl: '',
  figmaBannerDriveUrl: '',
  bannerHeadline: 'Have an ambitious product idea or competition team in mind?',
  bannerCtaText: 'Start a Conversation',
  availabilityStatus: 'Available for Product Design & Front-End Opportunities',
  contactEmail: 'auffajri.ramadhani@gmail.com',
}

const FALLBACK_PROJECTS: ProjectItem[] = [
  {
    id: 'pijar-memori',
    title: 'PijarMemori',
    slug: 'pijarmemori',
    tagline: 'Gerontechnology dementia care and generative AI reminiscence therapy ecosystem.',
    category: 'ux',
    isFeatured: true,
    displayOrder: 1,
    year: '2026',
    thumbnailDriveUrl: '',
    galleryDriveUrls: [],
    uxMetrics: {
      susScore: '80.0 / 100',
      researchMethod: 'Mixed-Method Usability Testing (8 Caregivers & Elderly)',
    },
    techStack: ['Figma', 'Design System', 'Generative AI UX', 'Usability Testing'],
    pmRole: 'Lead Product Designer & UX Researcher',
    caseStudyContent: {
      problem:
        'Family caregivers struggle to maintain structured cognitive stimulation for seniors experiencing early-stage dementia.',
      research:
        'Conducted contextual interviews and usability evaluations with 8 participants, achieving a mean SUS score of 80.0.',
      solution:
        'Designed an accessible reminiscence interface with high-contrast typography, large touch targets, and guided memory prompts.',
      impact:
        '2nd Place at IT FEST 2026 Universitas Brawijaya and 3rd Place at BEM FTI Competition.',
    },
    fieldNotes:
      'Traveling to Malang for the offline finals pushed our team to strip away every decorative screen and focus strictly on caregiver recovery flows.',
  },
  {
    id: 'lentera',
    title: 'Lentera',
    slug: 'lentera',
    tagline: 'Civic-tech B2G public safety and street-lighting audit platform for Karawang.',
    category: 'ux',
    isFeatured: true,
    displayOrder: 2,
    year: '2026',
    thumbnailDriveUrl: '',
    galleryDriveUrls: [],
    uxMetrics: {
      seqScore: '4.86 / 5.0',
      npsScore: '4.8 / 5.0',
      researchMethod: 'Field Audit & Citizen Reporting Flow Validation',
    },
    techStack: ['Figma', 'B2G Workflow', 'Geolocation UX', 'Prototyping'],
    pmRole: 'Product Designer & Civic Stakeholder Liaison',
    caseStudyContent: {
      problem:
        'Unreported broken street lights create nighttime safety hazards and slow municipal maintenance dispatch.',
      research:
        'Evaluated citizen reporting friction and validated a 3-step geospatial reporting workflow with SEQ 4.86/5.0.',
      solution:
        'Built a dual-sided reporting experience connecting citizen hazard pins directly to municipal verification queues.',
      impact:
        '4th Place Finalist at I/O Festival 2026 UNTAR and entered integration consultation with Dinas PUPR Karawang.',
    },
    fieldNotes:
      'Presenting directly to local public works officials taught me how civic software must prioritize low-bandwidth reliability over visual novelty.',
  },
  {
    id: 'fundledger',
    title: 'FundLedger',
    slug: 'fundledger',
    tagline: 'Transparent financial management and immutable blockchain audit web application.',
    category: 'dev',
    isFeatured: true,
    displayOrder: 3,
    year: '2026',
    thumbnailDriveUrl: '',
    galleryDriveUrls: [],
    uxMetrics: {
      researchMethod: 'Financial Audit Dashboard Information Architecture',
    },
    techStack: [
      'Vue 3',
      'TypeScript',
      'PrimeVue',
      'Pinia',
      'Laravel Sanctum',
      'MySQL',
      'Ethereum EVM',
    ],
    pmRole: 'Front-End Architect & Product Designer',
    caseStudyContent: {
      problem:
        'Traditional organizational ledgers lack tamper-evident verification when audited across multiple stakeholders.',
      research:
        'Mapped auditor verification checkpoints to minimize clicks between transaction entries and on-chain hash proofs.',
      solution:
        'Engineered a modular Vue 3 and TypeScript interface backed by Laravel Sanctum APIs and EVM smart contract verification.',
      impact: 'Delivered real-time ledger reconciliation with cryptographic audit trails.',
    },
    fieldNotes:
      'Coordinating API contracts with our backend architect early prevented state synchronization bugs during smart contract receipt polling.',
  },
  {
    id: 'pos-nasicafe',
    title: 'POS-nasiCafe',
    slug: 'pos-nasicafe',
    tagline: 'Integrated cashier point-of-sale and mobile-first customer self-order web system.',
    category: 'dev',
    isFeatured: true,
    displayOrder: 4,
    year: '2026',
    thumbnailDriveUrl: '',
    galleryDriveUrls: [],
    uxMetrics: {
      researchMethod: 'Counter Queue Observation & Mobile Ordering Flow',
    },
    techStack: ['Laravel', 'MySQL', 'Blade', 'REST API', 'Git Workflow'],
    pmRole: 'Project Manager & Full-Stack Developer',
    caseStudyContent: {
      problem:
        'Peak-hour queue bottlenecks slowed down manual order taking and kitchen ticket routing.',
      research:
        'Observed order handoff friction between front-of-house cashiers and kitchen preparation stations.',
      solution:
        'Built a unified cashier terminal and QR table self-order flow with clean database seeding and branch-protected PR reviews.',
      impact: 'Streamlined order lifecycle management across a 4-person engineering squad.',
    },
    fieldNotes:
      'Enforcing strict Git pull request reviews across four teammates kept our database migrations clean throughout rapid sprint iterations.',
  },
  {
    id: 'autolayout-os',
    title: 'AutoLayoutOS',
    slug: 'autolayout-os',
    tagline: 'Custom remastered Fedora KDE 44 Linux distribution with a self-compiled kernel.',
    category: 'dev',
    isFeatured: false,
    displayOrder: 5,
    year: '2026',
    thumbnailDriveUrl: '',
    galleryDriveUrls: [],
    uxMetrics: {},
    techStack: ['Fedora KDE 44', 'Linux Kernel', 'Bash', 'System Remastering'],
    pmRole: 'Systems Engineer',
    caseStudyContent: {
      problem:
        'Standard desktop distributions require extensive post-install configuration for design and development workflows.',
      research:
        'Benchmarked kernel modules and desktop environment defaults for responsive multitasking.',
      solution:
        'Compiled a custom kernel and packaged a bootable ISO tailored for productivity and clean desktop aesthetics.',
      impact:
        'Shipped a reproducible custom OS image for Operating Systems engineering coursework.',
    },
    fieldNotes:
      'Debugging kernel build flags from scratch deepened my understanding of how software performance starts below the UI layer.',
  },
]

const FALLBACK_HONORS: HonorItem[] = [
  {
    id: 'ub-2026',
    title: '2nd Place UI/UX Design Competition',
    organizer: 'IT FEST 2026 — FILKOM Universitas Brawijaya',
    achievementRank: 'Juara 2 Nasional',
    year: '2026',
    highlightBadge: 'PijarMemori',
  },
  {
    id: 'uniska-2026',
    title: '3rd Place UI/UX Design Competition',
    organizer: 'BEM FTI Competition — UNISKA MAB',
    achievementRank: 'Juara 3 Nasional',
    year: '2026',
    highlightBadge: 'PijarMemori',
  },
  {
    id: 'untar-2026',
    title: '4th Place (Juara Harapan 1) UI/UX Design',
    organizer: 'I/O Festival 2026 — Universitas Tarumanagara',
    achievementRank: 'Finalist & Harapan 1',
    year: '2026',
    highlightBadge: 'Lentera',
  },
  {
    id: 'undip-2025',
    title: '5th Place UI/UX Design Finalist',
    organizer: 'The ACE 2025 — HIMASKOM Universitas Diponegoro',
    achievementRank: 'Top 5 National Finalist',
    year: '2025',
    highlightBadge: 'Akselia',
  },
]

export const usePortfolioStore = defineStore('portfolio', () => {
  const projects = ref<ProjectItem[]>(FALLBACK_PROJECTS)
  const honors = ref<HonorItem[]>(FALLBACK_HONORS)
  const siteSettings = ref<SiteSettings>(DEFAULT_SETTINGS)
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const featuredProjects = computed(() =>
    projects.value
      .filter((item) => item.isFeatured)
      .sort((a, b) => a.displayOrder - b.displayOrder),
  )

  const archiveProjects = computed(() =>
    projects.value
      .filter((item) => !item.isFeatured)
      .sort((a, b) => Number(b.year) - Number(a.year)),
  )

  async function fetchPortfolioData() {
    isLoading.value = true
    error.value = null

    try {
      const projectsQuery = query(collection(db, 'projects'), orderBy('displayOrder', 'asc'))
      const projectSnap = await getDocs(projectsQuery)

      if (!projectSnap.empty) {
        projects.value = projectSnap.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<ProjectItem, 'id'>),
        }))
      }

      const honorSnap = await getDocs(collection(db, 'honors'))
      if (!honorSnap.empty) {
        honors.value = honorSnap.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<HonorItem, 'id'>),
        }))
      }

      const settingsSnap = await getDoc(doc(db, 'site_settings', 'config'))
      if (settingsSnap.exists()) {
        siteSettings.value = {
          ...DEFAULT_SETTINGS,
          ...(settingsSnap.data() as Partial<SiteSettings>),
        }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load portfolio data'
      // Tetap gunakan fallback data agar UI publik tidak kosong jika Firebase belum diisi
    } finally {
      isLoading.value = false
    }
  }

  return {
    projects,
    honors,
    siteSettings,
    isLoading,
    error,
    featuredProjects,
    archiveProjects,
    fetchPortfolioData,
  }
})
