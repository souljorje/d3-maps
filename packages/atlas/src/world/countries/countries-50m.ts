import type { Topology } from '../../types.ts'
import data from './countries-50m.json' with { type: 'json' }

export default data as unknown as Topology
