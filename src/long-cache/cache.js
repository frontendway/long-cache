let $id = 0

const STRING = '[object String]'
const REGEXP = '[object RegExp]'

function isAsyncVnode (vnode) {
  return vnode.isComment && vnode.asyncFactory
}

function type (target) {
  return window.toString.call(target)
}

export const fetchFirstCVnode = slots => {
  if (Array.isArray(slots)) {
    for (const slot of slots) {
      if (slot && (slot.componentOptions || isAsyncVnode(slot))) {
        return slot
      }
    }
  }
}

export const fetchkey = (componentVnode, opt) => {
  return componentVnode.key == null
  ? opt.Ctor.cid + (opt.tag ? `::${opt.tag}` : '')
  : componentVnode.key
}

export const allowTypes = [String, RegExp, Array]

export const fetchComponentName = opt => {
  return opt && (opt.Ctor.options.name || opt.tag)
}

function match (rules, name) {
  return rules.some(rule => {
    return type(rule) === REGEXP ? rule.test(name) : rule === name
  })
}

export const allow = (rules, name) => {
  if (Array.isArray(rules)) {
    return match(rules, name)
  } else if (type(rules) === STRING) {
    return rules.split(',').indexOf(name) > -1
  } else if (type(rules) === REGEXP) {
    return rules.test(name)
  }
}

export const fetchTarget = (keepActive, _this) => {
  return keepActive ? window : _this
}

export const fetchUrl = key => {
  if (!key) return
  return window.localStorage.getItem(key) || ''
}

export const splice = (list, key) => {
  if (!Array.isArray(list)) return

  for (let i=0; i<list.length; i++) {
    if (list[i] === key) {
      list.splice(i, 1)
    }
  }
}

export const removeInactivation = (
  cache,
  key,
  keys,
  current
) => {
  const cached = cache[key]
  if (cached && (!current || cached.tag !== current.tag)) {
    cached.componentInstance.$destroy()
  }
  cache[key] = null
  splice(keys, key)
}

export const strategy = (keys, max, cache, current) => {
  if (max && keys.length > Number.parseInt(max)) {
    removeInactivation(cache, keys[0], keys, current)
  }
}

export const strategyWrap = (instance, filter) => {
  const {target: {cache}, keys, _vnode} = instance
  for (const key in cache) {
    const cached = cache[key]
    if (cached) {
      const name = fetchComponentName(cached.componentOptions)
      if (name && !filter(name)) {
        removeInactivation(cache, keys[0], keys, _vnode)
      }
    }
  }
}

export const setKey = () => {
  return `$long-cache${++$id}`
}
