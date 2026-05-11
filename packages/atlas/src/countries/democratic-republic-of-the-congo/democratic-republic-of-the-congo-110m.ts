import type { Topology } from 'topojson-specification'
import data from './democratic-republic-of-the-congo-110m.json' with { type: 'json' }

const topology = data as unknown as Topology

export default topology
