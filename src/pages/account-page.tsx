import {
    Activity,
    AlertTriangle,
    CircleUserRound,
    Download,
    Heart,
    LogOut,
    MapPin,
    ShoppingCart,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import SiteHeader from '@/components/site-header'
import SiteFooter from '@/components/site-footer'
import MobileNavbar from '@/components/mobile-navbar'
import { changePasswordAccount, clearSession, getSession, updateProfile } from '@/lib/auth'
import { getFavorites } from '@/lib/favorites'
import NftCard from '@/features/catalog/components/nft-card'
import { nftFixtures } from '@/mocks/fixtures'

type AccountSection = 'Dados do perfil' | 'Carteiras' | 'Atividade' | 'Lista de interesse' | 'Ofertas' | 'Arquivos baixados' | 'Suporte'

const sections: Array<{ label: AccountSection; icon: typeof CircleUserRound }> = [
    { label: 'Dados do perfil', icon: CircleUserRound },
    { label: 'Carteiras', icon: MapPin },
    { label: 'Atividade', icon: ShoppingCart },
    { label: 'Lista de interesse', icon: Heart },
    { label: 'Ofertas', icon: Activity },
    { label: 'Arquivos baixados', icon: Download },
    { label: 'Suporte', icon: AlertTriangle },
]

export default function AccountPage() {
    const session = getSession()
    const [activeSection, setActiveSection] = useState<AccountSection>('Dados do perfil')
    const [displayName, setDisplayName] = useState(session?.username ?? '')
    const [username, setUsername] = useState(session?.username ?? '')
    const [email, setEmail] = useState(session?.email ?? '')
    const [ens, setEns] = useState('')
    const [walletName, setWalletName] = useState('')
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [notice, setNotice] = useState('')
    const [walletNetwork, setWalletNetwork] = useState('')
    const [walletProfile, setWalletProfile] = useState('')
    const [walletAddress, setWalletAddress] = useState('')
    const [secondaryWallet, setSecondaryWallet] = useState('')
    const [walletType, setWalletType] = useState('')
    const [referralCode, setReferralCode] = useState('')
    const [walletEmail, setWalletEmail] = useState(email)
    const [sameAsPrimary, setSameAsPrimary] = useState(false)
    const [favoriteIds, setFavoriteIds] = useState(getFavorites)

    useEffect(() => {
        const updateFavorites = () => setFavoriteIds(getFavorites())
        window.addEventListener('kurio-favorites-changed', updateFavorites)
        window.addEventListener('storage', updateFavorites)
        return () => {
            window.removeEventListener('kurio-favorites-changed', updateFavorites)
            window.removeEventListener('storage', updateFavorites)
        }
    }, [])

    async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (!session) return

        try {
            await updateProfile(session.email, username, email)
            setNotice('Dados do perfil salvos.')
        } catch {
            setNotice('Não foi possível salvar os dados do perfil.')
        }
    }

    async function changePassword(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (newPassword.length < 6 || newPassword !== confirmPassword) {
            setNotice('A nova senha precisa ter 6 caracteres e coincidir na confirmação.')
            return
        }
        try {
            await changePasswordAccount(session?.email ?? email, currentPassword, newPassword)
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
            setNotice('Senha alterada com sucesso.')
        } catch {
            setNotice('A senha atual não confere.')
        }
    }

    function logout() {
        clearSession()
        window.location.href = '/'
    }

    function saveWallet(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setNotice('Carteira principal salva.')
    }

    if (!session) {
        return <main className="min-h-screen bg-ink px-4 py-10 text-foreground"><section className="mx-auto max-w-xl bg-surface-card p-10 text-center"><h1 className="font-bold">Entre para acessar seu perfil</h1><button type="button" onClick={() => (window.location.href = '/login')} className="mt-6 rounded bg-primary px-5 py-3 text-xs font-bold text-ink">Entrar</button></section></main>
    }

    return <main className="min-h-screen bg-ink px-4 py-5 text-foreground md:px-10 lg:px-16">
        <SiteHeader active="Início" />
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[220px_1fr] lg:grid-cols-[250px_1fr]">
            <aside className="h-fit bg-surface-card">
                <h1 className="border-b border-border px-4 py-4 text-sm font-bold">Meu perfil</h1>
                <nav aria-label="Menu do perfil" className="p-0">
                    {sections.map(({ label, icon: Icon }) => <button type="button" key={label} onClick={() => { setActiveSection(label); setNotice('') }} className={`flex w-full items-center gap-3 border-l-4 px-3 py-2.5 text-left text-xs ${activeSection === label ? 'border-primary bg-surface-raised text-primary' : 'border-transparent text-secondary hover:text-foreground'}`}><Icon className="size-4" />{label}</button>)}
                </nav>
                <button type="button" onClick={logout} className="flex w-full items-center gap-3 border-t border-border px-3 py-3 text-left text-xs text-primary"><LogOut className="size-4" />Sair</button>
            </aside>

            <section className="min-w-0 pb-16">
                {activeSection === 'Dados do perfil' ? <>
                    <form onSubmit={saveProfile} className="grid max-w-3xl gap-x-5 gap-y-4 md:grid-cols-2">
                        <h2 className="col-span-full mb-2 text-sm font-bold">Perfil do colecionador</h2>
                        <label className="text-xs text-secondary">Nome de exibição*<input required value={displayName} onChange={(event) => setDisplayName(event.target.value)} className="input-kurio mt-2" /></label>
                        <label className="text-xs text-secondary">Nome de usuário*<input required value={username} onChange={(event) => setUsername(event.target.value)} className="input-kurio mt-2" /></label>
                        <label className="text-xs text-secondary">E-mail*<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="input-kurio mt-2" /></label>
                        <label className="text-xs text-secondary">Nome ENS*<span className="mt-2 flex"><select className="input-kurio w-16 rounded-r-none" defaultValue="eth"><option value="eth">.eth</option></select><input value={ens} onChange={(event) => setEns(event.target.value)} className="input-kurio rounded-l-none border-l-0" /></span></label>
                        <label className="text-xs text-secondary">Apelido da carteira*<input value={walletName} onChange={(event) => setWalletName(event.target.value)} className="input-kurio mt-2" /></label>
                        <div className="text-xs text-secondary"><span className="block">Avatar</span><div className="mt-2 flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-full bg-surface-raised text-primary"><CircleUserRound className="size-5" /></div><button type="button" className="rounded bg-primary px-4 py-2 text-[10px] font-bold text-ink">Alterar</button><button type="button" className="text-[10px] text-secondary">Remover</button></div></div>
                        <button type="submit" className="mt-2 w-fit rounded bg-primary px-7 py-2.5 text-xs font-bold text-ink">Salvar</button>
                    </form>
                    <form onSubmit={changePassword} className="mt-8 grid max-w-3xl gap-4 md:max-w-[300px]">
                        <h2 className="text-sm font-bold">Alterar senha</h2>
                        <label className="text-xs text-secondary">Senha atual<input required type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} className="input-kurio mt-2" /></label>
                        <label className="text-xs text-secondary">Nova senha<input required type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className="input-kurio mt-2" /></label>
                        <label className="text-xs text-secondary">Confirmar nova senha<input required type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="input-kurio mt-2" /></label>
                        <button type="submit" className="w-fit rounded bg-primary px-7 py-2.5 text-xs font-bold text-ink">Salvar</button>
                    </form>
                    {notice && <p role="status" className="mt-4 text-xs text-primary">{notice}</p>}
                </> : activeSection === 'Carteiras' ? <WalletsPanel
                    walletNetwork={walletNetwork}
                    setWalletNetwork={setWalletNetwork}
                    walletProfile={walletProfile}
                    setWalletProfile={setWalletProfile}
                    walletAddress={walletAddress}
                    setWalletAddress={setWalletAddress}
                    secondaryWallet={secondaryWallet}
                    setSecondaryWallet={setSecondaryWallet}
                    walletType={walletType}
                    setWalletType={setWalletType}
                    referralCode={referralCode}
                    setReferralCode={setReferralCode}
                    walletEmail={walletEmail}
                    setWalletEmail={setWalletEmail}
                    ens={ens}
                    setEns={setEns}
                    sameAsPrimary={sameAsPrimary}
                    setSameAsPrimary={setSameAsPrimary}
                    onSubmit={saveWallet}
                    notice={notice}
                /> : activeSection === 'Lista de interesse' ? <WishlistPanel favoriteIds={favoriteIds} /> : <section className="max-w-3xl bg-surface-card p-8"><h2 className="text-lg font-bold">{activeSection}</h2><p className="mt-3 text-sm text-text-muted">Esta área do seu perfil estará disponível conforme você criar atividade na Kurio.</p></section>}
            </section>
        </div>
        <SiteFooter />
        <MobileNavbar />
    </main>
}

function WishlistPanel({ favoriteIds }: { favoriteIds: string[] }) {
    const favorites = nftFixtures.filter((nft) => favoriteIds.includes(nft.id))

    return <section className="max-w-5xl">
        <div className="mb-6 flex items-center justify-between gap-4"><div><h2 className="text-sm font-bold">Lista de interesse</h2><p className="mt-1 text-[10px] text-text-muted">NFTs que você salvou para acompanhar depois.</p></div><span className="text-xs text-primary">{favorites.length} {favorites.length === 1 ? 'item' : 'itens'}</span></div>
        {favorites.length === 0 ? <div className="bg-surface-card p-10 text-center"><Heart className="mx-auto size-8 text-text-muted" /><h3 className="mt-4 text-sm font-bold">Sua lista está vazia</h3><p className="mt-2 text-xs text-text-muted">Salve NFTs no coração para encontrá-los aqui.</p><button type="button" onClick={() => (window.location.href = '/mercado')} className="mt-5 rounded bg-primary px-5 py-2.5 text-xs font-bold text-ink">Explorar o Mercado</button></div> : <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{favorites.map((nft) => <NftCard key={nft.id} id={nft.id} imageUrl={nft.imageUrl} name={nft.name} priceEth={nft.priceEth} isRare={nft.isRare} />)}</div>}
    </section>
}

type WalletsPanelProps = {
    walletNetwork: string
    setWalletNetwork: (value: string) => void
    walletProfile: string
    setWalletProfile: (value: string) => void
    walletAddress: string
    setWalletAddress: (value: string) => void
    secondaryWallet: string
    setSecondaryWallet: (value: string) => void
    walletType: string
    setWalletType: (value: string) => void
    referralCode: string
    setReferralCode: (value: string) => void
    walletEmail: string
    setWalletEmail: (value: string) => void
    ens: string
    setEns: (value: string) => void
    sameAsPrimary: boolean
    setSameAsPrimary: (value: boolean) => void
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
    notice: string
}

function WalletsPanel({ walletNetwork, setWalletNetwork, walletProfile, setWalletProfile, walletAddress, setWalletAddress, secondaryWallet, setSecondaryWallet, walletType, setWalletType, referralCode, setReferralCode, walletEmail, setWalletEmail, ens, setEns, sameAsPrimary, setSameAsPrimary, onSubmit, notice }: WalletsPanelProps) {
    return <div className="max-w-3xl">
        <div className="mb-5 flex items-start justify-between gap-4"><div><h2 className="text-sm font-bold">Carteira principal</h2><p className="mt-1 text-[10px] text-text-muted">Estas carteiras ficam disponíveis no pagamento e para receber NFTs comprados.</p></div><button type="button" onClick={() => document.getElementById('wallet-form')?.scrollIntoView({ behavior: 'smooth' })} className="text-xs font-bold text-primary">Adicionar</button></div>
        <form id="wallet-form" onSubmit={onSubmit} className="grid gap-x-5 gap-y-4 md:grid-cols-2">
            <label className="text-xs text-secondary">Nome de exibição*<input required className="input-kurio mt-2" /></label>
            <label className="text-xs text-secondary">Apelido da carteira*<input required className="input-kurio mt-2" /></label>
            <label className="text-xs text-secondary">Rede*<select required value={walletNetwork} onChange={(event) => setWalletNetwork(event.target.value)} className="input-kurio mt-2"><option value="">Selecione uma rede</option><option>Ethereum</option><option>Polygon</option><option>Solana</option></select></label>
            <label className="text-xs text-secondary">Nome do perfil*<input required value={walletProfile} onChange={(event) => setWalletProfile(event.target.value)} className="input-kurio mt-2" /></label>
            <label className="text-xs text-secondary">Endereço da carteira*<input required value={walletAddress} onChange={(event) => setWalletAddress(event.target.value)} placeholder="Endereço 0x da carteira" className="input-kurio mt-2" /></label>
            <label className="text-xs text-secondary">ENS ou carteira secundária (opcional)<input value={secondaryWallet} onChange={(event) => setSecondaryWallet(event.target.value)} className="input-kurio mt-2" /></label>
            <label className="text-xs text-secondary">Tipo de carteira*<select required value={walletType} onChange={(event) => setWalletType(event.target.value)} className="input-kurio mt-2"><option value="">Selecione uma carteira</option><option>MetaMask</option><option>WalletConnect</option><option>Coinbase Wallet</option></select></label>
            <label className="text-xs text-secondary">Código de indicação*<input value={referralCode} onChange={(event) => setReferralCode(event.target.value)} className="input-kurio mt-2" /></label>
            <label className="text-xs text-secondary">E-mail*<input required type="email" value={walletEmail} onChange={(event) => setWalletEmail(event.target.value)} className="input-kurio mt-2" /></label>
            <label className="text-xs text-secondary">Nome ENS*<span className="mt-2 flex"><select className="input-kurio w-16 rounded-r-none" defaultValue="eth"><option value="eth">.eth</option></select><input value={ens} onChange={(event) => setEns(event.target.value)} className="input-kurio rounded-l-none border-l-0" /></span></label>
            <button type="submit" className="mt-1 w-fit rounded bg-primary px-3 py-2 text-[10px] font-bold text-ink">Salvar carteira</button>
        </form>
        {notice && <p role="status" className="mt-3 text-xs text-primary">{notice}</p>}
        <div className="mt-7 border-t border-border pt-4"><div className="flex items-center justify-between gap-4"><div><h2 className="text-sm font-bold">Carteira secundária</h2><p className="mt-1 text-[10px] text-text-muted">Você ainda não adicionou uma carteira secundária.</p></div><label className="flex items-center gap-2 text-[10px] text-secondary"><input type="checkbox" checked={sameAsPrimary} onChange={(event) => setSameAsPrimary(event.target.checked)} className="accent-primary" /> Igual à carteira principal <button type="button" className="font-bold text-primary">Adicionar</button></label></div></div>
    </div>
}
