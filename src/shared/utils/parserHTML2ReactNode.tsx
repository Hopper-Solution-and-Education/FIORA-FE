import React, { ReactNode } from 'react';

/**
 * Convert inline style string to React style object
 */
function parseStyle(style: string): React.CSSProperties {
  return style
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean)
    .reduce<Record<string, string>>((acc, rule) => {
      const [key, value] = rule.split(':');
      if (!key || !value) return acc;

      const camelKey = key.trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase());

      acc[camelKey] = value.trim();
      return acc;
    }, {});
}

/**
 * Convert DOM attributes to React props
 */
function domAttributesToProps(el: Element): Record<string, any> {
  const props: Record<string, any> = {};

  for (const attr of Array.from(el.attributes)) {
    let name = attr.name;
    let value: any = attr.value;

    if (name === 'class') {
      name = 'className';
    }

    if (name === 'style') {
      value = parseStyle(value);
    }

    props[name] = value;
  }

  return props;
}

/**
 * Recursively convert DOM Node → ReactNode
 */
function domNodeToReact(node: ChildNode, key?: React.Key): ReactNode {
  // Text node
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent;
  }

  // Element node
  if (node.nodeType === Node.ELEMENT_NODE) {
    const el = node as Element;
    const tag = el.tagName.toLowerCase();
    const props = domAttributesToProps(el);

    if (key !== undefined) {
      props.key = key;
    }

    const children = Array.from(el.childNodes).map((child, i) => domNodeToReact(child, i));

    return React.createElement(tag, props, children.length ? children : undefined);
  }

  return null;
}

/**
 * Main function
 */
export function htmlToReactNode(html: string): ReactNode {
  if (!html) return null;

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  return Array.from(doc.body.childNodes).map((node, i) => domNodeToReact(node, i));
}
