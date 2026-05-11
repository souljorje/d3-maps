import type { Topology } from 'topojson-specification'
import data from './bhutan-110m.json' with { type: 'json' }

const topology = data as unknown as Topology

export default topology
