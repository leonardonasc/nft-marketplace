import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { FaFacebookF } from 'react-icons/fa'
import { loginAccount, registerAccount } from '@/lib/auth'

type AuthPageProps = { mode: 'login' | 'register' }

export default function AuthPage({ mode }: AuthPageProps) {
    const isRegister = mode === 'register'
    const [showPassword, setShowPassword] = useState(false)
    const [notice, setNotice] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setNotice('')

        if (isRegister) {
            if (password.length < 6) {
                setNotice('A senha precisa ter pelo menos 6 caracteres.')
                return
            }

            if (password !== confirmPassword) {
                setNotice('As senhas não coincidem.')
                return
            }

            try {
                await registerAccount(username, email, password)
                window.location.href = '/'
            } catch (error) {
                setNotice(getAuthError(error))
            }
            return
        }

        try {
            await loginAccount(email, password)
            window.location.href = '/'
        } catch (error) {
            setNotice(getAuthError(error))
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#211f1f] px-4 py-8 text-foreground">
            <section className="relative w-full max-w-97.5 rounded-none border-b-4 border-primary bg-ink px-6 py-12 shadow-2xl sm:px-10 md:max-w-170 md:px-12 md:py-10">
                <button
                    type="button"
                    aria-label="Fechar"
                    onClick={() => (window.location.href = '/')}
                    className="absolute right-4 top-2 text-lg text-primary md:right-5 md:top-1"
                >
                    ×
                </button>

                <h1 className="text-center text-2xl font-bold tracking-[0.15em] md:hidden">KURIO</h1>

                <div className="hidden text-center md:block">
                    <div className="text-lg font-bold tracking-wide">
                        <button
                            type="button"
                            onClick={() => isRegister && (window.location.href = '/login')}
                            className={isRegister ? 'text-text-muted' : 'text-primary'}
                        >
                            Entrar
                        </button>
                        <span className="px-2 text-text-muted">|</span>
                        <button
                            type="button"
                            onClick={() => isRegister ? undefined : (window.location.href = '/register')}
                            className={isRegister ? 'text-foreground' : 'text-foreground'}
                        >
                            Criar conta
                        </button>
                    </div>
                    <p className="mx-auto mt-8 max-w-97.5 text-xs leading-4 text-foreground">
                        Entre para gerenciar sua carteira, coleção e perfil de criador.
                    </p>
                </div>

                <h2 className="mt-16 text-center text-base font-bold md:hidden">
                    {isRegister ? 'Criar perfil de colecionador' : 'Entrar'}
                </h2>

                <form className="mt-8 space-y-2 md:mx-auto md:mt-5 md:max-w-75" onSubmit={handleSubmit}>
                    {isRegister && <input className="input-kurio" value={username} onChange={(event) => setUsername(event.target.value)} required placeholder="Nome de usuário" />}
                    <input className="input-kurio" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder={isRegister ? 'Digite seu e-mail' : 'contato@email.com'} />
                    <div className="relative">
                        <input className="input-kurio w-full pr-10" type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} required placeholder="Senha" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-amber">
                            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                    </div>
                    {isRegister && <input className="input-kurio" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required placeholder="Confirmar senha" />}
                    {!isRegister && <button type="button" onClick={() => setNotice('Enviamos instruções para o seu e-mail.')} className="block w-full text-right text-[10px] text-amber">Esqueceu a senha?</button>}
                    <button className="mt-6 w-full rounded-md bg-primary py-4 text-xs font-bold text-ink">{isRegister ? 'Criar perfil' : 'Entrar'}</button>
                </form>

                <div className="mx-auto my-8 flex max-w-75 items-center gap-2 text-[10px] text-text-muted"><span className="h-px flex-1 bg-border" />Ou continue com<span className="h-px flex-1 bg-border" /></div>
                {notice && <p role="status" className="mb-3 text-center text-[10px] text-amber">{notice}</p>}
                <div className="mx-auto max-w-75 space-y-2">
                    <button
                        type="button"
                        onClick={() => ('')}
                        className="flex w-full items-center justify-center gap-3 rounded-md border border-border py-3 text-xs text-secondary transition-colors hover:bg-white/5"
                    >
                        <FcGoogle size={16} />
                        Continuar com Google
                    </button>

                    <button
                        type="button"
                        onClick={() => ('')}
                        className="flex w-full items-center justify-center gap-3 rounded-md border border-border py-3 text-xs text-secondary transition-colors hover:bg-white/5"
                    >
                        <FaFacebookF size={15} className="text-[#1877F2]" />
                        Continuar com Facebook
                    </button>
                </div>
                <button type="button" onClick={() => (window.location.href = isRegister ? '/login' : '/register')} className="mt-8 w-full text-center text-xs text-secondary">
                    {isRegister ? 'Já tem uma conta? Entre' : 'Novo na Kurio? Crie uma conta'}
                </button>
            </section>
        </main>
    )
}

function getAuthError(error: unknown) {
    if (typeof error === 'object' && error !== null && 'response' in error) {
        const response = error.response
        if (typeof response === 'object' && response !== null && 'data' in response) {
            const data = response.data
            if (typeof data === 'object' && data !== null && 'message' in data && typeof data.message === 'string') return data.message
        }
    }

    return 'Não foi possível concluir a autenticação. Tente novamente.'
}
