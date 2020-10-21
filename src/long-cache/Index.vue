<script>
import {
  allowTypes,
  allow,
  fetchFirstCVnode,
  fetchkey,
  strategy,
  fetchComponentName,
  fetchRouteName,
  splice,
  isRefresh,
  globalMap,
  fetchTarget,
  strategyWrap,
  setPrevComponent,
  getPrevComponent,
  removeInactivation
} from './cache.js'

export default {
  name: 'long-cache',
  abstract: true,

  props: {
    rules: Object,
    mapKey: String,
    include: allowTypes,
    exclude: allowTypes,
    keepActive: Boolean,
    max: [String, Number],
    routeName: String
  },

  created () {
    this.checkProps()
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
        rules, 
        _vnode,
        mapKey,
        routeName, 
        keepActive
      } = this
      const storage = globalMap.get(mapKey)
      const key = fetchkey(componentVnode, options)

      if (isRefresh(rules, name, fetchRouteName(routeName))) {
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

    checkProps () {
      const { 
        mapKey,
        routeName,
        rules
      } = this

      if (!mapKey) {
        console.error('map-key is required')
      } else if (rules && !routeName) {
        console.error('path-key is required')
      }
    }
  }
}
</script>
