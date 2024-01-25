import { RouterCtrl } from '../controllers/RouterCtrl'

export const CoreUtil = {
  WALLETCONNECT_DEEPLINK_CHOICE: 'WALLETCONNECT_DEEPLINK_CHOICE',

  WCM_VERSION: 'WCM_VERSION',

  RECOMMENDED_WALLET_AMOUNT: 9,

  isMobile() {
    if (typeof window !== 'undefined') {
      return Boolean(
        window.matchMedia('(pointer:coarse)').matches ||
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/u.test(navigator.userAgent)
      )
    }

    return false
  },

  isAndroid() {
    return false
  },

  isIos() {
    return false
  },

  isHttpUrl(url: string) {
    return url.startsWith('http://') || url.startsWith('https://')
  },

  isArray<T>(data?: T | T[]): data is T[] {
    return Array.isArray(data) && data.length > 0
  },

  formatUniversalUrl(appUrl: string, wcUri: string, name: string): string {
    let safeAppUrl = appUrl
    if (!safeAppUrl.endsWith('/')) {
      safeAppUrl = `${safeAppUrl}/`
    }
    this.setWalletConnectDeepLink(safeAppUrl, name)
    const encodedWcUrl = encodeURIComponent(wcUri)

    return `${safeAppUrl}wc?uri=${encodedWcUrl}`
  },

  async wait(miliseconds: number) {
    return new Promise(resolve => {
      setTimeout(resolve, miliseconds)
    })
  },

  openHref(href: string) {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openLink(href);
    } else if (Telegram?.WebApp) {
      Telegram.WebApp.openLink(href);
    } else {
      // Fallback or error handling
    }
  },

  setWalletConnectDeepLink(href: string, name: string) {
    try {
      localStorage.setItem(CoreUtil.WALLETCONNECT_DEEPLINK_CHOICE, JSON.stringify({ href, name }))
    } catch {
      console.info('Unable to set WalletConnect deep link')
    }
  },

  setWalletConnectAndroidDeepLink(wcUri: string) {
    try {
      const [href] = wcUri.split('?')
      localStorage.setItem(
        CoreUtil.WALLETCONNECT_DEEPLINK_CHOICE,
        JSON.stringify({ href, name: 'Android' })
      )
    } catch {
      console.info('Unable to set WalletConnect android deep link')
    }
  },

  removeWalletConnectDeepLink() {
    try {
      localStorage.removeItem(CoreUtil.WALLETCONNECT_DEEPLINK_CHOICE)
    } catch {
      console.info('Unable to remove WalletConnect deep link')
    }
  },

  setModalVersionInStorage() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(CoreUtil.WCM_VERSION, process.env.ROLLUP_WCM_VERSION ?? 'UNKNOWN')
      }
    } catch {
      console.info('Unable to set Web3Modal version in storage')
    }
  },

  getWalletRouterData() {
    const routerData = RouterCtrl.state.data?.Wallet
    if (!routerData) {
      throw new Error('Missing "Wallet" view data')
    }

    return routerData
  }
}
