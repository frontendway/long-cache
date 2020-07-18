<script>
import {
  allowTypes,
  allow,
  fetchFirstCVnode,
  fetchkey,
  strategy,
  fetchComponentName,
  fetchAfterLink,
  splice,
  fetchTarget,
  strategyWrap,
  removeInactivation
} from './cache.js'

export default {
  name: 'keep',
  abstract: true,

  props: {
    include: allowTypes,
    exclude: allowTypes,
    max: [String, Number],
    longCache: Boolean,
    backUrl: String,
    localKey: String
  },

  created () {
    const target = this.target = fetchTarget(this.longCache, this)
    const empty = Object.create(null)

    if (!this.longCache) {
      target.cache = empty
    } else {
      target.cache || (target.cache = empty)
    }

    this.keys = []
  },

  destroyed () {
    if (this.longCache) return

    const { target: {cache}, keys } = this
    for (const key in this.target.cache) {
      removeInactivation(cache, key, keys)
    }
  },

  mounted () {
    if (this.include) {
      this.$watch('include', value => {
        strategyWrap(this, name => allow(val, name))
      })
    }

    if (this.exclude) {
      this.$watch('exclude', value => {
        strategyWrap(this, name => !allow(val, name))
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
        backUrl, 
        max,
        keys,
        _vnode
      } = this
      const cache = target.cache || (target.cache = {})
      const key = fetchkey(componentVnode, options)

      if (fetchAfterLink(localKey) === backUrl) cache[key] = null

      const cached = cache[key]
      if (cached) {
        componentVnode.componentInstance = cached.componentInstance
        splice(this.keys, key)
        keys.push(key)

      } else {
        cache[key] = componentVnode
        keys.push(key)
        strategy(keys, max, cache, _vnode)
      }

      componentVnode.data.keepAlive = true
    }

    return componentVnode || (slots && slots[0])
  }
}
</script>
