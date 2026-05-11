import type { Topology } from 'topojson-specification'

import data from './cyprus-10m.json' with { type: 'json' }

const topology = data as unknown as Topology

export default topology
