import type { AtlasCountryTopology } from '../../types.ts'
import data from './europe-10m.json' with { type: 'json' }

export default data as unknown as AtlasCountryTopology
