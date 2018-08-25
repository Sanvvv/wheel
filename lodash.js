var sanvvv = {
  isFloat: num => num % 1 !== 0,

  init2Param: (first, second, i_f, i_s) => {
    if (second === undefined) {
      if (first === undefined) second = i_s
      else second = first
      first = i_f
    }
    return [first, second]
  },

  getRandom: (lower = 0, upper = 1) => {
    return Math.random() * (upper - lower) + lower
  },

  chunk: function (array, size = 1) {
    var res = []
     
    for (var i = 0; i < array.length; i += size) {
      res.push(array.slice(i, i + size))
    }
    return res
  },

  compact: function (array) {
    return array.filter(element => element)
  },

  concat: function (array, ...values) {
    var res = []

    for (var item of array) {
      res.push(item)
    }
    for (var item of values) {
      if (Array.isArray(item)) res.push(...item)
      else res.push(item)
    }

    return res
  },

  difference: function (array, ...values) {
    return values.reduce((acc, cur) => acc.filter(item => cur.indexOf(item) === -1), array)
  },

  differenceBy: function (array, ...values) {
    var f = sanvvv.identity
    if (typeof values[values.length - 1] !== 'object') f = sanvvv.iteratee(values.pop())
    var differBy = values.reduce((acc, arr) => {
      acc.push(arr.map(x => f(x)))
      return acc
    }, [])
    return array.filter(item => !differBy.some(arr => arr.includes(f(item))))
  },

  differenceWith: function (array, values, comparator) {
    return array.filter(arr => values.every(value => !comparator(arr, value)))
  },

  drop: function (array, n = 1) {
    return n < 0 ? array.slice(0) : array.slice(n)
  },

  dropRight: function (array, n = 1) {
    if (n >= array.length) return []
    else return array.slice(0, array.length - n)
  },

  dropRightWhile: function (array, predicate = sanvvv.identity) {
    var f = sanvvv.iteratee(predicate)
    var index = -1

    for (var i = array.length - 1; i >= 0; i--) {
      if (!f(array[i])) {
        index = i
        break
      }
    }

    return array.slice(0, index + 1)
  },

  dropWhile: function (array, predicate = sanvvv.identity) {
    var f = sanvvv.iteratee(predicate)
    var index = -1

    for (var i = 0; i < array.length; i++) {
      if (!f(array[i])) {
        index = i
        break
      }
    }

    return array.slice(index, array.length)
  },

  fill: function (array, value, start = 0, end = array.length) {
    for (var i = start; i < end; i++) {
      array[i] = value
    }
    return array
  },

  flatten: function (array) {
    return [].concat(...array)
  },

  findIndex: function (array, predicate = sanvvv.identity, fromIndex = 0) {
    var f = sanvvv.iteratee(predicate)
    return sanvvv.indexOf(array.map(x => f(x)), true, fromIndex)
  },

  findLastIndex: function (array, predicate = sanvvv.identity, fromIndex = array.length - 1) {
    var f = sanvvv.iteratee(predicate)
    return sanvvv.lastIndexOf(array.map(x => f(x)), true, fromIndex)
  },

  flattenDeep: function (array) {
    var res = []

    iterateAndPush(array)
    return res

    function iterateAndPush (arr) {
      arr.forEach(item => {
        if (Array.isArray(item)) iterateAndPush(item)
        else res.push(item)
      })
    }
  },

  flattenDepth: function (array, depth = 1) {
    var res = []

    iterateAndPush(array, 0)
    return res

    function iterateAndPush (arr, deep) {
      arr.forEach(item => {
        if (Array.isArray(item) && deep < depth) iterateAndPush(item, deep + 1)
        else res.push(item)
      })
    }
  },

  fromPairs: function (pairs) {
    var res = {}

    pairs.forEach(item => res[item[0]] = item[1])
    return res
  },

  head: function (array) {
    return array[0]
  },

  indexOf: function (array, value, fromIndex = 0) {
    if (fromIndex < 0) fromIndex += array.length
    for (var i = fromIndex; i < array.length; i++) {
      if (value !== value && array[i] !== array[i]) return i
      else if (array[i] === value) return i
    }
    return -1
  },

  initial: function (array) {
    return array.slice(0, array.length - 1)
  },

  intersection: function (...arrays) {
    return arrays.reduce((acc, cur) => acc.filter(item => cur.indexOf(item) !== -1))
  },

  intersectionBy: function (...rest) {
    var iteratee = sanvvv.identity
    // isArray
    if (Object.prototype.toString.call(rest[rest.length - 1]) !== '[object Array]') {
      iteratee = rest.pop()
    }
    var f = sanvvv.iteratee(iteratee)
    
    return rest.reduce((acc, cur) => acc.filter(item => cur.map(x => f(x)).indexOf(f(item)) !== -1))
  },

  intersectionWith: function (...rest) {
    var comparator = rest.pop()
    return rest.reduce((acc, cur) => acc.filter(item => cur.some(el => comparator(item, el))))
  },

  join: function (array, seperator = ',') {
    return array.reduce((acc, cur) => '' + acc + seperator + cur)
  },

  last: function (array) {
    return array[array.length - 1]
  },

  lastIndexOf: function (array, value, fromIndex = array.length - 1) {
    if (fromIndex < 0) fromIndex += array.length
    for (var i = fromIndex; i >= 0; i--) {
      if (value !== value && array[i] !== array[i]) return i
      else if (array[i] === value) return i
    }
    return -1
  },

  nth: function (array, n = 0) {
    return n >= 0 ? array[n] : array[array.length + n]
  },

  pull: function (array, ...values) {
    return sanvvv.pullAllBy(array, values)
  },

  pullAll: function (array, values) {
    return sanvvv.pullAllBy(array, values)
  },

  pullAllBy: (array, values, iteratee = sanvvv.identity) => {
    iteratee = sanvvv.iteratee(iteratee)
    return values.reduce((acc, cur) => acc.filter(item => iteratee(item) !== iteratee(cur)), array)
  },

  pullAllWith: (array, values, comparator) => {
    return values.reduce((acc, cur) => acc.filter(item => !comparator(item, cur)), array)
  },

  pullAt: function (array, indexes) {
    var res = []
    var slow = 0
    var index = 0

    indexes.sort((a, b) => a - b)

    for (var i = 0; i < array.length; i++) {
      if (i === indexes[index]) {
        res.push(array[i])
        index++
      } else {
        array[slow] = array[i]
        slow++
      }
    }

    array.splice(slow, array.length)
    return res
  },

  reverse: function (array) {
    var len = array.length - 1

    for (var i = 0; i < len / 2; i++) {
      [array[i], array[len - i]] = [array[len - i], array[i]]
    }
    return array
  },

  slice: function (array, start = 0, end = array.length) {
    if (start < 0) start += array.length
    if (end < 0) end += array.length
    return array.filter((item, index) => index >= start && index < end)
  },

  sortedIndex: function (array, value) {
    return sanvvv.sortedIndexBy(array, value)
  },

  sortedIndexBy: (array, value, iteratee = sanvvv.identity) => {
    iteratee = sanvvv.iteratee(iteratee)
    array = array.map(item => iteratee(item))
    value = iteratee(value)
    var left = 0
    var right = array.length
    var mid = Math.floor((left + right) / 2)

    while (right - left > 1) {
      if (array[mid] >= value) right = mid
      else left = mid
      mid = Math.floor((left + right) / 2)
    }

    if (array[mid] < value) mid++
    return mid 
  },

  sortedIndexOf: function (array, value) {
    var left = 0
    var right = array.length
    var mid = Math.floor((left + right) / 2)

    while (right - left > 1) {
      if (array[mid] >= value) right = mid
      else left = mid
      mid = Math.floor((left + right) / 2)
    }

    if (array[mid] < value) mid++
    if (array[mid] !== value) return -1
    else return mid
  },

  sortedLastIndex: function (array, value) {
    return sanvvv.sortedLastIndexBy(array, value)
  },

  sortedLastIndexBy: (array, value, iteratee = sanvvv.identity) => {
    iteratee = sanvvv.iteratee(iteratee)
    array = array.map(item => iteratee(item))
    value = iteratee(value)
    var left = 0
    var right = array.length
    var mid = Math.floor((left + right) / 2)

    while (right - left > 1) {
      if (array[mid] <= value) left = mid
      else right = mid
      mid = Math.floor((left + right) / 2)
    }

    if (array[mid] <= value) mid++
    return mid
  },

  sortedLastIndexOf: function (array, value) {
    var left = 0
    var right = array.length
    var mid = Math.floor((left + right) / 2)

    while (right - left > 1) {
      if (array[mid] <= value) left = mid
      else right = mid
      mid = Math.floor((left + right) / 2)
    }

    if (array[mid] < value) mid++
    if (array[mid] !== value) return -1
    else return mid
  },

  sortedUniq: function (array) {
    return sanvvv.sortedUniqBy(array)
  },

  sortedUniqBy: (array, iteratee = sanvvv.identity) => {
    return array.filter((item, index) => iteratee(item) !== iteratee(array[index - 1]))
  },

  uniq: function (array) {
    return [...new Set(array)]
  },

  uniqBy: function (array, iteratee = sanvvv.identity) {
    var f = sanvvv.iteratee(iteratee)
    var set = new Set()

    return array.filter(item => {
      var el = f(item)
      if (!set.has(el)) {
        set.add(el)
        return true
      } else return false
    })
  },

  uniqWith: (array, comparator) => {
    return array.reduce((acc, cur) => { 
      for (var obj of acc) {
        if (comparator(obj, cur)) return acc
      }
      acc.push(cur)
      return acc
    }, [])
  },

  tail: function (array) {
    return array.slice(1, array.length)
  },

  take: function (array, n = 1) {
    return array.slice(0, n)
  },

  takeRight: function (array, n = 1) {
    if (n > array.length) n = array.length
    return array.slice(array.length - n, array.length)
  },

  takeRightWhile: (array, predicate = sanvvv.identity) => {
    predicate = sanvvv.iteratee(predicate)
    for (var i = array.length - 1; i >= 0; i--) {
      if (!predicate(array[i])) return sanvvv.takeRight(array, array.length - 1 - i)
    }
    return []
  },

  takeWhile: (array, predicate = sanvvv.identity) => {
    predicate = sanvvv.iteratee(predicate)
    for (var i = 0; i < array.length; i++) {
      if (!predicate(array[i])) return sanvvv.take(array, i)
    }
    return []
  },

  union: function (...arrays) {
    return sanvvv.uniq(arrays.reduce((acc, cur) => {
      acc.push(...cur)
      return acc
    }, []))
  },

  unionBy: (...arrays) => {
    var iteratee = arrays.pop()
    return sanvvv.uniqBy([].concat(...arrays), iteratee)
  },

  unionWith: (...arrays) => {
    var comparator = arrays.pop()
    return sanvvv.uniqWith([].concat(...arrays), comparator)
  },

  without: function (array, ...values) {
    return array.filter(item => values.indexOf(item) === -1)
  },

  
  xor: function (...arrays) {
    // TODO: map
    var arr = [].concat(...arrays)
    return arr.filter(item => arr.indexOf(item) === arr.lastIndexOf(item))
  },

  xorBy: (...arrays) => {
    var iteratee = sanvvv.identity
    if (!sanvvv.isArray(arrays[arrays.length - 1])) iteratee = sanvvv.iteratee(arrays.pop())
    var arr = [].concat(...arrays)
    var map = arr.reduce((acc, cur) => {
      var val = iteratee(cur)
      if (!acc[val]) acc[val] = 1
      else acc[val]++
      return acc
    }, {})
    return arr.filter(item => map[iteratee(item)] <= 1)
  },

  xorWith: (...arrays) => {
    // !!! O(N2)
    var comparator = arrays.pop()
    var arr = [].concat(...arrays)
    var res = []
    for (var i = 0; i < arr.length; i++) {
      var tag = false
      for (var j = 0; j < arr.length; j++) {
        if (i !== j && comparator(arr[i], arr[j])) tag = true
      }
      if (!tag) res.push(arr[i])
    }
    return res
  },

  zip: function (...arrays) {
    // TODO: reduce
    var res = []

    arrays.forEach(array => {
      var count = 0
      array.forEach(item => {
        if (!res[count]) {
          res[count] = [item]
          count++
        } else {
          res[count].push(item)
          count++
        }
      })
    })

    return res
  },

  zipWith: (...arrays) => {
    var iteratee = sanvvv.identity
    if (typeof arrays[arrays.length - 1] === 'function') iteratee = arrays.pop()
    return sanvvv.zip(...arrays).reduce((acc, cur) => (acc.push(iteratee(...cur)), acc), [])
  },

  unzip: function (array) {
    return sanvvv.zip(...array)
  },

  unzipWith: (arrays, iteratee = sanvvv.identity) => {
    arrays.push(iteratee)
    return sanvvv.zipWith(...arrays)
  },

  zipObject: function (props = [], values = []) {
    var res = {}

    props.forEach((item, index) => res[item] = values[index])
    return res
  },

  zipObjectDeep: function (props = [], values = []) {
    var res = {}

    props.forEach((item, index) => {
      var paths = item.split('.')
      helper(paths, 0, res, values[index])
    })
    return res

    function helper (paths, index, obj, val) {
      var path = paths[index]

      // 终止条件
      if (index === paths.length - 1) return obj[path] = val

      // 处理数组/对象情况
      if (path.indexOf('[') !== -1) {
        var left = path.indexOf('[')
        var right = path.indexOf(']')
        var i = path.slice(right - 1, right)
        path = path.slice(0, left)

        if (!obj[path]) obj[path] = []
        obj[path][i] = {}
        return helper(paths, index + 1, obj[path][i], val)
      } else {
        if (!obj[path]) obj[path] = {}
        return helper(paths, index + 1, obj[path], val)
      }
    }
  },

  countBy: function (collection, iteratee = sanvvv.identity) {
    var f = sanvvv.iteratee(iteratee)
    return collection.reduce((acc, cur) => {
      var val = f(cur)
      if (!acc[val]) acc[val] = 1
      else acc[val]++ 
      return acc
    }, {})
  },

  every: function (collection, predicate = sanvvv.identity) {
    var f = sanvvv.iteratee(predicate)
    for (var item of collection) {
      if (!f(item)) return false
    }
    return true
  },

  filter: function (collection, predicate = sanvvv.identity) {
    var f = sanvvv.iteratee(predicate)
    return collection.reduce((acc, cur) => {
      if (f(cur)) acc.push(cur)
      return acc
    }, [])
  },

  find: function (collection, predicate = sanvvv.identity, fromIndex = 0) {
    var f = sanvvv.iteratee(predicate)
    for (var item of collection) {
      if (f(item)) return item
    }
    return undefined
  },

  findLast: (collection, predicate = sanvvv.identity, fromIndex = collection.length - 1) => {
    predicate = sanvvv.iteratee(predicate)
    for (var i = collection.length; i >= 0; i--) {
      if (predicate(collection[i])) return collection[i]
    }
    return undefined
  },

  flatMap: function (collection, iteratee = sanvvv.identity) {
    var f = sanvvv.iteratee(iteratee)
    return sanvvv.flatten(collection.map(x => f(x)))
  },

  flatMapDeep: (collection, iteratee = sanvvv.identity) => {
    var f = sanvvv.iteratee(iteratee)
    return sanvvv.flattenDeep(collection.map(x => f(x)))
  },

  flatMapDepth: function (collection, iteratee = sanvvv.identity, depth = 1) {
    var f = sanvvv.iteratee(iteratee)
    return sanvvv.flattenDepth(collection.map(x => f(x)), depth)
  },

  forEach: function (collection, iteratee = sanvvv.identity) {
    for (var [key, value] of Object.entries(collection)) {
      iteratee(value, key, collection)
    }
    return collection
  },

  forEachRight: (collection, iteratee = sanvvv.identity) => {
    var co = Object.entries(collection)
    for (var i = co.length - 1; i >= 0; i--) {
      iteratee(co[i][1], co[i][0], collection)
    }
    return collection
  },

  groupBy: function (collection, iteratee = sanvvv.identity) {
    var f = sanvvv.iteratee(iteratee)
    return collection.reduce((acc, cur) => {
      var val = f(cur)
      if (!acc[val]) acc[val] = [cur]
      else acc[val].push(cur)
      return acc
    }, {})
  },

  includes: (collection, value, fromIndex = 0) => {
    if (typeof collection === 'object') collection = Object.values(collection)
    return collection.slice(fromIndex, collection.length).includes(value)
  },

  invokeMap: (collection, path, ...args) => {
    if (typeof path === 'string') path = collection[0][path]
    return collection.map(arr => path.apply(arr, args))
  },

  keyBy: function (collection, iteratee = sanvvv.identity) {
    var f = sanvvv.iteratee(iteratee)
    return collection.reduce((acc, cur) => {
      acc[f(cur)] = cur
      return acc
    }, {})
  },

  map: function (collection, iteratee = sanvvv.identity) {
    var f = sanvvv.iteratee(iteratee)
    return Object.values(collection).reduce((acc, cur, index, array) => {
      acc.push(f(cur, index, array))
      return acc
    }, [])
  },

  /**
   * @param  {Array|Object} collection
   * @param  {Array[]|Function[]|Object{}|string[]} [iteratee=sanvvv.identity]
   * @param  {string[]} orders
   * @return {Array} Returns the new sorted array
   */
  orderBy: (collection, iteratees = sanvvv.identity, orders) => {
    var iters = iteratees.map(x => sanvvv.iteratee(x))
    var co = collection.slice(0)

    for (var i = iters.length - 1; i >= 0; i--) {
      co = collection.sort((a, b) => {
        a = '' + iters[i](a)
        b = '' + iters[i](b)
        if (orders[i] === 'asc') return a.localeCompare(b)
        else return b.localeCompare(a)
      })
    }

    return co
  },

  partition: function (collection, predicate = sanvvv.identity) {
    var f = sanvvv.iteratee(predicate)
    return collection.reduce((acc, cur) => {
      if (f(cur)) acc[0].push(cur)
      else acc[1].push(cur)
      return acc
    }, [[],[]])
  },

  reduce: function (collection, iteratee, accumulator) {
    iteratee = iteratee || sanvvv.identity
    collection = Object.entries(collection)
    acc = collection[0][1]
    var f = sanvvv.iteratee(iteratee)
    var i = 1

    if (accumulator !== undefined) {
      acc = accumulator
      i = 0
    }

    for (; i < collection.length; i++) {
      acc = f(acc, collection[i][1], collection[i][0])
    }

    return acc
  },

  reduceRight: function (collection, iteratee, accumulator) {
    iteratee = iteratee || sanvvv.identity
    collection = Object.entries(collection)
    var len = collection.length
    var f = sanvvv.iteratee(iteratee)
    var end = 1

    if (accumulator !== undefined) {
      acc = accumulator
      end = 0
    } else acc = collection[len - 1]

    for (var i = len - 1; i >= end; i--) {
      acc = f(acc, collection[i][1], collection[i][0])
    }

    return acc
  },
  
  /**
   * @param  {Array|Object} collection
   * @param  {Function} [predicate=sanvvv.identity]
   * @return {Array} returns new array
   */
  reject: function (collection, predicate = sanvvv.identity) {
    var f = sanvvv.iteratee(predicate)
    return collection.reduce((acc, cur) => {
      if (!f(cur)) acc.push(cur)
      return acc
    }, [])
  },

  /**
   * @param  {Array|Object} collection
   * @return {*}
   */
  sample: function (collection) {
    var co = Object.entries(collection)
    var samp = co[~~(Math.random() * co.length)]
    if (sanvvv.isArray(collection)) return samp[1]
    else return {[samp[0]]: samp[1]}
  },

  /**
   * @param  {Array|Object} collection
   * @param  {number} [n=1]
   * @return {Array}
   */
  sampleSize: (collection, n = 1) => {
    n = n > collection.length ? collection.length : n
    var co = Object.entries(collection)
    var res = []

    for (var i = 0; i < n; i++) {
      var samp = co[~~(Math.random() * co.length)]
      if (sanvvv.isArray(collection)) res.push(samp[1])
      else res.push({[samp[0]]: samp[1]})
    }

    return res
  },

  /**
   * @param  {Array|Object} collection
   * @return {Array} returns new array
   */
  shuffle: function (collection) {
    // TODO: param Object
    var res = collection.slice(0)
    var len = collection.length

    for (var i = 0; i < res.length; i++) {
      var rdIndex = ~~(Math.random() * (len - i) + i)
      var temp = res[i]
      res[rdIndex] = temp
      res[i] = res[rdIndex]
    }

    return res
  },
  
  /**
   * @param  {Array|Object|string} collection array-like values
   * @return {number} the collection size
   */
  size: function (collection) {
    return Object.keys(collection).length
  },

  /**
   * @param  {Array|Object} collection
   * @param  {Function} [predicate=sanvvv.identity]
   * @return {boolean}
   */
  some: function (collection, predicate = sanvvv.identity) {
    var f = sanvvv.iteratee(predicate)
    for (var item of collection) {
      if (f(item)) return true
    }
    return false
  },

  /**
   * @param  {Array|Object} collection
   * @param  {Function[]} [iteratees=sanvvv.identity]
   * @return {Array} returns new array
   */
  sortBy: function (collection, iteratees = [sanvvv.identity]) {
    // TODO: param Object
    var iters = iteratees.map(x => sanvvv.iteratee(x))
    var co = collection.slice(0)

    for (var i = iters.length - 1; i >= 0; i--) {
      co = collection.sort((a, b) => {
        a = '' + iters[i](a)
        b = '' + iters[i](b)
        return a.localeCompare(b)
      })
    }

    return co
  },

  /**
   * @param  {Function} func
   * @param  {...*} ...args
   * @return {number} Returns the timer id
   */
  defer: (func, ...args) => {
    return setTimeout(func, 0, ...args)
  },

  /**
   * @param  {Function} func
   * @param  {number} wait
   * @param  {...*} ...args
   * @return {number} Returns the timer id
   */
  delay: (func, wait, ...args) => {
    return setTimeout(func, wait, ...args)
  },

  /**
   * @param  {*} value
   * @return {Array}
   */
  castArray: (...value) => value,

  /**
   * @param  {Object} object
   * @param  {Object} source
   * @return {boolean} Returns true if object conforms, else false
   */
  conformsTo: (object, source) => {
    return sanvvv.conforms(source)(object)
  },

  /**
   * @param  {*} value
   * @param  {*} other
   * @return {boolean}
   */
  eq: (value, other) => value === other || (value !== value && other !== other),

  /**
   * @param  {*} value
   * @param  {*} other
   * @return {boolean}
   */
  gt: (value, other) => String(value).localeCompare(String(other)) === 1,

  /**
   * @param  {*} value
   * @param  {*} other
   * @return {boolean}
   */
  gte: (value, other) => String(value).localeCompare(String(other)) >= 0,

  isArguments: function (value) {
    return Object.prototype.toString.call(value) === '[object Arguments]'
  },

  isArray: function (value) {
    return Object.prototype.toString.call(value) === '[object Array]'
  },

  isArrayBuffer: function (value) {
    return Object.prototype.toString.call(value) === '[object ArrayBuffer]'
  },

  isArrayLike: function (value) {
    return !sanvvv.isNil(value) && value.hasOwnProperty('length') && typeof value !== 'function'
  },

  isArrayLikeObject: value => !sanvvv.isNil(value) && typeof value === 'object' && value.hasOwnProperty('length'),

  isBoolean: function (value) {
    return Object.prototype.toString.call(value) === '[object Boolean]'
  },

  isDate: function (value) {
    return Object.prototype.toString.call(value) === '[object Date]'
  },

  isElement: function (value) {
    return value !== null && typeof value === 'object' && value.nodeType === 1
  },

  isEmpty: function (value) {
    return sanvvv.isNil(value) || Object.values(value).length === 0
  },
  
  isError: function (value) {
    return value instanceof Error === true
  },

  isFinite: function (value) {
    return Number.isFinite(value)
  },

  isFunction: function (value) {
    return typeof value === 'function'
  },

  isInteger: function (value) {
    return Number.isInteger(value)
  },

  isLength: function (value) {
    return sanvvv.isNumber(value) && value >= 0 && value < Number.MAX_SAFE_INTEGER && value === Math.floor(value)
  },

  isMap: function (value) {
    return Object.prototype.toString.call(value) === '[object Map]'
  },

  isMatch: function (object, source) {
    for (var key in source) {
      if (!sanvvv.isEqual(object[key], source[key])) return false
    }
    return true
  },

  isMatchWith: (object, source, customizer) => {
    for (var key in source) {
      console.log(key)
      if (!customizer(object[key], source[key])) return false
    }
    return true
  },

  isNaN: function (value) {
    return Object.prototype.toString.call(value) === '[object Number]' && isNaN(value)
  },

  isNative: value => value.toString().includes('[native code]'),

  isNil: function (value) {
    return value === null || value === undefined
  },

  isNull: function (value) {
    return value === null 
  },

  isNumber: function (value) {
    return Object.prototype.toString.call(value) === '[object Number]'
  },

  isObject: function (value) {
    return value !== null && typeof value === 'object' || typeof value === 'function'
  },

  isObjectLike: function (value) {
    return typeof value === 'object' && value !== null
  },

  isPlainObject: function (value) {
    // !!!
    if (!Object.prototype.toString.call(value) === '[object Object]') return false
    if (value.constructor === Object) return true
    return false
  },

  isRegExp: function (value) {
    return Object.prototype.toString.call(value) === '[object RegExp]'
  },

  isSafeInteger: function (value) {
    return sanvvv.isInteger(value) && value >= Number.MIN_SAFE_INTEGER && value <= Number.MAX_SAFE_INTEGER
  },

  isSet: function (value) {
    return Object.prototype.toString.call(value) === '[object Set]'
  },

  isString: function (value) {
    return Object.prototype.toString.call(value) === '[object String]'
  },

  isSymbol: function (value) {
    return typeof value === 'symbol'
  },

  isTypedArray: value => {
    var str = Object.prototype.toString.call(value)
    return str.includes('Array') && str.length > 14
  },

  isUndefined: function (value) {
    return typeof value === 'undefined'
  },

  isWeakMap: function (value) {
    return Object.prototype.toString.call(value) === '[object WeakMap]'
  },

  isWeakSet: function (value) {
    return Object.prototype.toString.call(value) === '[object WeakSet]'
  },

  lt: (value, other) => String(value).localeCompare(String(other)) === -1,

  lte: (value, other) => String(value).localeCompare(String(other)) <= 0,

  isEqual: function (value, other) {
    if (value === other) return true
    if (value !== value && other !== other) return true
    if (Object.prototype.toString.call(value) !== Object.prototype.toString.call(other)) return false

    // more...

    if (sanvvv.isObject(value)) {
      var val = Object.keys(value)
      var oth = Object.keys(other)

      if (val.length !== oth.length) return false
      for (var key of val) {
        if (!sanvvv.isEqual(value[key], other[key])) return false
      }
      return true
    }

    return false
  },

  isEqualWith: (value, other, customizer = sanvvv.identity) => {
    // TODO: The customizer is invoked with up to six arguments: 
    // (objValue, othValue [, index|key, object, other, stack])
    if (typeof value !== typeof other) return false
    if (typeof value === 'string') return customizer(value, other)

    if (typeof value === 'object') {
      var val = Object.entries(value)
      var oth = Object.entries(other)
      return val.some((v, i) => customizer(val[i][1], oth[i][1], val[i][0], value, other))
    }

    return false
  },

  /**
   * @param  {*} value
   * @return {Array} Returns the converted array
   */
  toArray: value => {
    if (!sanvvv.isNil(value) && sanvvv.isArrayLike(value) || sanvvv.isObjectLike(value)) {
      return Object.values(value)
    } else return []
  },

  /**
   * @param  {*} value
   * @return {number}
   */
  toFinite: value => {
    var res = Number(value)
    if (Number.isFinite(res)) return res
    else if (sanvvv.isNaN(res)) return 0
    else return res > 0 ? Number.MAX_VALUE : Number.MIN_VALUE
  },

  /**
   * @param  {*} value
   * @return {number}
   */
  toInteger: value => Math.floor(sanvvv.toFinite(value)),

  /**
   * @param  {*} value
   * @return {number}
   */
  toLength: value => {
    return value > 0 ? sanvvv.toInteger(value) > 2 ** 32 - 1 ? 2 ** 32 - 1 : sanvvv.toInteger(value) : 0
  },

  /**
   * @param  {*} value
   * @return {number}
   */
  toNumber: value => Number(value), 

  /**
   * @param  {*} value
   * @return {number}
   */
  toSafeInteger: value => {
    if (value > 0) return value > Number.MAX_SAFE_INTEGER ? Number.MAX_SAFE_INTEGER : sanvvv.toInteger(value)
    else return value < Number.MIN_SAFE_INTEGER ? Number.MIN_SAFE_INTEGER : sanvvv.toInteger(value) 
  },

  /**
   * @param  {number} augend
   * @param  {number} addend
   * @return {number}
   */
  add: (augend, addend) => augend + addend,

  /**
   * @param  {number} number
   * @param  {number} [precision=0]
   * @return {number} Returns the rounded up number
   */
  ceil: (number, precision = 0) => Math.ceil(number * 10 ** precision) / 10 ** precision,

  /**
   * @param  {number} dividend
   * @param  {number} divisor
   * @return {number}
   */
  divide: (dividend, divisor) => dividend / divisor,

  /**
   * @param  {number} number
   * @param  {number} [precision=0]
   * @return {number}
   */
  floor: (number, precision = 0) => Math.floor(number * 10 ** precision) / 10 ** precision,

  /**
   * @param  {Array} array
   * @return {*}
   */
  max: array => sanvvv.maxBy(array),

  /**
   * @param  {Array} array
   * @param  {Function} [iteratee=sanvvv.identity]
   * @return {*} Returns the maximum value or undefined
   */
  maxBy: (array, iteratee = sanvvv.identity) => {
    if (!array.length) return undefined
    var f = sanvvv.iteratee(iteratee)
    return array.reduce((acc, cur) => f(acc) > f(cur) ? acc : cur)
  },

   /**
   * @param  {Array} array
   * @return {number}
   */
  mean: array => sanvvv.meanBy(array),

  /**
   * @param  {Array} array
   * @param  {Function} [iteratee=sanvvv.identity]
   * @return {number}
   */
  meanBy: (array, iteratee = sanvvv.identity) => {
    iteratee = sanvvv.iteratee(iteratee)
    return array.map(item => iteratee(item)).reduce((acc, cur) => acc + cur) / array.length
  },

  /**
   * @param  {Array} array
   * @return {*}
   */
  min: array => sanvvv.minBy(array),

  /**
   * @param  {Array} array
   * @param  {Function} [iteratee=sanvvv.identity]
   * @return {*} Returns the minimum value or undefined
   */
  minBy: (array, iteratee = sanvvv.identity) => {
    if (!array.length) return undefined
    var f = sanvvv.iteratee(iteratee)
    return array.reduce((acc, cur) => f(acc) < f(cur) ? acc : cur)
  },

  /**
   * @param  {number} multiplier
   * @param  {number} multiplicand
   * @return {number}
   */
  multiply: (multiplier, multiplicand) => multiplier * multiplicand,

  /**
   * @param  {number} number
   * @param  {number} [precision=0]
   * @return {number} Returns the rounded up number
   */
  round: (number, precision = 0) => Math.round(number * 10 ** precision) / 10 ** precision,
  
  /**
   * @param  {number} minuend
   * @param  {number} subtrahend
   * @return {number}
   */
  subtract: (minuend, subtrahend) => minuend % subtrahend,
  
  /**
   * @param  {Array} array
   * @return {number}
   */
  sum: array => sanvvv.sumBy(array),

  /**
   * @param  {Array} array
   * @param  {Function} [iteratee=sanvvv.identity]
   * @return {number}
   */
  sumBy: (array, iteratee = sanvvv.identity) => {
    var f = sanvvv.iteratee(iteratee)
    return array.reduce((acc, cur) => acc += f(cur), 0)
  },

  /**
   * @param  {number} number
   * @param  {number} lower
   * @param  {number} upper
   * @return {number}
   */
  clamp: (number, lower, upper) => {
    if (upper === undefined) {
      upper = lower
      lower = number
    }
    if (number > upper) return upper
    if (number < lower) return lower
    return number
  },

  /**
   * @param  {number} number
   * @param  {number} [start=0]
   * @param  {number} end
   * @return {boolean}
   */
  inRange: (number, start, end) => {
    if (end === undefined) {
      end = start
      start = 0
    }
    if (start > end) [start, end] = [end, start]
    return start <= number && number < end 
  },

  /**
   * @param  {number} [lower=0]
   * @param  {number} [upper=1]
   * @param  {boolean} floating
   * @return {}
   * @retrun {number}
   */
  random: (...args) => {
    var floating = false
    if (sanvvv.isBoolean(args[args.length - 1])) floating = args.pop()
    var [lower, upper] = sanvvv.init2Param(args[0], args[1], 0, 1)
    var res = sanvvv.getRandom(lower, upper)
    if (floating || sanvvv.isFloat(lower) || sanvvv.isFloat(upper)) return res
    else return Math.floor(res)
  },

  /**
   * @param  {Object} object
   * @param  {...Object} ...sources
   * @return {Object}
   */
  assign: (object, ...sources) => {
    return sources.reduce((acc, cur) => {
      for (var [key, value] of Object.entries(cur)) acc[key] = value
      return acc
    }, object)
  },

  /**
   * @param  {Object} object
   * @param  {...Object} ...sources
   * @return {Object}
   */
  assignIn: (object, ...sources) => {
    return sources.reduce((acc, cur, key) => {
      for (var key in cur) acc[key] = cur[key]
      return acc
    }, object)
  },

  /**
   * @param  {Object} object
   * @param  {...(string|string[])} ...paths
   * @return {Array}
   */
  at: (object, paths) => {
    return paths.map(path => sanvvv.get(object, path))
  },

  /**
   * @param  {Object} object
   * @param  {...Object} ...sources
   * @return {Object}
   */
  defaults: (object, ...sources) => {
    return sources.reduce((acc, cur) => {
      for (var [key, value] of Object.entries(cur)) {
        if (acc[key] === undefined) acc[key] = value
      }
      return acc
    }, object)
  },

  /**
   * @param  {Object} object
   * @param  {...Object} sources
   * @return {Object}
   */
  defaultsDeep: (object, ...sources) => {
    return sources.reduce((acc, cur) => {
      changeDeep(acc, cur)
      return acc
    }, object)

    function changeDeep (obj, src) {
      for (var prop in src) {
        if (src.hasOwnProperty(prop)) {
          if (typeof src[prop] === 'object') {
            if (obj[prop] === undefined) {
              obj[prop] = new src[prop].constructor()
            }
            changeDeep(obj[prop], src[prop])
          } else if (obj[prop] === undefined) {
            obj[prop] = src[prop]
          }
        }
      }
    }
  },

  /**
   * @param  {Object} object
   * @param  {Function} [predicate=sanvvv.identity]
   * @return {*}
   */
  findKey: (object, predicate = sanvvv.identity) => {
    predicate = sanvvv.iteratee(predicate)
    for (var key in object) {
     if (predicate(object[key])) return key
    }
    return undefined
  },

  /**
   * @param  {Object} object
   * @param  {Function} [predicate=sanvvv.identity]
   * @return {*}
   */
  findLastKey: (object, predicate = sanvvv.identity) => {
    predicate = sanvvv.iteratee(predicate)
    object = Object.entries(object)
    for (var i = object.length - 1; i >= 0; i--) {
      if (predicate(object[i][1])) return object[i][0]
    }
    return undefined
  },

  /**
   * @param  {Object} object
   * @param  {Function} [iteratee=sanvvv.identity]
   * @return {Object}
   */
  forIn: (object, iteratee = sanvvv.identity) => {
    for (var key in object) {
      var flag = iteratee(object[key], key, object)
      if (flag === false) return object
    }
    return object
  },

  /**
   * @param  {Object} object
   * @param  {Function} [iteratee=sanvvv.identity]
   * @return {Object}
   */
  forInRight: (object, iteratee = sanvvv.identity) => {
    var reg = []
    for (var key in object) reg.push(key)
    while (reg.length) {
      var key = reg.pop()
      var flag = iteratee(object[key], key, object)
      if (flag === false) return object
    }
    return object
  },

  /**
   * @param  {Object} object
   * @param  {Function} [iteratee=sanvvv.identity]
   * @return {Object}
   */
  forOwn: (object, iteratee = sanvvv.identity) => sanvvv.forEach(object, iteratee),

  /**
   * @param  {Object} object
   * @param  {Function} [iteratee=sanvvv.identity]
   * @return {Object}
   */
  forOwnRight: (object, iteratee = sanvvv.identity) => sanvvv.forEachRight(object, iteratee),

  /**
   * @param  {Object} object
   * @return {Array} Returns the function names
   */
  functions: object => Object.keys(object),

  /**
   * @param  {Object} object
   * @return {Array} Returns the function names
   */
  functionsIn: object => sanvvv.keysIn(object),

  /**
   * @param  {Object} object
   * @param  {Array|string} path
   * @param  {*} defaultValue
   * @return {*}
   */
  get: (object, path, defaultValue) => {
    var res = object
    path = sanvvv.toPath(path)

    for (var key of path) {
      if (res) res = res[key]
    }

    return res === undefined ? defaultValue : res
  },

  /**
   * @param  {Object} object
   * @param  {Array|string} path
   * @return {boolean}
   */
  has: (object, path) => {
    var obj = object
    path = sanvvv.toPath(path)

    for (var key of path) {
      if (!obj.hasOwnProperty(key)) return false
      obj = obj[key]
    }

    if (obj !== undefined) return true
  },

  /**
   * @param  {Object} object
   * @param  {Array|string} path
   * @return {boolean}
   */
  hasIn: (object, path) => sanvvv.get(object, path) !== undefined,

  /**
   * @param  {Object} object
   * @return {Object}
   */
  invert: object => Object.entries(object).reduce((acc, cur) => (acc[cur[1]] = cur[0], acc), {}),

  /**
   * @param  {Object} object
   * @param  {Function} iteratee=sanvvv.identity
   * @return {Object}
   */
  invertBy: (object, iteratee = sanvvv.identity) => {
    iteratee = sanvvv.iteratee(iteratee)
    return Object.entries(object).reduce((acc, cur) => {
      var key = iteratee(cur[1])
      if (acc[key]) acc[key].push(cur[0])
      else acc[key] = [cur[0]]
      return acc
    }, {})
  },

  /**
   * @param  {Object} object
   * @param  {Array|string} path
   * @param  {...*} ...args
   * @return *
   */
  invoke: function (object, path, ...args) {
    path = sanvvv.toPath(path)
    var func = path.pop()
    return sanvvv.get(object, path)[func](...args)
  },
  
  /**
   * @param  {Object} object
   * @return {Array} Returns the array of property names
   */
  keys: object => Object.keys(object),

  /**
   * @param  {Object} object
   * @return {Array} Returns the array of property names
   */
  keysIn: object => {
    var res = []
    for (var key in object) res.push(key)
    return res
  },

  /**
   * @param  {Object} object
   * @param  {Function} [iteratee=sanvvv.identity]
   * @return {Object}
   */
  mapKeys: (object, iteratee = sanvvv.identity) => {
    iteratee = sanvvv.iteratee(iteratee)
    return Object.entries(object).reduce((acc, cur) => {
      var key = iteratee(cur[1], cur[0], object)
      acc[key] = cur[1]
      return acc
    }, {})
  },

  /**
   * @param  {Object} object
   * @param  {Function} [iteratee=sanvvv.identity]
   * @return {Object}
   */
  mapValues: (object, iteratee = sanvvv.identity) => {
    iteratee = sanvvv.iteratee(iteratee)
    return Object.entries(object).reduce((acc, cur) => {
      var value = iteratee(cur[1], cur[0], object)
      acc[cur[0]] = value
      return acc
    }, {})
  },

  /**
   * @param  {Object} object
   * @param  {...Object} ...source
   * @return {Object}
   */
  merge: (object, ...sources) => sanvvv.mergeWith(object, ...sources, () => false),

  /**
   * @param  {Object} object
   * @param  {...Object} sources
   * @param  {Function} customizer
   * @return {Object}
   */
  mergeWith: (object, ...sources) => {
    // arguments: source, stack
    var customizer = sources.pop()

    return sources.reduce((acc, cur) => {
      changeDeep(acc, cur)
      return acc
    }, object)

    function changeDeep (obj, src) {
      for (var prop in src) {
        var tag = customizer(obj[prop], src[prop], prop, object)
        if (tag) obj[prop] = tag
        else if (typeof src[prop] === 'object') {
          if (obj[prop] === undefined) {
            obj[prop] = new src[prop].constructor()
          }
          changeDeep(obj[prop], src[prop])
        } else {
          obj[prop] = src[prop]
        }
      }
    }
  },

  /**
   * @param  {Object} object
   * @param  {...(string|string[])} ...paths
   * @return {Object}
   */
  omit: (object, ...paths) => {
    var res = {}
    paths = sanvvv.flatten(paths)
    
    for (var key in object) {
      if (paths.indexOf(key) === -1) res[key] = object[key]
    }

    return res
  },

  /**
   * @param  {Object} object
   * @param  {Function} [predicate=sanvvv.identity]
   * @return {Object}
   */
  omitBy: (object, predicate = sanvvv.identity) => {
    var res = {}
    for (var key in object) {
      if (!predicate(object[key])) res[key] = object[key]
    }
    return res
  },

  /**
   * @param  {Object} object
   * @param  {...(string|string[])} ...paths
   * @return {Object}
   */
  pick: (object, ...paths) => {
    return sanvvv.flatten(paths).reduce((acc, cur) => {
      if (object[cur] !== undefined) acc[cur] = object[cur]
      return acc
    }, {})
  },

  /**
   * @param  {Object} object
   * @param  {Function} [predicate=sanvvv.identity]
   * @return {Object}
   */
  pickBy: (object, predicate = sanvvv.identity) => {
    var res = {}
    for (var key in object) {
      if (predicate(object[key])) res[key] = object[key]
    }
    return res
  },

  /**
   * @param  {Object} object
   * @param  {Array|string} path
   * @param  {*} defaultValue
   * @return {*}
   */
  result: function (object, path, defaultValue) {
    // 因为要传递 this 所以没有使用箭头函数
    var res = sanvvv.get(object, path, defaultValue)
    return typeof res === 'function' ? res.call(this) : res
  },

  /**
   * @param  {Object} object
   * @param  {Array|string} path
   * @param  {*} value
   * @return {Object}
   */
  set: (object, path, value) => sanvvv.updateWith(object, path, value),

  /**
   * @param  {Object} object
   * @param  {Array|string} path
   * @param  {*} value
   * @param  {Function} [customizer=()=>undefined]
   * @return {Object}
   */
  setWith: (object, path, value, customizer) => sanvvv.updateWith(object, path, value, customizer),

  /**
   * @param  {Object} object
   * @return {Array}
   */
  toPairs: Object.entries,

  /**
   * @param  {Object} object
   * @return {Array}
   */
  toPairsIn: object => {
    // If object is a map or set, its entries are returned
    var res = []

    for (var key in object) {
      res.push([key, object[key]])
    }

    return res
  },

  /**
   * @param  {Object|Array} object
   * @param  {Function} [iteratee=sanvvv.identity]
   * @param  {*} accumulator
   * @return {*}
   */
  transform: (object, iteratee = sanvvv.identity, accumulator = new object.constructor()) => {
    for (var key in object) {
      if (object.hasOwnProperty(key)) {
        var tag = iteratee(accumulator, object[key], key, object)
        if (tag === false) return accumulator
      }
    }
    return accumulator
  },

  /**
   * Removes the property at path of object.
   *
   * @param  {Object} object
   * @param  {Array|string} path
   * @return {boolean} Returns true if the property is deleted, else false
   */
  unset: (object, path) => {  
    if (sanvvv.get(object, path) === undefined) return false

    path = sanvvv.toPath(path)
    var lastPath = path.pop()
    return delete path.reduce((acc, cur) => acc[cur], object)[lastPath]
  },

  /**
   * @param  {Object} object
   * @param  {Array|string} path
   * @param  {Function} updater
   * @return {Object}
   */
  update: (object, path, updater) => sanvvv.updateWith(object, path, updater),

  updateWith: (object, path, updater, customizer = (...args) => args[0]) => {
    path = sanvvv.toPath(path)
    var node = object
    var len = path.length

    for (var i = 0; i < len - 1; i++) {
      var key = path[i]
      // customizer(nsValue, key, nsObject)
      var nextKey = path[i + 1] === undefined ? undefined : customizer(path[i + 1], i + 1, node)
      if (node[key] === undefined) {
        if (nextKey !== undefined) {
          if (/[a-z]/i.test(nextKey) || typeof nextKey === 'object')  node[key] = {}
          else node[key] = []
        }
      }
      node = node[key]
    }

    if (typeof updater === 'function') {
      // for updateWith
      node[path[len - 1]] = updater(node[path[len - 1]])
    } else {
      // for setWith
      node[path[len - 1]] = updater
    }

    return object
  },

  /**
   * @param  {Object} object
   * @return {Array}
   */
  values: Object.values,

  /**
   * @param  {Object} object
   * @return {Array}
   */
  valuesIn: object => {
    var res = []
    for (var key in object) res.push(object[key])
    return res
  },

  /**
   * @param  {string} [string='']
   * @return {string}
   */
  camelCase: (string = '') => {
    var words = sanvvv.words(string)
    return words.reduce((acc, cur) => acc + sanvvv.capitalize(cur), words.shift().toLowerCase())
  },

  /**
   * @param  {string} [string='']
   * @return {string}
   */
  capitalize: (string = '') => string[0].toUpperCase() + string.toLowerCase().slice(1),

  /**
   * @param  {string} [string='']
   * @param  {string} target
   * @param  {number} [position=string.length]
   * @return {boolean}
   */
  endsWith: (string = '', target, position = string.length) => string[position - 1] === target,
  
  /**
   * @param  {string} [string='']
   * @return {string}
   */
  escape: (string = '') => {
    var map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }
    var res = []
    
    for (var char of string) {
      if (map[char]) res += map[char]
      else res += char
    }

    return res
  },

  /**
   * @param  {string} [string='']
   * @return {string}
   */
  escapeRegExp: (string = '') => {
    var table = ["^", "$", "", ".", "*", "+", "?", "(", ")", "[", "]", "{", "}", "|"]
    var res = []

    for (var char of string) {
      if (table.includes(char)) res += '\\' + char
      else res += char
    }

    return res
  },

  /**
   * @param  {string} [string='']
   * @return {string}
   */
  kebabCase: (string = '') => sanvvv.words(string).map(str => str.toLowerCase()).join('-'),

  /**
   * @param  {string} [string='']
   * @return {string}
   */
  lowerCase: (string = '') => sanvvv.words(string).map(str => str.toLowerCase()).join(' '),

  /**
   * @param  {string} [string='']
   * @return {string}
   */
  snakeCase: (string = '') => sanvvv.words(string).map(str => str.toLowerCase()).join('_'),

  /**
   * @param  {string} [string='']
   * @return {string}
   */
  startCase: (string = '') => sanvvv.words(string).map(str => sanvvv.upperFirst(str)).join(' '),
  
  /**
   * @param  {string} [string='']
   * @return {string}
   */
  upperCase: (string = '') => sanvvv.words(string).map(str => str.toUpperCase()).join(' '),

  /**
   * @param  {string} [string='']
   * @return {string}
   */
  lowerFirst: (string = '') => string[0].toLowerCase() + string.slice(1),

  /**
   * @param  {string} [string='']
   * @param  {number} [length=0]
   * @param  {string} [chars='']
   * @return {string}
   */
  pad: (string = '', length = 0, chars = ' ') => string.padStart(string.length + Math.floor((length - string.length) / 2), chars).padEnd(length, chars),

  /**
   * @param  {string} [string='']
   * @param  {number} [length=0]
   * @param  {string} [chars='']
   * @return {string}
   */
  padEnd: (string = '', length = 0, chars = ' ') => string + sanvvv.repeat(chars, length - string.length).slice(0, length - string.length),

  /**
   * @param  {string} [string='']
   * @param  {number} [length=0]
   * @param  {string} [chars='']
   * @return {string}
   */
  padStart: (string = '', length = 0, chars = ' ') => sanvvv.repeat(chars, length - string.length).slice(0, length - string.length) + string,

  /**
   * @param  {string} string
   * @param  {number} [radix=10]
   * @return {number}
   */
  parseInt: (string, radix = 10) => {
    if (radix <= 1) return NaN
    var res = ''
    var val = string - 0

    while (val > 0) {
      res = val % radix + res
      val = Math.floor(val / radix)
    }

    return res - 0
  },

  /**
   * @param  {string} [string='']
   * @param  {number} [n=1]
   * @return {string}
   */
  repeat: (string = '', n = 1) => {
    var res = ''
    for (var i = 0; i < n; i++) {
      res += string
    }
    return res
  },

  replace: (string = '', pattern, replacement) => string.replace(pattern, replacement),

  /**
   * @param  {string} [string='']
   * @return {string}
   */

  split: (string = '', seperator, limit) => string.split(seperator, limit),

  /**
   * @param  {string} [string='']
   * @param  {string} target
   * @param  {number} [position=0]
   * @return {boolean}
   */
  startsWith: (string = '', target, position = 0) => string[position] === target,

  toLower: (string = '') => string.toLowerCase(),

  toUpper: (string = '') => string.toUpperCase(),

  /**
   * @param  {string} [string='']
   * @param  {string} [chars=' ']
   * @return {string}
   */
  trim: (string = '', chars = ' ') => sanvvv.trimStart(sanvvv.trimEnd(string, chars), chars),

  /**
   * @param  {string} [string='']
   * @param  {string} [chars=' ']
   * @return {string}
   */
  trimEnd: (string = '', chars = ' ') => {
    if (chars === ' ') return string.trimEnd()
    var end = -1

    for (var i = 0; i < string.length; i++) {
      if (!chars.includes(string[i])) end = i
    }

    return string.slice(0, end + 1)
  },

  /**
   * @param  {string} [string='']
   * @param  {string} [chars=' ']
   * @return {string}
   */
  trimStart: (string = '', chars = ' ') => {
    if (chars === ' ') return string.trimStart()
    var start = -1

    for (var i = 0; i < string.length; i++) {
      if (!chars.includes(string[i])) {
        if (start === -1) start = i
      }
    }

    return string.slice(start, string.length)
  },

  /**
   * @param  {stirng} [string='']
   * @param  {Object} [options={}]
   * @param  {number} [options.length=30]
   * @param  {string} [options.omission='...']
   * @param  {RegExp|string} [options.separator]
   * @return {string}
   */
  truncate: (string = '', options = {}) => {
    var len = string.length
    var oLen = options.length || 30
    var omission = options.omission || '...'
    var separator = options.separator

    if (len < oLen) return string
    else {
      var truncateStart
      var truncateEnd = oLen - omission.length
      var str = string.slice(0, truncateEnd) + omission

      if (separator === undefined) return str
      if (typeof separator === 'string') {
         truncateStart = str.lastIndexOf(separator)
      } else {
        if (separator.test(str)) {
          var reg = new RegExp(separator, 'g')
          var result = str.match(reg)
          truncateStart = str.lastIndexOf(result[result.length - 1])
        } else {
          truncateStart = -1
        }
      }

      if (truncateStart === -1) return str
      else return str.slice(0, truncateStart) + str.slice(truncateEnd)
    }
  },

  /**
   * @param  {string} [string='']
   * @return {string}
   */
  unescape: (string = '') => {
    var map = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>' ,
      '&quot;': '"',
      '&#39;': "'" 
    }
    var res = ''
    var temp = ''
    var tag = false

    for (var char of string) {
      if (char === '&') tag = true

      if (tag) temp += char
      else res += char

      if (char === ';') {
        tag = false
        if (map[temp]) res += map[temp]
        else res += temp
      }
    }

    return res
  },

  /**
   * @param  {string} [string='']
   * @return {string}
   */
  upperFirst: (string = '') => string[0].toUpperCase() + string.slice(1),
  
  /**
   * @param  {string} [string='']
   * @param  {RegExp|string} pattern
   * @return {Array}
   */
  words: (string = '', pattern) => pattern === undefined ? string.match(/[A-Z]{1}[a-z]+|([A-Z]+)(?=[A-Z][a-z])|[a-z]+|[A-Z]+/g) : string.match(pattern),

  /**
   * @param  {Function} func
   * @param  {...*} ...args
   * @return {*}  Returns the func result or error object
   */
  attempt: (func, ...args) => {
    try {
      return func(...args)
    } catch (e) {
      return e
    }
  },

  /**
   * @param  {Array} pairs
   * @return {Function}
   */
  cond: pairs => match => {
    // TODO: 并绑定 this ???
    for (var func of pairs) {
      if (func[0](match)) return func[1]()
    }
  },

  /**
   * @param  {Object} source
   * @return {Function}
   */
  conforms: source => obj => Object.entries(source).every(src => src[1](obj[src[0]])),

  /**
   * @param  {*} value
   * @return {Function}
   */
  constant: value => () => value,

  /**
   * @param  {*} value
   * @param  {*} defaultValue
   * @return {*}
   */
  defaultTo: (value, defaultValue) => sanvvv.isNil(value) || sanvvv.isNaN(value) ? defaultValue : value,

  /**
   * @param  {...(Function|Function[])} ...funcs
   * @return {Function}
   */
  flow: funcs => (...args) => funcs.reduce((acc, cur) => cur(acc), funcs.shift()(...args)),

  /**
   * @param  {...(Function|Function[])} ...funcs
   * @return {Function}
   */
  // flowRight: funcs => (...args) => sanvvv.reduceRight(funcs, (acc, cur) => cur(acc), funcs.pop()(...args)),

  
  /**
   * This method returns the first argument it receives
   * 
   * @param  {*} value
   * @return {*}
   */
  identity: value => value,

  /**
   * Creates a function that invokes func with the arguments of the created functions
   *
   * @param  {*} iter
   * @return {Function}
   */
  iteratee: iter => {
    // isObject
    if (Object.prototype.toString.call(iter) === '[object Object]') {
      return sanvvv.matches(iter)
    }

    // isArray
    // TODO: 不应该比较大小
    if (sanvvv.isArray(iter)) {
      // !!! 只写了数组 length === 2 的情况
      return obj => sanvvv.isEqual(obj[iter[0]], iter[1])
    }

    // isRegExp
    // /(?<=\/).*?(?=\/)/
    if (sanvvv.isRegExp(iter)) {
      return str => iter.exec(str)
    }

    // isString
    if (typeof iter === 'string') {
      return sanvvv.property(iter)
    }
    
    // isFunction
    if (typeof iter === 'function') return iter
  },

  /**
   * Creates a function that performs a partial deep comparison 
   * between a given object and source
   * the function returns boolean
   * 
   * @param  {Object} source
   * @return {Function}
   */
  matches: source => obj => {
    for (var property in source) {
      if (!sanvvv.isEqual(obj[property], source[property])) return false
    }
    return true
  },

  
  /**
   * Creates a function that performs a partial deep comparison 
   * between the value at path of a given object to srcValue
   * the function returns boolean
   * 
   * @param  {Array|string} path
   * @param  {*} srcValue
   * @return {Function}
   */
  matchesProperty: (path, srcValue) => obj => sanvvv.isEqual(sanvvv.method(path), srcValue),

  /**
   * Creates a function that invokes the method at path of a given object
   * the function returns value
   * 
   * @param  {Array|string} path
   * @param  {...*} args
   * @return {Function}
   */
  method: (path, ...args) => obj => sanvvv.get(obj, path)(...args),

  methodOf: (object, ...args) => path => sanvvv.get(object, path)(...args),

  mixin: (object, source, options) => {
    // TODO options 链式调用
    var obj = typeof source === 'object' ? object : sanvvv
    var src = object
    var opt = options || {}

    if (typeof object === 'function') obj = obj.prototype

    for (var property in src) {
      var val = src[property]
      if (typeof val === 'function') obj[property] = val
    }
  },
  
  noop: () => undefined,

  nthArg: (n = 0) => (...args) => n >= 0 ? args[n] : args[args.length + n],
  
  property: path => obj => sanvvv.get(obj, path),

  propertyOf: object => path => sanvvv.get(object, path),

  range: (start, end, step = 1) => {
    var res = []

    if (!end) {
      end = start
      start = 0 
    }

    if (step === 0) return new Array(Math.abs(end) - 1).fill(start)

    if (end > 0) {
      for (var i = start; i < end; i += step) res.push(i)
    } else {
      for (var i = start; i > end; i -= Math.abs(step)) res.push(i)
    }

    return res
  },

  rangeRight: (start, end, step = 1) => {
    var res = []

    if (!end) {
      end = start
      start = 0 
    }

    if (step === 0) return new Array(Math.abs(end) - 1).fill(start)

    if (end > 0) {
      for (var i = start; i < end; i += step) res.unshift(i)
    } else {
      for (var i = start; i > end; i -= Math.abs(step)) res.unshift(i)
    }

    return res
  },

  times: (n, iteratee = sanvvv.identity) => {
    // TODO: iterate -> sanvvv.iteratee
    var res = []
    for (var i = 0; i < n; i++) res.push(iteratee(i))
    return res
  },

  toPath: value => typeof value === 'object' ? value : value.match(/[a-z0-9]+/gi),

  cloneDeep: value => {
    if (value === null || typeof value !== 'object') return value

    var ctor = value.constructor
    var obj

    switch (ctor) {
      case RegExp:
        obj = new ctor(value)
        break
      default:
        obj = new ctor()
    }

    for (var key in value) {
      if (value.hasOwnProperty(key)) {
        obj[key] = sanvvv.cloneDeep(value[key])
      }
    }

    return obj
  },

  /**
   * @param  {Function} func
   * @param  {number} [n=func.length]
   * @return {Function}
   */
  ary: (func, n = func.length) => (...args) => func(...args.slice(0, n)),

  /**
   * @param  {Function} func
   * @return {Function}
   */
  unary: func => arg => func(arg),

  /**
   * @param  {Function} predicate
   * @return {Function}
   */
  negate: predicate => (...args) => {
    // !!! The func predicate is invoked with the this binding and arguments of the created function
    return !predicate(...args)
  },

  /**
   * @param  {Function} func
   * @return {Function}
   */
  once: func => {
    var tag = true
    var res
    return (...args) => {
      if (tag) {
        res = func(...args)
        tag = false
      }
      return res
    }
  },

  /**
   * @param  {Function} func
   * @param  {number} [arity=func.length]
   * @return {Function}
   */
  curry: (func, arity = func.length) => {
    return function curried (...args) {
      if (args.length < arity) {
        return curried.bind(null, ...args)
      } else {
        return func(...args)
      }
    }
  },

  /**
   * @param  {Function} func
   * @param  {Function} resolver
   * @return {Function}
   */
  memoize: (func, resolver = (...args) => args[0]) => {
    var memo = function (...args) {
      var cache = memo.cache
      var key = resolver(...args)
      if (cache.has(key)) return cache.get(key)
      else cache.set(key, func(...args))
    }

    memo.cache = new Map()
    return memo
  },

  /**
   * @param  {Function} func
   * @param  {number} [start=0]
   * @return {Function}
   */
  spread: (func, start = 0) => args => func(...args.slice(start)),

  /**
   * Creates a function that invokes func with arguments reversed.
   * 
   * @param  {Function} func
   * @return {Function}
   */
  flip: func => (...args) => func(...args.reverse()),
}
