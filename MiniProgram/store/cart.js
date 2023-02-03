export default {
	namespaced : true,
	
	state: ()=> ({
		
		cart: JSON.parse(uni.getStorageSync('cart') || '[]')
	}),
	
	mutations:{
		addToCart(state,goods){
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
			// console.log(findResult)
			
			if(!findResult){
				state.cart.push(goods)
			}else{
				findResult.goods_count++
			}
			this.commit('m_cart/saveToStorage')
			console.log(state.cart)
		},
		saveToStorage(state){
			uni.setStorageSync('cart',JSON.stringify(state.cart))
		},
		//更新商品状态
		updateGoodsState(state,goods){
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
			
			if(findResult){
				findResult.goods_state = goods.goods_state
			}
			this.commit('m_cart/saveToStorage')
			
		},
		//更改商品的数量
		updateGoodsCount(state,goods){
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
			
			if(findResult){
				findResult.goods_count = goods.goods_count
			}
			this.commit('m_cart/saveToStorage')
		},
		//根据id删除指定商品
		removeGoodsById(state,goods_id){
			//利用filter返回过滤后的数组
			state.cart = state.cart.filter(x => x.goods_id !== goods_id)
			
			this.commit('m_cart/saveToStorage')
		},
		//全选或者不全选
		updateAllGoodsState(state,newState){
			state.cart.forEach(x => x.goods_state = newState)
			
			this.commit('m_cart/saveToStorage')
		}
		
	},
	
	getters:{
		//购物车的商品总数
		total(state){
			// let c = 0
			// state.cart.forEach(x => c += x.goods_count)
			// return c
			
			return state.cart.reduce((total,item)=>{return total += item.goods_count},0)
		},
		//购物车中所有被选择的商品数
		checkedCount(state){
			return state.cart.filter(x => x.goods_state).reduce((total,item) => total += item.goods_count,0)
		},
		//已勾选商品的总价
		checkedGoodsAmount(state){
			return state.cart.filter(x => x.goods_state).reduce((total,item) => total += item.goods_price * item.goods_count,0).toFixed(2)
		}
		
	}
}