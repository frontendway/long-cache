<script>
import {
  warn,
  allow,
  splice,
  allowTypes,
  fetchkey,
  strategy,
  globalMap,
  isRefresh,
  fetchTarget,
  strategyWrap,
  fetchRouteName,
  fetchFirstCVnode,
  fetchComponentName,
  removeInactivation,
  setPrevRouteName,
  getPrevRouteName
} from './index.js'

export default {
  name: 'long-cache',
  abstract: true,

  props: {
    rules: Object,
    mapKey: String,
    include: allowTypes,
    exclude: allowTypes,
    keepActive: Boolean,
    max: [String, Number]
  },

  watch: {
    $route (to, from) {
      setPrevRouteName(from.name)
    }
  },

  created () {
    this.validate()
    this.init()
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
        keepActive
      } = this
      const storage = globalMap.get(mapKey)
      const key = fetchkey(componentVnode, options)
      
      if (isRefresh(rules, name, getPrevRouteName())) {
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

  destroyed () {
    if (this.keepActive) return

    const storage = globalMap.get(this.mapKey)
    const keys = storage.keys
    delete storage.keys
    for (const key in storage) {
      removeInactivation(storage, key, keys)
    }
  },
  
  methods: {
    init () {
      const { 
        keepActive, 
        mapKey 
      } = this

      const storage = { keys: [] }
      if (keepActive) {
        if (!globalMap.has(mapKey)) {
          globalMap.set(mapKey, storage)
        }
      } else {
        globalMap.set(mapKey, storage)
      }
    },

    validate () {
      const { 
        rules,
        mapKey,
        $route
      } = this
      
      if (!mapKey) {
        warn('map-key is required')
      } else if (rules && !$route) {
        warn('vue-router not installed')
      }
    }
  }
}
</script>
