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
  removeInactivation,
  setKey
} from './cache.js'

export default {
  name: 'long-cache',
  abstract: true,

  props: {
    include: allowTypes,
    exclude: allowTypes,
    max: [String, Number],
    keepActive: Boolean,
    from: [String, RegExp, Array],
    localKey: String,
    cacheKey: String
  },

  created () {
    this.normalize()
    this.init()
  },

  destroyed () {
    if (this.keepActive) return

    const { target: {cache}, keys } = this
    for (const key in this.target.cache) {
      removeInactivation(cache, key, keys)
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
        target, 
        localKey, 
        from, 
        max,
        keys,
        keepActive,
        _vnode,
        _cacheKey
      } = this
      const cache = target[_cacheKey] || (target[_cacheKey] = {})
      const key = fetchkey(componentVnode, options)
      
      if (allow(from, fetchUrl(localKey))) {
        cache[key] = null
        splice(keys, key)
      }

      const cached = cache[key]
      if (cached) {
        componentVnode.componentInstance = cached.componentInstance
        splice(keys, key)
        keys.push(key)

      } else {
        cache[key] = componentVnode
        keys.push(key)
        strategy(keys, max, cache, _vnode)
      }

      componentVnode.data.keepAlive = true
    }

    return componentVnode || (slots && slots[0])
  },
  
  methods: {
    init () {
      const { keepActive, _cacheKey } = this
      const target = this.target = fetchTarget(keepActive, this)
      const empty = Object.create(null)

      if (!keepActive) {
        target.cache = empty
        target.keys = []
      } else {
        target[_cacheKey] = empty
        target.[_keys] = []
      }
    },

    normalize () {
      const { keepActive, cacheKey } = this

      if (keepActive) {
        if (!cacheKey) {
          console.error('cacheKey is required')
        } else if (!keys) {
          console.error('keys is required')
        }
      } else {
        this._cacheKey = cacheKey || 'cache'
      }
    }
  }
}
</script>
