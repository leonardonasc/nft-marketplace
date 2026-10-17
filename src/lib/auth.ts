export type Session = {
    username: string
    email: string
}

const SESSION_KEY = 'kurio_session'

export function getSession(): Session | null {
    if (typeof window === 'undefined') return null

    try {
        const session = localStorage.getItem(SESSION_KEY)
        return session ? JSON.parse(session) as Session : null
    } catch {
        return null
    }
}

export function clearSession() {
    localStorage.removeItem(SESSION_KEY)
    window.dispatchEvent(new Event('kurio-session-changed'))
}
