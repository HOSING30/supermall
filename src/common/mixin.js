import { debounce } from 'common/utils.js'
export const itemListenerMixin = {
    data() {
        return {
            itemImageListener: null,
        }
    },
    mounted() {
        const refresh = debounce(this.$refs.scroll.refresh, 200)
        this.itemImageListener = () => {
            refresh()
        }
        this.$bus.$on('itemImageLoad', this.itemImageListener)
    }
}