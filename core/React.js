function render(el, container) {
    console.log('el', el)
    initialWork = {
        dom: container,
        props: {
            children: [el.type]
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
            children: children.map(child => typeof child === 'object' ? child : createTextNode(child))
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

    let parentWork = work.parent
    while (!parentWork.dom) {
        parentWork = parentWork.parent
    }

    if (work.dom) {
        parentWork.dom.appendChild(work.dom)
    }

    commitWork(work.child)
    commitWork(work.sibling)
}

function createDom(type) {
    // 虚拟dom


    const dom = type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(type);
    return dom
}

function addProps(dom, props) {
    if (!props) {
        return
    }
    Object.keys(props).forEach(key => {
        if (key !== 'children') {
            dom[key] = props[key]
        }
    })
}

function initChildren(work, children) {
    if (!children) {
        return
    }
    let preWork = null
    children.forEach((child, index) => {
        const newWork = {
            dom: null,
            props: child.props,
            child: null,
            sibling: null,
            parent: work,
            type: child.type ? child.type : 'TEXT_ELEMENT'
        }
        if (index === 0) {
            work.child = newWork
        } else {
            preWork.sibling = newWork
        }
        preWork = newWork
    })


}



function performUnitOfWork(work) {
    const isFunctionComponent = work.type instanceof Function

    if (!isFunctionComponent) {
        if (!work.dom) {
            work.dom = createDom(work.type);
            addProps(work.dom, work.props)
        }
    }

    const children = isFunctionComponent ? [work.type(work.props)] : work.props.children

    initChildren(work, children)

    if (work.child) {
        return work.child
    }

    if (work.sibling) {
        return work.sibling
    }

    while (work.parent) {
        if (work.parent.sibling) {
            return work.parent.sibling
        }
        work = work.parent
    }
}

const React = {
    createElement,
    createTextNode,
    render
}

export default React