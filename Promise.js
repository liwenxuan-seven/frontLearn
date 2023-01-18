function Promise(executor) {
    //执行器函数同步调用
    this.PromiseState='pending'
    this.PromiseResult=null
    const self = this
    this.callbacks = []
    function resolve(data) {
        if(self.PromiseState !== 'pending') return;
        self.PromiseState='resolved'
        self.PromiseResult=data
        self.callbacks.forEach(item => {
            item.onResolved(data)
        })
    }
    const reject = (data)=>{
        if(this.PromiseState !== 'pending') return;
        this.PromiseState='rejected'
        this.PromiseResult=data
        this.callbacks.forEach(item =>{
            item.onRejected(data)
        })
    }
    try {
        executor(resolve,reject)
    }catch (e) {
        reject(e)
    }

}
//添加一个then方法
Promise.prototype.then=function (onResolved,onRejected){
    if (this.PromiseState === 'resolved'){
        onResolved(this.PromiseResult)
    }
    if (this.PromiseState === 'rejected') {
        onRejected(this.PromiseResult)
    }
    if (this.PromiseState === 'pending') {
        this.callbacks.push({
            onResolved:onResolved,
            onRejected:onRejected
        })
    }
}
