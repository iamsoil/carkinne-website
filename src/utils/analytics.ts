// src/utils/analytics.ts

declare global {
  interface Window {
    gtag: (...args: any[]) => void
  }
}

export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', eventName, params)
  }
}

// Car events
export const trackCarView = (carName: string, carId: string) => {
  trackEvent('car_view', { car_name: carName, car_id: carId })
}

export const trackEnquiry = (carName: string, carId: string) => {
  trackEvent('enquiry_submitted', { car_name: carName, car_id: carId })
}

export const trackCompareAdd = (carName: string) => {
  trackEvent('compare_add', { car_name: carName })
}

export const trackCompareView = () => {
  trackEvent('compare_view')
}

// Tools
export const trackEMICalculator = (carPrice: number) => {
  trackEvent('emi_calculated', { car_price: carPrice })
}

export const trackBudgetFinderComplete = (budget: number) => {
  trackEvent('budget_finder_complete', { budget })
}

// Blog
export const trackBlogRead = (title: string, category: string) => {
  trackEvent('blog_post_read', { blog_title: title, blog_category: category })
}

export const trackBlogShare = (platform: string, title: string) => {
  trackEvent('blog_share', { platform, blog_title: title })
}

// Offers
export const trackOfferClick = (offerTitle: string) => {
  trackEvent('offer_click', { offer_title: offerTitle })
}

// EV
export const trackEVChargingContribution = () => {
  trackEvent('ev_station_contributed')
}

// Showrooms
export const trackShowroomView = (showroomName: string) => {
  trackEvent('showroom_view', { showroom_name: showroomName })
}