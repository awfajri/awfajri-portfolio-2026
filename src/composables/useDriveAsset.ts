export function useDriveAsset() {
  const extractFileId = (url?: string): string | null => {
    if (!url) return null
    const trimmed = url.trim()

    // Jika input sudah berupa File ID mentah tanpa URL
    if (/^[a-zA-Z0-9_-]{25,}$/.test(trimmed)) {
      return trimmed
    }

    const patterns = [
      /\/file\/d\/([a-zA-Z0-9_-]+)/,
      /[?&]id=([a-zA-Z0-9_-]+)/,
      /\/d\/([a-zA-Z0-9_-]+)/,
    ]

    for (const pattern of patterns) {
      const match = trimmed.match(pattern)
      if (match && match[1]) return match[1]
    }

    return null
  }

  const getDriveImageUrl = (url?: string, fallback = ''): string => {
    if (!url) return fallback
    const id = extractFileId(url)
    return id ? `https://lh3.googleusercontent.com/d/${id}` : url
  }

  const getDriveDownloadUrl = (url?: string): string => {
    if (!url) return '#'
    const id = extractFileId(url)
    return id ? `https://drive.google.com/uc?export=download&id=${id}` : url
  }

  return {
    extractFileId,
    getDriveImageUrl,
    getDriveDownloadUrl,
  }
}
