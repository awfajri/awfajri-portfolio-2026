export type ProjectCategory = string
export type RoleLensMode = 'all' | 'ux' | 'engineering'
export type TextFormatStyle = 'normal' | 'bold' | 'italic'

export interface ProjectLink {
  label: string
  url: string
}

export interface ProjectUxMetrics {
  susScore?: string
  seqScore?: string
  npsScore?: string
  researchMethod?: string
}

export interface ProjectItem {
  id: string
  title: string
  slug: string
  tagline: string
  summary?: string
  category: ProjectCategory
  isFeatured: boolean
  isArchived?: boolean
  displayOrder: number
  year: string
  thumbnailDriveUrl: string
  galleryDriveUrls: string[]
  techStack: string[]
  pmRole?: string
  uxMetrics: ProjectUxMetrics
  fieldNotes?: string
  links: ProjectLink[]
}

export interface HonorItem {
  id: string
  title: string
  organizer: string
  year: string
  highlightBadge: string
}

export interface CertificateItem {
  id: string
  title: string
  issuer: string
  year: string
  credentialUrl?: string
}

export interface HighlightItem {
  label: string
  value: string
}

export interface CapabilityItem {
  title: string
  items: string[]
}

export interface SiteSettings {
  contactEmail: string
  cvDriveUrl: string
  figmaBannerDriveUrl: string
  bannerCtaText: string
  profilePhotoDriveUrl: string
  aboutBioParagraph1: string
  aboutBioParagraph2: string
  aboutHighlights: HighlightItem[]
  capabilities: CapabilityItem[]
  categories: string[]
}
