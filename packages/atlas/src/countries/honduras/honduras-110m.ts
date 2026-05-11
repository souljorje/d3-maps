import type { Topology } from 'topojson-specification'
import data from './honduras-110m.json' with { type: 'json' }

const topology = data as unknown as Topology

export default topology
