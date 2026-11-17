import {
  createResource,
  deleteResource,
  listResource,
  updateResource,
} from './adminService.js'

export const listPromotions = () => listResource('promotions')
export const createPromotion = (payload) =>
  createResource('promotions', { status: 'active', type: 'percentage', ...payload })
export const updatePromotion = (id, payload) => updateResource('promotions', id, payload)
export const deletePromotion = (id) => deleteResource('promotions', id)
