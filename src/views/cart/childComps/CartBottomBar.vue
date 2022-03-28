<!--  -->
<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button class="check-button" 
                    :is-checked="isSelectorAll"
                    @click.native="checkClick"/>
      <span>全选</span>
    </div>
    <div class="price">
      合计: {{totalPrice}}
    </div>
    <div class="calculate" @click="cartClick">
      去结算：({{checkeLength}})
    </div>
  </div>
</template>

<script>
import CheckButton from 'components/content/checkButton/CheckButton'
import {mapGetters} from 'vuex'
export default {
  name: 'CartBottomBar',
  components: {
    CheckButton
  },
  computed: {
    ...mapGetters(['cartList']),
    totalPrice() {
      return '￥' + this.cartList.filter(item => {
        return item.checked
      }).reduce((perValue,item) => {
        return perValue + item.price * item.count
      },0).toFixed(2)
    },
    checkeLength() {
      return this.cartList.filter(item => item.checked).length
    },
    isSelectorAll() {
      if(this.cartList.length === 0) return false
      return !this.cartList.find(item => !item.checked)
    }
  },
  methods: {
    checkClick() {
      // 全部选中
      if(this.isSelectorAll) {
        this.cartList.forEach(item => item.checked = false)
      } else {
        // 包含未选中
        this.cartList.forEach(item => item.checked = true)
      }
    },
    cartClick() {
      if(!this.isSelectorAll){
        this.$toast.show('请选择购买商品',2000)
      }
    }
  }
}

</script>
<style scoped>
  .bottom-bar {
    background-color: #eee;
    height: 40px;
    position: relative;
    line-height: 40px;
    display: flex;
    font-size: 14px;
  }

  .check-content {
    display: flex;
    align-items: center;
    margin-left: 10px;
    width: 60px;
    /* line-height: 40px; */

  }

  .check-button {
    width: 20px;
    height: 20px;
    line-height: 20px;
    margin-right: 5px;
  }

  .price {
    margin-left: 20px;
    flex: 1;
  }

  .calculate {
    width: 90px;
    background-color: orange;
    color: #fff;
    text-align: center;
  }
</style>