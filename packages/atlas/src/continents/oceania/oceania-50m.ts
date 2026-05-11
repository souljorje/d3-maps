import type { Topology } from 'topojson-specification'

import data from './oceania-50m.json' with { type: 'json' }

const topology = data as unknown as Topology

export default topology
