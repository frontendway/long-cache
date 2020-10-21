<script>
import {
  allowTypes,
  allow,
  fetchFirstCVnode,
  fetchkey,
  strategy,
  fetchComponentName,
  fetchUrl,
  splice,
  fetchTarget,
  strategyWrap,
  globalMap,
  setPrevComponent,
  getPrevComponent,
  removeInactivation
} from './cache.js'

export default {
  name: 'long-cache',
  abstract: true,

  props: {
    include: allowTypes,
    exclude: allowTypes,
    max: [String, Number],
    keepActive: Boolean,
    freshRoutes: [String, RegExp, Array],
    nameKey: String,
    mapKey: String
  },

  created () {
    this.normalize()
    this.init()
  },

  destroyed () {
    if (this.keepActive) return

    const storage = globalMap.get(this.mapKey)
    const keys = storage.keys
    delete storage.keys
    for (const key in storage) {
      removeInactivation(storage, key, keys)
    }
  },

  mounted () {
    if (this.include) {
      this.$watch('include', value => {
        strategyWrap(this, name => allow(value, name))
      })
    }

    if (this.exclude) {
      this.$watch('exclude', value => {
        strategyWrap(this, name => !allow(value, name))
      })
    }
  },

  render () {
    // debugger
    const slots = this.$slots.default
    const componentVnode = fetchFirstCVnode(slots)
    const options = componentVnode && componentVnode.componentOptions

    if (options) {
      const name = fetchComponentName(options)
      const { include, exclude } = this

      if (
        (include && (!name || !allow(include, name))) ||
        (exclude && name && allow(exclude, name))
      ) {
        return componentVnode
      }

      const {
        max,
        _vnode,
        mapKey,
        nameKey, 
        keepActive,
        freshRoutes 
      } = this
      const storage = globalMap.get(mapKey)
      const key = fetchkey(componentVnode, options)

      if (allow(freshRoutes, fetchUrl(nameKey))) {
        storage[key] = null
        splice(storage.keys, key)
      }

      const component = storage[key]
      const keys = storage.keys
      if (component) {
        componentVnode.componentInstance = component.componentInstance
        splice(keys, key)
        keys.push(key)

      } else {
        storage[key] = componentVnode
        keys.push(key)
        strategy(keys, max, storage, _vnode)
      }

      componentVnode.data.keepAlive = true
    }

    return componentVnode || (slots && slots[0])
  },
  
  methods: {
    init () {
      // debugger
      const { keepActive, mapKey } = this

      const storage = { keys: [] }
      if (keepActive) {
        if (!globalMap.has(mapKey)) {
          globalMap.set(mapKey, storage)
        }
      } else {
        globalMap.set(mapKey, storage)
      }
    },

    normalize () {
      const { 
        mapKey,
        nameKey,
        freshRoutes
      } = this

      if (!mapKey) {
        console.error('map-key is required')
      } else if (freshRoutes && !nameKey) {
        console.error('path-key is required')
      }
    }
  }
}
</script>
