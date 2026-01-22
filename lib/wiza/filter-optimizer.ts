/**
 * Smart Wiza Filter Optimizer
 * Progressively removes less important filters until target prospect count is reached
 */

// Type for Wiza filters
export type WizaFilters = Record<string, unknown>

// Filter priority tiers (most important to least important)
export const FILTER_TIERS = {
    // Tier 1: Core ICP - NEVER REMOVE
    core: ['job_title', 'job_title_level'],
    
    // Tier 2: Company characteristics - Remove last
    company: ['company_size', 'revenue', 'company_industry'],
    
    // Tier 3: Growth signals - Remove third
    growth: ['funding_stage', 'funding_type', 'year_founded_start', 'year_founded_end'],
    
    // Tier 4: Additional context - Remove first
    context: ['location', 'skill', 'job_role', 'job_sub_role', 'company_type']
}

export interface OptimizationResult {
    filters: WizaFilters
    prospectCount: number
    removedFilters: string[]
    prospects?: unknown[]
    iterations: Array<{
        filters: string[]
        count: number
        removedFilter?: string
    }>
}

/**
 * Get all removable filters in priority order (least important first)
 */
export function getRemovableFiltersInOrder(currentFilters: WizaFilters): string[] {
    const removableFilters: string[] = []
    
    // Add filters in reverse priority order (remove least important first)
    for (const filter of FILTER_TIERS.context) {
        if (currentFilters[filter]) removableFilters.push(filter)
    }
    for (const filter of FILTER_TIERS.growth) {
        if (currentFilters[filter]) removableFilters.push(filter)
    }
    for (const filter of FILTER_TIERS.company) {
        if (currentFilters[filter]) removableFilters.push(filter)
    }
    
    return removableFilters
}

/**
 * Create a copy of filters without the specified field
 */
export function removeFilter(filters: WizaFilters, filterToRemove: string): WizaFilters {
    const newFilters = { ...filters }
    delete newFilters[filterToRemove]
    return newFilters
}

/**
 * Count active filters in the query
 */
export function countActiveFilters(filters: WizaFilters): number {
    return Object.keys(filters).filter(key => 
        filters[key] !== undefined && 
        filters[key] !== null &&
        filters[key] !== '' &&
        (Array.isArray(filters[key]) ? filters[key].length > 0 : true)
    ).length
}

/**
 * Get human-readable filter names for logging
 */
export function getFilterNames(filters: WizaFilters): string[] {
    return Object.keys(filters).filter(key => filters[key])
}

/**
 * Progressive filter optimization strategy
 * Returns the order in which to try removing filters
 */
export function getOptimizationStrategy(initialFilters: WizaFilters): string[][] {
    const strategy: string[][] = []
    const removableFilters = getRemovableFiltersInOrder(initialFilters)
    
    // Try removing filters one at a time, starting with least important
    for (let i = 0; i < removableFilters.length; i++) {
        strategy.push(removableFilters.slice(0, i + 1))
    }
    
    return strategy
}

/**
 * Format filters for display/logging
 */
export function formatFiltersForDisplay(filters: WizaFilters): string {
    const filtersList = getFilterNames(filters)
    return filtersList.join(', ') || 'none'
}
