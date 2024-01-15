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
        const dom = work.dom = createDom(work.type);
        work.parent.dom.append(dom);
    }

    if (work.props) {
        addProps(work.dom, work.props)
    }

    if (work.props.children) {
        initChildren(work)
    }

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