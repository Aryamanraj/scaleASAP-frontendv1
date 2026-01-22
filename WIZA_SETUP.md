# Wiza Filter Optimization Setup

## Overview
The filter optimization system progressively reduces Wiza API filters to find an acceptable number of prospects (target: 200+, minimum: 50).

## How It Works

### Filter Priority Tiers
Filters are removed in order of importance (least to most):

1. **Context Filters** (removed first)
   - `location`
   - `skill`
   - `job_role`
   - `job_sub_role`
   - `company_type`

2. **Growth Signals** (removed second)
   - `funding_stage`
   - `funding_type`
   - `year_founded_start`
   - `year_founded_end`

3. **Company Characteristics** (removed third)
   - `company_size`
   - `revenue`
   - `company_industry`

4. **Core ICP** (NEVER removed)
   - `job_title`
   - `job_title_level`

### Optimization Process
1. Generate initial filters with AI (GPT-4o)
2. Test filters with Wiza API using `SimpleProspectClient`
3. If prospect count < 50:
   - Remove least important filter
   - Test again
   - Repeat until reaching 50+ prospects
4. Return optimized filters + metadata

## Setup Instructions

### 1. Environment Variables
Add to your `.env` file:

```bash
WIZA_EMAIL=your-wiza-email@example.com
WIZA_PASSWORD=your-wiza-password
```

### 2. Verify Files
Ensure these files exist:
- `linkedin-scraper/simple.cjs` - Wiza client (✓ exists)
- `data/` directory - Will store session file
- `data/wiza-session.json` - Auto-created on first run

### 3. Test the Integration

```bash
# Start the dev server
npm run dev

# Navigate to an experiment in the dashboard
# Click the refresh button (🔄) next to "Sourcing Filters (Wiza)"
```

## API Endpoint

### POST `/api/filters/regenerate`

**Request:**
```json
{
  "experiment": {
    "name": "Experiment name",
    "pattern": "Growth pattern",
    "pain": "Pain point",
    "trigger": "Trigger",
    "outreach_angle": "Angle"
  },
  "optimize": true  // Enable optimization (default: true)
}
```

**Response:**
```json
{
  "wiza_filters": {
    "job_title": [{"v": "CEO", "s": "i"}],
    "job_title_level": ["CXO", "VP"],
    "company_size": ["11-50", "51-200"]
  },
  "optimization": {
    "prospectCount": 234,
    "removedFilters": ["location", "skill"],
    "iterations": [
      {"filters": [...], "count": 0},
      {"filters": [...], "count": 45, "removedFilter": "location"},
      {"filters": [...], "count": 234, "removedFilter": "skill"}
    ],
    "targetCount": 200,
    "minAcceptableCount": 50
  }
}
```

## Files Modified

- **`/app/api/filters/regenerate/route.ts`** - API endpoint with optimization logic
- **`/lib/wiza/filter-optimizer.ts`** - Filter tier system and helper functions
- **`/components/dashboard/ExperimentDetailCurtain.tsx`** - UI with refresh button
- **`/lib/prompts/discovery/output.md`** - Wiza API format specification

## Testing Configuration

```typescript
const TARGET_PROSPECT_COUNT = 200  // Ideal number
const MIN_ACCEPTABLE_COUNT = 50    // Minimum acceptable
const MAX_PAGES_PER_TEST = 3       // Pages to test (for speed)
```

Adjust these constants in `/app/api/filters/regenerate/route.ts` if needed.

## Troubleshooting

### "Wiza client not available"
- Verify `linkedin-scraper/simple.cjs` exists
- Check file permissions

### "Optimization failed"
- Verify WIZA_EMAIL and WIZA_PASSWORD in `.env`
- Check Wiza API credentials are valid
- Review server logs for detailed errors

### Filters still too strict
- Lower `MIN_ACCEPTABLE_COUNT` (currently 50)
- Add more filter tiers to remove
- Review AI prompt in `/lib/prompts/discovery/output.md`

## Console Output Example

```
Starting filter optimization...
Initial filters: job_title, company_size, location, skill
Initial count: 0

Trying without: location
Count without location: 12

Trying without: skill  
Count without skill: 87
✓ Found acceptable count: 87
```

## Next Steps

1. Add WIZA_EMAIL and WIZA_PASSWORD to `.env`
2. Test with an existing experiment
3. Review optimization results in browser console
4. Adjust target counts if needed
