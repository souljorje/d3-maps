import type { Topology } from 'topojson-specification'
import data from './mexico-50m.json' with { type: 'json' }

const topology = data as unknown as Topology

export default topology
