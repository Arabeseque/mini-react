function render(el, container) {
    initialWork = {
        dom: container,
        props: {
            children: [el]
        }
    }

    root = initialWork
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

let root = null
let initialWork = null
function workLoop(deadline) {
    let shouldYield = false
    while (!shouldYield && initialWork) {
        shouldYield = deadline.timeRemaining() < 1
        initialWork = performUnitOfWork(initialWork)
    }

    if (root) {
        commitRoot()
    }

    requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

function commitRoot() {
    commitWork(root.child)
    root = null
}

function commitWork(work) {
    if (!work) {
        return
    }

    let parentDom = work.parent.dom
    while (!parentDom) {
        parentDom = work.parent.dom
    }

    parentDom.appendChild(work.dom)

    commitWork(work.child)
    commitWork(work.sibling)
}

function createDom(type) {
    const dom = type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(type);
    return dom
}

function addProps(dom, props) {
    Object.keys(props).forEach(key => {
        if (key !== 'children') {
            dom[key] = props[key]
        }
    })
}

function initChildren(work) {
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


}

function performUnitOfWork(work) {
    if (!work.dom) {
        work.dom = createDom(work.type);
        addProps(work.dom, work.props)

    }

    initChildren(work)

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