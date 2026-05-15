import type { Topology } from '../../types.ts'
import data from './lakes-110m.json' with { type: 'json' }

export default data as unknown as Topology
