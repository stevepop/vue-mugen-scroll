import throttle from 'lodash.throttle'
import inViewport from './in-viewport'

const triggers = ['scroll', 'resize']

const MugenScroll = {
  name: 'mugen-scroll',
  props: {
    handler: {
      type: Function,
      required: true
    },
    shouldHandle: {
      type: Boolean,
      default: true
    },
    threshold: {
      type: Number,
      default: 0
    }
  },
  mounted() {
    this.checkInView()
  },
  methods: {
    checkInView() {
      const execute = () => {
        const inView = inViewport(this.$refs.scroll, {
          threshold: this.threshold
        })
        if (this.shouldHandle && inView) {
          this.handler()
        }
      }

      // checkInView right after this component is mounted
      execute()

      // add event listeners
      this.check = throttle(execute, 200)
      triggers.forEach(event => window.addEventListener(event, this.check))
    }
  },
  render(h) {
    return h('div', {
      staticClass: 'mugen-scroll',
      ref: 'scroll'
    }, this.$slots.default)
  },
  beforeDestroy() {
    triggers.forEach(event => window.removeEventListener(event, this.check))
  }
}

export default MugenScroll
