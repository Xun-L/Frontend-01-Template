import { createElement } from './createElement.js'
//import {Carousel} from './carousel.vue'

console.log(Carousel)
class Carousel {
  constructor() {
    this.children = []
  }
  setAttribute(name, val) {
    this[name] = val
  }
  render() {
    let children = this.data.map((url) => {
      let element = <img src={url} />
      element.addEventListener('dragstart', (event) => event.preventDefault())
      return element
    })

    let root = <div class="carousel">{children}</div>

    let pos = 0
    let nextPic = () => {
      let nextPos = (pos + 1) % this.data.length
      let current = children[pos]
      let next = children[nextPos]

      current.style.transition = 'ease 0s'
      next.style.transition = 'ease 0s'
      current.style.transform = `translateX(${-100 * pos}%)`
      next.style.transform = `translateX(${100 - 100 * nextPos}%)`
      setTimeout(() => {
        current.style.transition = ''
        next.style.transition = ''
        current.style.transform = `translateX(${-100 - 100 * pos}%)`
        next.style.transform = `translateX(${-100 * nextPos}%)`
        pos = nextPos
      }, 16)

      // setTimeout(nextPic, 3000);
    }
    nextPic()
    root.addEventListener('mousedown', (event) => {
      let startX = event.clientX

      let lastPos = (pos - 1 + this.data.length) % this.data.length
      let nextPos = (pos + 1) % this.data.length

      let current = children[pos]
      let last = children[lastPos]
      let next = children[nextPos]

      current.style.transition = 'ease 0s'
      last.style.transition = 'ease 0s'
      next.style.transition = 'ease 0s'

      current.style.transform = `translateX(${-500 * pos}px)`
      last.style.transform = `translateX(${-500 - 500 * lastPos}px)`
      next.style.transform = `translateX(${500 - 500 * nextPos}px)`
      let move = (event) => {
        let moveX = event.clientX - startX
        current.style.transform = `translateX(${moveX - 500 * pos}px)`
        last.style.transform = `translateX(${moveX - 500 - 500 * lastPos}px)`
        next.style.transform = `translateX(${moveX + 500 - 500 * nextPos}px)`
      }
      let up = (event) => {
        console.log('up')
        let offset = 0
        if (event.clientX - startX > 250) {
          offset = 1
        }
        if (event.clientX - startX < -250) {
          offset = -1
        }

        current.style.transition = ''
        last.style.transition = ''
        next.style.transition = ''

        current.style.transform = `translateX(${offset * 500 - 500 * pos}px)`
        last.style.transform = `translateX(${
          offset * 500 - 500 - 500 * lastPos
        }px)`
        next.style.transform = `translateX(${
          offset * 500 + 500 - 500 * nextPos
        }px)`

        pos = (pos - offset + this.data.length) % this.data.length

        document.removeEventListener('mouseup', up)
        document.removeEventListener('mousemove', move)
      }
      document.addEventListener('mousemove', move)
      document.addEventListener('mouseup', up)
    })

    return root
  }
  mountTo(parent) {
    this.render().mountTo(parent)
  }
}
let data = [
  'https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg',
  'https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg',
  'https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg',
  'https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg'
]
let component = <Carousel data={data}></Carousel>

component.mountTo(document.body)
