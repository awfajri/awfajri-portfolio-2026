export type ProjectCategory = 'ux' | 'dev' | 'aiot' | 'design'
export type RoleLensMode = 'all' | 'ux' | 'engineering'
export type TextFormatStyle = 'normal' | 'bold' | 'italic'

export interface UxMetrics {
  susScore?: string
  seqScore?: string
  npsScore?: string
  researchMethod?: string
  figmaUrl?: string
}

export interface CaseStudyContent {
  problem: string
  research: string
  solution: string
  impact: string
}

export interface ProjectItem {
  id: string
  title: string
  slug: string
  tagline: string
  category: ProjectCategory
  isFeatured: boolean
  displayOrder: number
  year: string
  thumbnailDriveUrl: string
  galleryDriveUrls: string[]
  uxMetrics: UxMetrics
  techStack: string[]
  pmRole?: string
  caseStudyContent: CaseStudyContent
  fieldNotes: string
  repoUrl?: string
  liveUrl?: string
}

export interface HonorItem {
  id: string
  title: string
  organizer: string
  achievementRank: string
  year: string
  highlightBadge: string
  photoDriveUrl?: string
}

export interface SiteSettings {
  cvDriveUrl: string
  figmaBannerDriveUrl: string
  bannerHeadline: string
  bannerCtaText: string
  availabilityStatus: string
  contactEmail: string
}
