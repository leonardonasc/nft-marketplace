import CatalogPage from '../pages/catalog-page'
import NftDetailPage from '../pages/nft-detail-page'
import AuthPage from '../pages/auth-page'
import CartPage from '../pages/cart-page'
import CheckoutPage from '../pages/checkout-page'
import ConfirmationPage from '../pages/confirmation-page'
import MarketPage from '../pages/market-page'

export default function AppRouter() {
	const path = window.location.pathname
	const detailMatch = path.match(/^\/nft\/([^/]+)$/)

	if (detailMatch) return <NftDetailPage id={detailMatch[1]} />
	if (path === '/login') return <AuthPage mode="login" />
	if (path === '/register') return <AuthPage mode="register" />
	if (path === '/mercado') return <MarketPage />
	if (path === '/cart') return <CartPage />
	if (path === '/checkout') return <CheckoutPage />
	if (path === '/confirmation') return <ConfirmationPage />
	if (path === '/creators') return <CatalogPage active="Criadores" />
	if (path === '/learn') return <CatalogPage active="Aprenda" />

	return <CatalogPage />
}
