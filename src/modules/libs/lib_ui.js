function setElementAttribute(element, attribute, value) {
  if (typeof element === 'string') {
    document.querySelector(element).setAttribute(attribute, value);
  } else {
    element.setAttribute(attribute, value);
  }
}

function getElementAttribute(element, attribute) {
  if (typeof element === 'string') {
    return document.querySelector(element).getAttribute(attribute);
  }
  return element.getAttribute(attribute);
}

function removeElementAttribute(element, attribute) {
  if (typeof element === 'string') {
    document.querySelector(element).removeAttribute(attribute);
  } else {
    element.removeAttribute(attribute);
  }
}

function setDisabled(element) {
  if (typeof element === 'string') {
    document.querySelector(element).setAttribute('disabled', '');
  } else {
    element.setAttribute('disabled', '');
  }
}

function setEnabled(element) {
  if (typeof element === 'string') {
    document.querySelector(element).removeAttribute('disabled');
  } else {
    element.removeAttribute('disabled');
  }
}

function showElement(element) {
  if (typeof element === 'string') {
    document.querySelector(element).classList.remove('hidden');
  } else {
    element.classList.remove('hidden');
  }
}

function hideElement(element) {
  if (typeof element === 'string') {
    document.querySelector(element).classList.add('hidden');
  } else {
    element.classList.add('hidden');
  }
}

function createElement(elementType, classList, id, text, attributes) {
  const element = document.createElement(elementType);
  if (classList) {
    classList.split(' ').forEach((c) => element.classList.add(c));
  }
  if (id) {
    element.setAttribute('id', id);
  }
  if (text) {
    element.textContent = text;
  }
  if (attributes) {
    if (Array.isArray(attributes)) {
      attributes.forEach((attr) => element.setAttribute(attr.name, attr.value));
    } else {
      element.setAttribute(attributes.name, attributes.value);
    }
  }
  return element;
}

function addElement(destination, elementType, classList, id, text, attributes, position = 'end') {
  const element = createElement(elementType, classList, id, text, attributes, position);
  const insert = {
    begin() {
      if (typeof destination === 'string') {
        document.querySelector(destination).prepend(element);
      } else {
        destination.prepend(element);
      }
    },
    end() {
      if (typeof destination === 'string') {
        document.querySelector(destination).append(element);
      } else {
        destination.append(element);
      }
    },
  };
  insert[position]();
}

async function loadSvg(path) {
  const svg = await fetch(path).then((response) => response.text()).then((data) => data);
  return svg;
}

export {
  setElementAttribute,
  getElementAttribute,
  removeElementAttribute,
  setDisabled,
  setEnabled,
  showElement,
  hideElement,
  createElement,
  addElement,
  loadSvg,
};
