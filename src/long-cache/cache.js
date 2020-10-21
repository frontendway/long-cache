const STRING = '[object String]'
const REGEXP = '[object RegExp]'

export const globalMap = new Map()

export const allowTypes = [String, RegExp, Array]

function isAsyncVnode (vnode) {
  return vnode.isComment && vnode.asyncFactory
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

export const fetchComponentName = opt => {
  return opt && (opt.Ctor.options.name || opt.tag)
}

function type (target) {
  return window.toString.call(target)
}

function match (rules, name) {
  return rules.some(rule => {
    return type(rule) === REGEXP ? rule.test(name) : rule === name
  })
}

export const isRefresh = (rules, name, beforeRouteName) => {
  if (!rules || !name || !beforeRouteName) return

  const rule = rules[name]
  if (
    rule && 
    (allow(rule.refresh, beforeRouteName) || !allow(rule.notRefresh, beforeRouteName))
  ) {
    return true
  }
}

export const allow = (rules, name) => {
  if (!rules || !name) return false

  const originType = type(rules)
  if (Array.isArray(rules)) {
    return match(rules, name)
  } else if (originType === STRING) {
    return rules.split(',').indexOf(name) > -1
  } else if (originType === REGEXP) {
    return rules.test(name)
  }
}

export const fetchRouteName = key => {
  if (key) return window.localStorage.getItem(key) || ''
}

export const splice = (list, key) => {
  if (Array.isArray(list)) {
    const idx = list.indexOf(key)
    if (idx !== -1) list.splice(idx, 1)
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

export const strategyWrap = (vm, filter) => {
  const { mapKey, _vnode } = vm
  const storage = globalMap.get(mapKey)
  const keys = storage.keys

  for (const key in storage) {
    if (key === 'keys') continue

    const cached = storage[key]
    if (cached) {
      const name = fetchComponentName(cached.componentOptions)
      if (name && !filter(name)) {
        removeInactivation(storage, keys[0], keys, _vnode)
      }
    }
  }
}
