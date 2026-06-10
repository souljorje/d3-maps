import type { AtlasWorldCountriesTopology } from '../../types.ts'
import data from './countries-110m.json' with { type: 'json' }

export default data as unknown as AtlasWorldCountriesTopology
