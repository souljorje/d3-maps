import type { AtlasCountryTopology } from '../../types.ts'
import data from './haiti-50m.json' with { type: 'json' }

export default data as unknown as AtlasCountryTopology
