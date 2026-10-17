import { apiClient } from './api-client'
import { migrateGuestStorage, migrateLegacyStorage } from './storage'

export type Session = {
    username: string
    email: string
    userId?: string
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

export async function registerAccount(username: string, email: string, password: string) {
    const { data } = await apiClient.post<Session>('/auth/register', { username, email, password })
    saveSession(data)
    return data
}

export async function loginAccount(email: string, password: string) {
    const { data } = await apiClient.post<Session>('/auth/login', { email, password })
    saveSession(data)
    return data
}

export async function loginWithProvider(provider: string) {
    const { data } = await apiClient.post<Session>('/auth/social', { provider })
    saveSession(data)
    return data
}

export async function updateProfile(currentEmail: string, username: string, email: string) {
    const { data } = await apiClient.put<Session>('/account/profile', { currentEmail, username, email })
    saveSession(data)
    return data
}

export async function changePasswordAccount(email: string, currentPassword: string, newPassword: string) {
    await apiClient.post('/account/password', { email, currentPassword, newPassword })
}

function saveSession(session: Session) {
    for (const key of ['kurio-favorites', 'kurio_cart', 'kurio_orders', 'kurio_last_order']) migrateLegacyStorage(key)
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    for (const key of ['kurio-favorites', 'kurio_cart', 'kurio_orders', 'kurio_last_order']) migrateGuestStorage(key)
    window.dispatchEvent(new Event('kurio-session-changed'))
}
