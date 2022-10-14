import * as topojson from 'topojson-client'
import china from '@/assets/data/china.topo.json'
console.log(`🚀 ~ file: main.js ~ line 3 ~ china`, china)

console.log(topojson.feature(china, china.objects.default))
console.log(topojson.mesh(china))
