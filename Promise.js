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
    const self = this

    return new Promise((resolve,reject) =>{
        function callback(type) {
            try{
                let res = type(self.PromiseResult)
                if(res instanceof Promise){
                    res.then(value => {
                        resolve(value)
                    },reason => {
                        reject(reason)
                    })
                }else{
                    resolve(res)
                }
            }catch(e){
                reject(e)
            }
        }
        try {
            if (this.PromiseState === 'resolved'){
                callback(onResolved)
            }
            if (this.PromiseState === 'rejected') {
                callback(onRejected)
            }
            if (this.PromiseState === 'pending') {
                this.callbacks.push({
                    onResolved:function () {
                        callback(onResolved)

                    },
                    onRejected:function () {
                        callback(onRejected)
                    }
                })
            }
        }catch (e) {
            reject(e)
        }

    })

}
