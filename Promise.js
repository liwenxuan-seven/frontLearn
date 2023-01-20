class Promise {
    //添加构造函数
    constructor(executor) {
        //执行器函数同步调用
        this.PromiseState='pending'
        this.PromiseResult=null
        const self = this
        this.callbacks = []
        function resolve(data) {
            if(self.PromiseState !== 'pending') return;
            self.PromiseState='resolved'
            self.PromiseResult=data
            setTimeout(()=>{
                self.callbacks.forEach(item => {
                    item.onResolved(data)
                })
            })

        }
        const reject = (data)=>{
            if(this.PromiseState !== 'pending') return;
            this.PromiseState='rejected'
            this.PromiseResult=data
            setTimeout(()=>{
                this.callbacks.forEach(item =>{
                    item.onRejected(data)
                })
            })
        }
        try {
            executor(resolve,reject)
        }catch (e) {
            reject(e)
        }
    }
    //添加then方法
    then(onResolved,onRejected){
        const self = this
        if (typeof onRejected !== 'function'){
            onRejected = reason =>{
                throw reason
            }
        }
        if (typeof onResolved !== 'function'){
            onResolved = value => value
        }
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
                    setTimeout(()=>{
                        callback(onResolved)
                    })
                }
                if (this.PromiseState === 'rejected') {
                    setTimeout(()=>{
                        callback(onRejected)
                    })
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
    //添加catch方法
    catch(onRejected) {
        return this.then(undefined,onRejected)
    }
    //添加resolve方法
    static resolve(value) {
        return new Promise((resolve,reject)=>{
            if (value instanceof Promise){
                value.then(v =>{
                    resolve(v)
                },r =>{
                    reject(r)
                })
            }else {
                resolve(value)
            }
        })
    }
    //添加reject方法
    static reject(reason) {
        return new Promise((resolve,reject)=>{
            reject(reason)
        })
    }
    //添加all方法
    static all(promises) {
        return new Promise((resolve,reject) =>{
            let arr =[]
            let count =0
            for(let i=0;i<promises.length;i++){
                promises[i].then(v=>{
                    count++
                    arr[i]=v
                    if(count === promises.length){
                        resolve(arr)
                    }
                },r=>{
                    reject(r)
                })
            }
        })
    }
    //添加race方法
    static race(promises) {
        return new Promise((resolve,reject)=>{
            for(let i = 0;i<promises.length;i++){
                promises[i].then(v=>{
                    resolve(v)
                },r=>{
                    reject(r)
                })
            }

        })

    }
}


