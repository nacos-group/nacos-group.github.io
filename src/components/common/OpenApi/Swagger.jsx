import React, { useEffect, useRef } from 'react';
import { SwaggerUIBundle, SwaggerUIStandalonePreset } from 'swagger-ui-dist';
import jsyaml from 'js-yaml';

const SwaggerUIComponent = (props) => {
  const { specContent='' } = props;
  const containerRef = useRef(null);

  const start = () => {
    try {
      const shadowRoot = containerRef.current.attachShadow({ mode: 'open' });
      const swaggerStyles = document.createElement('link');
      swaggerStyles.rel = 'stylesheet';
      swaggerStyles.href = 'https://unpkg.com/swagger-ui-dist/swagger-ui.css';
      shadowRoot.appendChild(swaggerStyles);
      const div = document.createElement('div');
      div.setAttribute('id','swagger-ui-div');
      shadowRoot.appendChild(div);

      const specObject = jsyaml.load(specContent);
      SwaggerUIBundle({
          // url: 'https://petstore.swagger.io/v2/swagger.json', // 方式一
          spec: specObject, // 方式二
          domNode: div,
          presets: [
              SwaggerUIBundle.presets.apis,
              SwaggerUIStandalonePreset
          ],
          layout: "StandaloneLayout"
      });
    } catch(err) {}
  }
  useEffect(() => {
    if (containerRef.current) {
      start()
    }
  }, []);

  return <div ref={containerRef}></div>;
};

export default SwaggerUIComponent;