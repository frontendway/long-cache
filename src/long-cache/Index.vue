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
  name: 'keep',
  abstract: true,

  props: {
    include: allowTypes,
    exclude: allowTypes,
    max: [String, Number],
    keepLong: Boolean,
    from: [String, RegExp, Array],
    localKey: String,
    cacheKey: String
  },

  created () {
    this.normalize()
    this.init()
  },

  destroyed () {
    if (this.keepLong) return

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
        _vnode,
        _cacheKey
      } = this
      const cache = target[_cacheKey] || (target[_cacheKey] = {})
      const key = fetchkey(componentVnode, options)

      if (allow(from, fetchUrl(localKey))) {
        cache[key] = null
        componentVnode.key = setKey(options)
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
      const { keepLong } = this
      const target = this.target = fetchTarget(keepLong, this)
      const empty = Object.create(null)

      if (!keepLong) {
        target.cache = empty
      } else {
        target.cache || (target.cache = empty)
      }

      this.keys = []
    },

    normalize () {
      const { keepLong, cacheKey } = this
      if (keepLong && !cacheKey) {
        console.error('cacheKey is required')
      } else {
        this._cacheKey = cacheKey || 'cache'
      }
    }
  }
}
</script>
