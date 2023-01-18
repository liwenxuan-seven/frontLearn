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
    return new Promise((resolve,reject) =>{
        try {
            const self = this
            if (this.PromiseState === 'resolved'){
                let res = onResolved(this.PromiseResult)
                if(res instanceof Promise){
                    res.then(value => {
                        resolve(value)
                    },reason => {
                        reject(reason)
                    })
                }else{
                    resolve(res)
                }
            }
            if (this.PromiseState === 'rejected') {
                let res=onRejected(this.PromiseResult)
                if(res instanceof Promise){
                    res.then(value => {
                        resolve(value)
                    },reason=>{
                        reject(reason)
                    })
                }else{
                    reject(res)
                }
            }
            if (this.PromiseState === 'pending') {
                this.callbacks.push({
                    onResolved:function () {
                        try {
                            let result =onResolved(self.PromiseResult)
                            if (result instanceof Promise){
                                result.then(v =>{
                                    resolve(v)
                                },r=>{
                                    reject(r)
                                })
                            }else {
                                resolve(result)
                            }
                        }catch (e)
                        {
                            reject(e)
                        }

                    },
                    onRejected:function () {
                        try {
                            let result= onRejected(self.PromiseResult)
                            if (result instanceof Promise){
                                result.then(v =>{
                                    resolve(v)
                                },r=>{
                                    reject(r)
                                })
                            }else {
                                resolve(result)
                            }
                        }catch (e){
                            reject(e)
                        }
                    }
                })
            }
        }catch (e) {
            reject(e)
        }

    })

}
