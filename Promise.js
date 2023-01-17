function Promise(executor) {
    //执行器函数同步调用
    this.PromiseState='pending'
    this.PromiseResult=null
    const self = this
    function resolve(data) {
        if(self.PromiseState !== 'pending') return;
        self.PromiseState='resolved'
        self.PromiseResult=data
    }
    const reject = (data)=>{
        if(this.PromiseState !== 'pending') return;
        this.PromiseState='rejected'
        this.PromiseResult=data
    }
    try {
        executor(resolve,reject)
    }catch (e) {
        reject(e)
    }

}
//添加一个then方法
Promise.prototype.then=function (onResolved,onRejected){

}
