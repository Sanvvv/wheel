function parseJson (string) {
  let at = 0
  let ch = string[at]
  return typeParse()

  function typeParse () {
    if (ch === 't' || ch === 'f' || ch === 'n') return parseBN()
    else if (ch === '{') return parseObject()
    else if (ch === '[') return parseArray()
    else if (ch === '"') return parseString()
    else if (isNumber(ch)) return parseNumber()
    error()
  }

  function parseObject () {
    let obj = {}
    do {
      let key = typeParse(next())
      if (!(next() === ':')) error()
      let value = typeParse(next())
      obj[key] = value
    } while (next() === ',')
    return obj
  }

  function parseArray () {
    let arr = []
    do {
      arr.push(typeParse(next()))
    } while (next() === ',')
    return arr
  }

  function parseString () {
    let str = ''
    while (next() !== '"') {
      str += ch
    }
    return str
  }

  function parseNumber () {
    let num = ''
    while (1) {
      if (isNumber(ch)) num += ch
      else error()
      if (isNearEnd()) return +num
      else next()
    }
  }

  function parseBN () {
    switch (ch) {
      case 't':
        isNext('r')
        isNext('u')
        isNext('e')
        return true
      case 'f':
        isNext('a')
        isNext('l')
        isNext('s')
        isNext('e')
        return false
      case 'n':
        isNext('u')
        isNext('l')
        isNext('l')
        return null
    }
    error('error in parseBoolean at ' + at)
  }

  function next () {
    ch = string[++at]
    if (ch === ' ') return next()
    return ch
  }

  function isNext (expect) {
    if (next() === expect) return true
    else error()
  }

  function isNearEnd () {
    let c = string[at + 1]
    return c === undefined || c === ',' || c === '}' || c === ']' || c === ':'
  }

  function isNumber (c) {
    return !isNaN(c)
  }

  function error (message) {
    if (message) throw new Error(message)
    else throw new SyntaxError('Unexpected token ' + ch + ' in JSON at position ' + at)
  }
}