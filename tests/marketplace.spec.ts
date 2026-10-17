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

test('cria um pedido idempotente e exibe o recibo confirmado', async ({ page }) => {
    await page.goto('/nft/nft-001')
    await page.getByRole('button', { name: 'Adicionar ao carrinho' }).click()
    await page.goto('/checkout')
    await expect(page.getByRole('heading', { name: 'Perfil de colecionador' })).toBeVisible()

    const requiredInputs = page.locator('form').first().locator('input[required]')
    for (let index = 0; index < await requiredInputs.count(); index += 1) {
        await requiredInputs.nth(index).fill(index === 8 ? 'colecionador@example.com' : `Colecionador ${index + 1}`)
    }

    await page.getByRole('button', { name: 'Confirmar compra' }).click()
    await expect(page).toHaveURL(/\/confirmation\?order=/)
    await expect(page.getByRole('heading', { name: 'Seus NFTs agora estão na sua carteira' })).toBeVisible()
    await expect(page.getByText('Emerald Ape #042')).toBeVisible()
})

test('preserva o carrinho quando a carteira recusa o pagamento', async ({ page }) => {
    await page.goto('/nft/nft-001')
    await page.getByRole('button', { name: 'Adicionar ao carrinho' }).click()
    await page.goto('/checkout')
    await expect(page.getByRole('heading', { name: 'Perfil de colecionador' })).toBeVisible()

    const requiredInputs = page.locator('form').first().locator('input[required]')
    for (let index = 0; index < await requiredInputs.count(); index += 1) {
        await requiredInputs.nth(index).fill(index === 8 ? 'colecionador@example.com' : `Colecionador ${index + 1}`)
    }
    await page.getByRole('button', { name: 'Coinbase Wallet' }).click()
    await page.getByRole('button', { name: 'Confirmar compra' }).click()

    await expect(page.getByRole('alert')).toHaveText('Não foi possível confirmar o pagamento. Seus itens foram preservados no carrinho.')
    await expect(page.getByText('Emerald Ape #042 (x 1)')).toBeVisible()
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

test('autentica um usuário simulado e rejeita credenciais inválidas', async ({ page }) => {
    await page.goto('/login')
    await page.getByPlaceholder('contato@email.com').fill('colecionador@kurio.local')
    await page.getByPlaceholder('Senha', { exact: true }).fill('kurio123')
    await page.locator('form').getByRole('button', { name: 'Entrar', exact: true }).click()
    await expect(page).toHaveURL(/\/$/)

    await page.goto('/login')
    await page.getByPlaceholder('contato@email.com').fill('colecionador@kurio.local')
    await page.getByPlaceholder('Senha', { exact: true }).fill('senha-incorreta')
    await page.locator('form').getByRole('button', { name: 'Entrar', exact: true }).click()
    await expect(page.getByRole('status')).toHaveText('E-mail ou senha inválidos')
})

test('informa conflito ao cadastrar um e-mail existente', async ({ page }) => {
    await page.goto('/register')
    await page.getByPlaceholder('Nome de usuário').fill('novo-colecionador')
    await page.getByPlaceholder('Digite seu e-mail').fill('colecionador@kurio.local')
    await page.getByPlaceholder('Senha', { exact: true }).fill('senha-123')
    await page.getByPlaceholder('Confirmar senha').fill('senha-123')
    await page.getByRole('button', { name: 'Criar perfil' }).click()
    await expect(page.getByRole('status')).toHaveText('Este e-mail já está cadastrado')
})
