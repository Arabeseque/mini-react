function render(el, container) {
    initialWork = {
        dom: container,
        props: {
            children: [el]
        }
    }
}

function createTextNode(text) {
    return {
        type: 'TEXT_ELEMENT',
        props: {
            nodeValue: text,
            children: []
        }
    }
}

function createElement(type, props, ...children) {
    return {
        type,
        props: {
            ...props,
            children
        }
    }
}

let initialWork = null
function workLoop(deadline) {
    let shouldYield = false
    while (!shouldYield && initialWork) {
        shouldYield = deadline.timeRemaining() < 1
        initialWork = performUnitOfWork(initialWork)
    }

    requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

function performUnitOfWork(work) {
    // 1.创建DOM
    if (!work.dom) {
        const dom = work.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(work.type);
        work.dom = dom;
        work.parent.dom.append(dom);

    }

    // 2.给DOM添加属性
    Object.keys(work.props).forEach(key => {
        if (key !== 'children') {
            work.dom[key] = work.props[key];
        }
    })

    // 3.转换链表
    const children = work.props.children || [];
    let preWork = null
    children.forEach((child, index) => {
        const newWork = {
            dom: null,
            props: child.props,
            child: null,
            sibling: null,
            parent: work,
            type: child.type
        }
        if (index === 0) {
            work.child = newWork
        } else {
            preWork.sibling = child
        }
        preWork = newWork
    })

    if (work.child) {
        return work.child
    }

    if (work.sibling) {
        return work.sibling
    }

    return work.parent?.sibling


}

const React = {
    createElement,
    createTextNode,
    render
}

export default React