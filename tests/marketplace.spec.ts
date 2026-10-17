import { expect, test } from '@playwright/test'

test('permite pesquisar no Mercado e abrir um NFT', async ({ page }) => {
    await page.goto('/mercado')
    await expect(page.getByRole('heading', { name: 'NFTs' })).toBeVisible()
    await page.getByPlaceholder('Explorar coleções').fill('Emerald')
    await expect(page.getByText('Emerald Ape #042')).toBeVisible()
    await page.getByText('Emerald Ape #042').click()
    await expect(page).toHaveURL(/\/nft\/nft-001$/)
})

test('permite salvar um favorito e listá-lo', async ({ page }) => {
    await page.goto('/nft/nft-001')
    await page.getByRole('button', { name: 'Adicionar aos favoritos' }).first().click()
    await page.goto('/favorites')
    await expect(page.getByText('Emerald Ape #042')).toBeVisible()
})

test('valida o checkout antes de criar um pedido', async ({ page }) => {
    await page.goto('/nft/nft-001')
    await page.getByRole('button', { name: 'Adicionar ao carrinho' }).click()
    await page.goto('/checkout')
    await page.getByRole('button', { name: 'Confirmar compra' }).click()
    await expect(page).toHaveURL(/\/checkout$/)
})

test('exibe favoritos na lista de interesse da conta', async ({ page }) => {
    await page.addInitScript(() => {
        localStorage.setItem('kurio_session', JSON.stringify({ username: 'colecionador', email: 'colecionador@kurio.local' }))
        localStorage.setItem('kurio-favorites', JSON.stringify(['nft-001']))
    })
    await page.goto('/account')
    await page.getByRole('button', { name: 'Lista de interesse' }).click()
    await expect(page.getByText('Emerald Ape #042')).toBeVisible()
})
