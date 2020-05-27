# 每周总结可以写在这里

    js引擎每执行一次 evaluateScript or callWithArgument 进入js引擎就生成一段宏任务。
    微任务是保存在引擎内部的队列。

    代码的执行顺序，宏任务依次执行，微任务在各自的宏任务内依次执行

    