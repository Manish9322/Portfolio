const defaultPlaceholder = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%23999'>Blog Image Placeholder</text>%3E%3C/svg%3E`

export const placeholders = {
  nextjs: defaultPlaceholder,
  typescript: defaultPlaceholder,
  tailwind: defaultPlaceholder,
  redux: defaultPlaceholder,
  authors: {
    john: defaultPlaceholder,
    jane: defaultPlaceholder,
    mike: defaultPlaceholder,
    sarah: defaultPlaceholder
  }
}
