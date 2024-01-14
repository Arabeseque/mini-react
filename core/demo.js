let taskId = 1
function workLoop(deadline) {
    let shouldYield = false
    while (!shouldYield) {
        console.log(`task ${taskId++}`)
        shouldYield = deadline.timeRemaining() < 1
    }

    requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)