import type { CountryMetadata } from '../types.ts'
import data from './countries.json' with { type: 'json' }

export default data as CountryMetadata[]
