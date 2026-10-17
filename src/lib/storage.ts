const SESSION_KEY = 'kurio_session'

export function scopedStorageKey(baseKey: string) {
    return `${baseKey}:${getStorageScope()}`
}

export function migrateLegacyStorage(baseKey: string) {
    if (typeof window === 'undefined') return
    const legacyValue = localStorage.getItem(baseKey)
    const targetKey = scopedStorageKey(baseKey)
    if (legacyValue !== null && localStorage.getItem(targetKey) === null) {
        localStorage.setItem(targetKey, legacyValue)
        localStorage.removeItem(baseKey)
    }
}

export function migrateGuestStorage(baseKey: string) {
    if (typeof window === 'undefined') return
    const userKey = scopedStorageKey(baseKey)
    const guestKey = `${baseKey}:guest`
    const guestValue = localStorage.getItem(guestKey)
    if (guestValue === null || userKey === guestKey) return

    if (localStorage.getItem(userKey) === null) {
        localStorage.setItem(userKey, guestValue)
    }
    localStorage.removeItem(guestKey)
}

function getStorageScope() {
    if (typeof window === 'undefined') return 'guest'

    try {
        const session = JSON.parse(localStorage.getItem(SESSION_KEY) ?? 'null') as { userId?: string; email?: string } | null
        return session?.userId ?? session?.email ?? 'guest'
    } catch {
        return 'guest'
    }
}
