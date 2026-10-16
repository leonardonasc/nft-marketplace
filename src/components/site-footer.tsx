import {
  FaFacebookF,
  FaInstagram,
  FaPinterestP,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

const benefits = [
    ['W', 'Segurança da carteira', 'Proteja sua carteira e colecione arte digital verificada com confiança.'],
    ['C', 'Criadores em destaque', 'Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.'],
    ['D', 'Alertas de lançamentos', 'Receba calendários de cunhagem, novidades de listas de acesso e análises do mercado.'],
]

const footerColumns = [
    ['Meu perfil', 'Meu perfil', 'Minha coleção', 'Atividade', 'Estúdio do criador', 'Lista de interesse'],
    ['Central de ajuda', 'Central de ajuda', 'Como comprar NFTs', 'Carteira e segurança', 'Política do mercado', 'Denunciar item'],
    ['Coleções', 'Arte digital', 'Fotografia', 'Música', 'Arte 3D', 'Utilidade'],
]

export default function SiteFooter() {
    return (
        <footer className="mx-auto mt-16 max-w-7xl overflow-hidden bg-[#241510] text-xs text-[#c8a989]">
            <section className="grid gap-7 p-7 md:grid-cols-4 md:gap-0">
                {benefits.map(([letter, title, description]) => (
                    <div key={title} className="border-[#a86d38] md:border-r md:px-5 first:pl-0">
                        <span className="mb-3 flex size-14 items-center justify-center rounded-full bg-primary text-lg font-bold text-ink">{letter}</span>
                        <h2 className="font-bold text-foreground">{title}</h2>
                        <p className="mt-2 max-w-[190px] leading-5">{description}</p>
                    </div>
                ))}

                <div className="md:pl-5">
                    <h2 className="text-base font-bold leading-4 text-foreground">Antecipe-se ao próximo<br />lançamento</h2>
                    <form className="mt-3 flex" onSubmit={(event) => event.preventDefault()}>
                        <input type="email" required placeholder="digite seu e-mail..." className="input-kurio min-w-0 flex-1 bg-[#432618]" />
                        <button type="submit" className="bg-primary px-3 font-bold text-ink">Enviar</button>
                    </form>
                    <p className="mt-3 leading-5">Receba lançamentos selecionados, histórias de criadores e novidades do mercado.</p>
                </div>
            </section>

            <section className="grid items-center gap-5 bg-[#40230f] px-7 py-5 md:grid-cols-[1fr_1.4fr_1fr_1fr] md:gap-6">
                <strong className="text-left text-foreground">KURIO</strong>
                <span className="text-left leading-5">Feito para colecionadores,<br />criadores e cultura</span>
                <span className="text-left">contato@email.com</span>
                <span className="text-left">+55 11 4002 8922</span>
            </section>

            <section className="grid gap-8 p-7 md:grid-cols-4">
                {footerColumns.map(([title, ...items]) => (
                    <div key={title}>
                        <h2 className="mb-3 text-base font-bold text-foreground">{title}</h2>
                        <ul className="space-y-2">
                            {items.map((item) => <li key={item}>{item}</li>)}
                        </ul>
                    </div>
                ))}

                <div>
                <h2 className="mb-3 text-base font-bold text-foreground">
                    Redes sociais
                </h2>

                <div className="flex gap-2 text-primary">
                    {[
                    { name: "Facebook", icon: FaFacebookF },
                    { name: "Instagram", icon: FaInstagram },
                    { name: "Pinterest", icon: FaPinterestP },
                    { name: "LinkedIn", icon: FaLinkedinIn },
                    { name: "YouTube", icon: FaYoutube },
                    ].map(({ name, icon: Icon }) => (
                    <a
                        key={name}
                        href="#"
                        aria-label={name}
                        className="flex size-7 items-center justify-center rounded border border-primary transition-colors hover:bg-primary hover:text-[#241510]"
                    >
                        <Icon size={13} />
                    </a>
                    ))}
                </div>

                <h2 className="mt-6 mb-3 text-base font-bold text-foreground">
                    Carteiras compatíveis
                </h2>

                <span className="rounded bg-[#5b3218] px-2 py-1 text-[8px] text-primary">
                    METAMASK · WALLETCONNECT · COINBASE
                </span>
                </div>
            </section>

            <p className="border-t border-border px-4 py-3 text-center">© 2026 Kurio. Propriedade digital para todos.</p>
        </footer>
    )
}
