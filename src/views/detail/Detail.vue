<!--  -->
<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"></detail-nav-bar>
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>\
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
      <detail-param-info ref="params" :param-info="paramInfo"></detail-param-info>
      <detail-comment-info ref="comment" :comment-info="commentInfo"></detail-comment-info>
      <goods-list ref="recommend" :goods="recommends"/>
    </scroll>
    <detail-bottom-bar @addCart='addCart'/>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
import DetailNavBar from './childComps/DetailNavBar.vue'
import DetailSwiper from './childComps/DetailSwiper.vue'
import DetailBaseInfo from './childComps/DetailBaseInfo.vue'
import DetailShopInfo from './childComps/DetailShopInfo.vue'
import DetailGoodsInfo from './childComps/DetailGoodsInfo.vue'
import DetailParamInfo from './childComps/DetailParamInfo.vue'
import DetailCommentInfo from './childComps/DetailCommentInfo.vue'
import DetailBottomBar from './childComps/DetailBottomBar.vue'

import {getDetail,Goods,Shop,GoodsParam,getRecommend} from 'network/detail.js';
import {itemListenerMixin} from 'common/mixin.js'

import Scroll from 'components/common/scroll/Scroll.vue'
import GoodsList from 'components/content/goods/GoodsList.vue'
import BackTop from 'components/content/backTop/BackTop.vue'

// import { mapActions } from 'vuex'

export default {
  name:'Detail',
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    Scroll,
    GoodsList,
    BackTop
  },
  mixins: [itemListenerMixin],
  data() { 
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      currentIndex: null,
      isShowBackTop:false
    }
  },
  created() {
    // 保存传入的iid
    this.iid = this.$route.params.iid
    // 根据iid请求详情数据
    getDetail(this.iid).then(res => {
      const data = res.result
      //获取顶部图片
      this.topImages = data.itemInfo.topImages
      // 获取商品信息
      this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services)
      //获取店铺信息
      this.shop = new Shop(data.shopInfo)
      // 保存商品详情数据
      this.detailInfo = data.detailInfo
      // 获取参数信息
      this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)
      //取出评论信息
      if(data.rate.cRate !== 0){
        this.commentInfo = data.rate.list[0]
      }
    })
    //请求推荐数据
    getRecommend().then(res => {
      this.recommends = res.data.list
    })
  },
  mounted() {
  },
  destroyed() {
    this.$bus.$off('itemImageLoad',this.itemImageListener)
  },
  methods: {
    // ...mapActions(['addCart']),
    imageLoad() {
      this.$refs.scroll.refresh()
      // 点击导航栏标题滚动到对应内容
      this.themeTopYs = []
      this.themeTopYs.push(0)
      this,this.themeTopYs.push(this.$refs.params.$el.offsetTop)
      this,this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      this,this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
      this.themeTopYs.push(Number.MAX_VALUE)
    },
    // 点击导航栏标题滚动到对应内容
    titleClick(index) {
      this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],200)
    },
    backClick() {
      this.$refs.scroll.scrollTo(0,0)
    },
    //滚动到对应内容，导航栏标题做出相应改变
    contentScroll(position) {
      // 获取y值
      const positionY = -position.y
      let length = this.themeTopYs.length
      for(let i = 0; i < length-1; i++) {
        if(this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])){
          this.currentIndex = i;
          this.$refs.nav.currentIndex = this.currentIndex
        }
      }
      // 是否显示回到顶部按钮
      this.isShowBackTop = positionY > 1000
    },
    //添加商品到购物车
    addCart() {
      //获取商品信息
      const product= {}
      product.image = this.topImages[0]
      product.title = this.goods.title
      product.desc = this.goods.desc
      product.price = this.goods.realPrice
      product.iid = this.iid
      //将商品添加到购物车
      // this.addCart(product).then(res => {
      //   console.log(res);
      // })
      this.$store.dispatch('addCart',product).then(res => {
        this.$toast.show(res,2000)
      })
    }
    //弹出购物车成功对话框

  }
}

</script>
<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }
  .content {
    height: calc(100% - 96px);
  }
  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
</style>