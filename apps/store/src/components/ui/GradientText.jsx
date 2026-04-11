import React from 'react';

// This component takes text as its 'children' and applies our new CSS effect.
function GradientText({ children, sx, ...props }) {
  return (
    // The main element gets the helper class and the text is passed via the 'data-text' attribute.
    <div className="inverse-gradient-text" data-text={children} {...props}>
      {/* The actual text is wrapped in a span so we can target it in our CSS for the top layer */}
      <span>{children}</span>
    </div>
  );
}

export default GradientText;